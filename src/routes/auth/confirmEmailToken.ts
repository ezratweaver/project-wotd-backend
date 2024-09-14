import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import ConfirmEmailTokenRequestBodyType from "../../schemas/ConfirmEmailTokenRequestBody";
import { $ref } from "../../app";
import { EmailTokenType } from "./signUp";
import prisma from "../../database";

const url = "/confirm-email-token";
const method = "POST";
const schema = {
  operationId: "confirmEmailToken",
  tags: ["Authentication"],
  summary: "Given a email token, marks user email as verified",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { token } = request.body as ConfirmEmailTokenRequestBodyType;

  const verifiedToken: EmailTokenType = await request.decodeToken(token);

  if (new Date() > verifiedToken.expires) {
    return reply.status(401).send({
      error: "Email Token Expired",
      message: "Token to verify email has already expired.",
    });
  }

  const unverifiedUser = await prisma.user.findUnique({
    where: {
      email: verifiedToken.email,
    },
  });

  if (!unverifiedUser) {
    return reply.status(401).send({
      error: "Non Existing User",
      message: "User with email from token does not exist.",
    });
  }

  if (unverifiedUser.emailVerified) {
    return reply.status(401).send({
      error: "Email Already Verified",
      message: "This email has already been verified.",
    });
  }

  const verifiedUser = await prisma.user.update({
    where: {
      email: verifiedToken.email,
    },
    data: {
      emailVerified: true,
    },
  });

  const authentication = await reply.jwtSign({
    userKey: verifiedUser.userKey,
    email: verifiedUser.email,
  });

  reply.setCookie("authentication", authentication);

  return reply.status(200).send({
    result: "Success",
    message: "Email successfully verified.",
  });
};

const confirmEmailToken = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: ConfirmEmailTokenRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("ConfirmEmailTokenRequestBody"),
      response: {
        401: $ref("GenericResponse"),
        200: $ref("GenericResponse"),
      },
    },
    handler,
    url,
  });
};

export default confirmEmailToken;
