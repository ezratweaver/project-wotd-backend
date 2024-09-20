import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import { compareSync } from "bcrypt";
import LoginRequestBodyType from "../../schemas/LoginRequestBody";
import { generateEmailTokenCookie } from "../../helper/generateEmailTokenCookie";
import { sendEmailForEmailVerfication } from "../../helper/emailForEmailVerification";
import sendEmailAndSetCookie from "../../utils/sendEmailAndSetCookie";
import setAuthenticationCookie from "../../utils/setAuthenticationCookie";

const url = "/login";
const method = "POST";
const schema = {
  operationId: "login",
  tags: ["Authentication"],
  summary:
    "Authenitcates the user, and gives a cookie with a JWT for authentication",
} as FastifySchema;

const invalidUserNameOrPassword = {
  error: "Bad Authentication",
  message: "Email or Password is invalid.",
};

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as LoginRequestBodyType;

  if (request.cookies.authentication) {
    return reply.status(400).send({
      error: "Already Authenticated",
      message: "You are already authenticated.",
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return reply.status(401).send(invalidUserNameOrPassword);
  }

  if (!user.emailVerified) {
    await sendEmailAndSetCookie({
      email: user.email,
      firstName: user.firstName,
      reply,
    });

    return reply.status(403).send({
      error: "Email Not Verified.",
      message:
        "Email for this user is not verified. An email has been sent for verification.",
    });
  }

  const passwordIsValid = compareSync(password + user.salt, user.password);

  if (passwordIsValid) {
    await setAuthenticationCookie({
      email: user.email,
      userKey: user.userKey,
      reply,
    });

    return reply.status(200).send({
      result: "Success",
      message: "Login successful.",
    });
  }

  return reply.status(401).send(invalidUserNameOrPassword);
};

const login = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: LoginRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("LoginRequestBody"),
      response: {
        200: $ref("GenericResponse"),
        400: $ref("GenericResponse"),
        401: $ref("GenericResponse"),
        403: $ref("GenericResponse"),
      },
    },
    handler,
    url,
  });
};

export default login;
