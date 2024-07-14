import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import SignUpRequestBodyType from "../../schemas/SignUpRequestBody";
import { hashSync } from "bcrypt";
import { randomBytes } from "crypto";

const url = "/signup";
const method = "POST";
const schema = {
  operationId: "signUp",
  tags: ["Authentication"],
  summary:
    "Creates user based off given information, then gives user a cookie with a JWT for authentication",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, firstName, password } = request.body as SignUpRequestBodyType;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = hashSync(password + salt, 1);

  if (existingUser) {
    return reply.status(409).send({
      error: "Email In Use",
      message: "Email is already in use.",
    });
  }

  const createdUser = await prisma.user.create({
    data: {
      email,
      firstName,
      password: hashedPassword,
      salt,
    },
  });

  const authentication = await reply.jwtSign({
    userKey: createdUser.userKey,
    email: createdUser.email,
  });

  reply.setCookie("authentication", authentication);

  return reply.status(201).send({
    result: "Success",
    message: "New user was created successfully.",
  });
};

const signUp = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: SignUpRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("SignUpRequestBody"),
      response: {
        201: $ref("GenericResponse"),
        409: $ref("GenericResponse"),
      },
    },
    handler,
    url,
  });
};

export default signUp;
