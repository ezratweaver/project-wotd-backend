import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import ResendEmailTokenRequestBodyType from "../../schemas/ResendEmailTokenRequestBody";
import { $ref } from "../../app";
import prisma from "../../database";

const url = "/resend-email-token";
const method = "POST";
const schema = {
  operationId: "resendEmailToken",
  tags: ["Authentication"],
  summary:
    "Takes an email, and if user exists, and the email isn't already verified, resend email verification token.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email } = request.body as ResendEmailTokenRequestBodyType;

  const userFromDB = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userFromDB) {
    return reply.status(401).send({
      error: "User Not Found",
      message: "A user with the given email does not exist.",
    });
  }
};

const resendEmailToken = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: ResendEmailTokenRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("ResendEmailTokenRequestBody"),
    },
    handler,
    url,
  });
};

export default resendEmailToken;
