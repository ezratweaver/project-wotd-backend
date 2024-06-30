import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import SignUpRequestBody from "../../schemas/SignUpRequestBody";

const url = "/signup";
const method = "POST";
const schema = {
  operationId: "signUp",
  tags: ["Authentication"],
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, firstName, password } = request.body as SignUpRequestBody;

  const response = await prisma.user.findUnique({ where: { email } });

  if (response) {
    return reply
      .status(402)
      .send({ result: "Fail", message: "Email is already in use." });
  }

  await prisma.user.create({
    data: {
      email,
      firstName,
      password,
    },
  });

  return reply
    .status(201)
    .send({ result: "Success", message: "New user was created successfully." });
};

const signUp = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: SignUpRequestBody }>({
    method,
    schema: {
      ...schema,
      body: $ref("signUpRequestBody"),
      response: {
        201: $ref("genericResponse"),
      },
    },
    handler,
    url,
  });
};

export default signUp;
