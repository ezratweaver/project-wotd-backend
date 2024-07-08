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

const url = "/login";
const method = "POST";
const schema = {
  operationId: "login",
  tags: ["Authentication"],
  summary:
    "Endpoint that authenitcates the user, and gives a cookie with a jwt for authentication",
} as FastifySchema;

const invalidUserNameOrPassword = {
  error: "Bad Authentication",
  message: "Email or Password is invalid.",
};

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as LoginRequestBodyType;

  if (request.cookies.authentication) {
    reply.status(400).send({
      error: "Already Authenticated",
      message: "You are already authenticated.",
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return reply.status(401).send(invalidUserNameOrPassword);
  }

  const passwordIsValid = compareSync(password + user.salt, user.password);

  if (passwordIsValid) {
    const authentication = await reply.jwtSign({
      userKey: user.userKey,
      email: user.email,
    });

    reply.setCookie("authentication", authentication);

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
      },
    },
    handler,
    url,
  });
};

export default login;
