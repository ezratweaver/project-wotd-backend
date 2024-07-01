import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import SignUpRequestBodyType from "../../schemas/SignUpRequestBody";

const url = "/signup";
const method = "POST";
const schema = {
  operationId: "signUp",
  tags: ["Authentication"],
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, firstName, password } = request.body as SignUpRequestBodyType;

  const response = await prisma.user.findUnique({ where: { email } });

  if (response) {
    return reply.status(409).send({
      error: "EmailInUse",
      message: "Email is already in use.",
    });
  }

  await prisma.user.create({
    data: {
      email,
      firstName,
      password,
    },
  });

  reply.setCookie("authentication", "true");

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
