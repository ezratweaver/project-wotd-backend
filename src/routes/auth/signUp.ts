import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { $ref } from "../../app";
import prisma from "../../database";
import SignUpRequestBody from "../../schemas/SignUpRequestBody";

const url = "/signup";
const method = "POST";
const schema = {
  response: {
    201: {},
  },
};

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, firstName, password } = request.body as SignUpRequestBody;

  prisma.user.create({
    data: {
      email,
      firstName,
      password,
    },
  });

  return reply
    .status(201)
    .send({ result: "success", message: "New user was created successfully" });
};

const signUp = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: SignUpRequestBody }>({
    method,
    schema: {
      ...schema,
      body: $ref("signUpRequestBody"),
    },
    handler,
    url,
  });
};

export default signUp;
