import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import ForgotPasswordRequestBodyType from "../../schemas/ForgotPasswordRequestBody";
import { $ref } from "../../app";
import prisma from "../../database";
import { sendForgotPasswordEmailAndSetCookie } from "../../utils/sendEmailAndSetCookie";

const url = "/forgot-password";
const method = "POST";
const schema = {
  operationId: "forgotPassword",
  tags: ["Authentication"],
  summary:
    "Given an email, sends a token to that email to set up the proccess to reset account password.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const email = (
    request.body as ForgotPasswordRequestBodyType
  ).email.toLowerCase();

  const accountFromDb = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!accountFromDb) {
    return reply.status(200).send();
  }

  await sendForgotPasswordEmailAndSetCookie({
    email,
    firstName: accountFromDb.firstName,
    reply,
  });

  return reply.status(200).send();
};

const forgotPassword = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: ForgotPasswordRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("ForgotPasswordRequestBody"),
    },
    handler,
    url,
  });
};

export default forgotPassword;
