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
import sendVerificationEmailAndSetCookie from "../../utils/sendEmailAndSetCookie";
import setAuthenticationCookie from "../../utils/setAuthenticationCookie";

const url = "/login";
const method = "POST";
const schema = {
  operationId: "login",
  tags: ["Authentication"],
  summary:
    "Authenitcates the user, and gives a cookie with a JWT for authentication",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const requestBody = request.body as LoginRequestBodyType;

  const email = requestBody.email.toLowerCase();
  const password = requestBody.password;

  if (request.cookies.authentication) {
    return reply.status(400).send({
      error: "Already Authenticated",
      message: "You are already authenticated.",
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return reply.status(401).send({
      error: "Bad Authentication",
      message: "Invalid email or password.",
    });
  }

  if (!user.emailVerified) {
    await sendVerificationEmailAndSetCookie({
      email: user.email,
      firstName: user.firstName,
      reply,
    });

    return reply.status(403).send({
      error: "Email Not Verified",
      message: "Please verify your email address. A verification email has been sent.",
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

  return reply.status(401).send({
    error: "Bad Authentication",
    message: "Invalid email or password.",
  });
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
