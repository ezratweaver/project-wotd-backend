import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import ResetPasswordRequestBodyType from "../../schemas/ResetPasswordRequestBody";
import { $ref } from "../../app";
import { randomBytes } from "crypto";
import { hashSync } from "bcrypt";
import prisma from "../../database";
import setAuthenticationCookie from "../../utils/setAuthenticationCookie";

const url = "/reset-password";
const method = "POST";
const schema = {
  operationId: "resetPassword",
  tags: ["Authentication"],
  summary:
    "Given a valid resetPassword jwt cookie, allows reseting user password from email in cookie.",
} as FastifySchema;

const invalidResetPasswordCookie = {
  error: "Invalid Reset Password Cookie",
  message: "The reset password cookie provided is invalid.",
};

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { password } = request.body as ResetPasswordRequestBodyType;

  const resetPasswordCookie = request.cookies["resetPassword"];

  if (!resetPasswordCookie) {
    return reply.status(401).send(invalidResetPasswordCookie);
  }

  const unsignedResetPasswordCookie =
    request.unsignCookie(resetPasswordCookie).value;

  if (!unsignedResetPasswordCookie) {
    return reply.status(401).send(invalidResetPasswordCookie);
  }

  let verifiedToken: {
    email: string;
    expires: Date;
  } | null;
  try {
    verifiedToken = await request.decodeToken(unsignedResetPasswordCookie);
  } catch (err) {
    return reply.status(401).send(invalidResetPasswordCookie);
  }

  if (!verifiedToken) return reply.status(401).send(invalidResetPasswordCookie);

  if (new Date() > verifiedToken.expires) {
    return reply.status(401).send(invalidResetPasswordCookie);
  }

  await prisma.jWTBlacklist.create({
    data: {
      jwt: unsignedResetPasswordCookie,
    },
  });

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = hashSync(password + salt, 10);

  const userFromDb = await prisma.user.update({
    data: {
      password: hashedPassword,
      salt,
    },
    where: {
      email: verifiedToken.email,
    },
  });

  if (userFromDb.emailVerified)
    await setAuthenticationCookie({
      userKey: userFromDb.userKey,
      email: userFromDb.email,
      reply,
    });

  return reply.status(200).send();
};

const resetPassword = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: ResetPasswordRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("ResetPasswordRequestBody"),
      response: {
        401: $ref("GenericResponse"),
        200: $ref("GenericResponse"),
      },
    },
    handler,
    url,
  });
};

export default resetPassword;
