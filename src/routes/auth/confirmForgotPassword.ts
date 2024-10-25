import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import ConfirmEmailTokenRequestBodyType from "../../schemas/ConfirmEmailTokenRequestBody";
import { $ref } from "../../app";
import verifyToken from "../../utils/verifyToken";
import prisma from "../../database";

const url = "/confirm-forgot-password";
const method = "POST";
const schema = {
  operationId: "confirmForgotPassword",
  tags: ["Authentication"],
  summary: "Confirm token given from email for resetting password.",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { token } = request.body as ConfirmEmailTokenRequestBodyType;

  const emailCookie = request.cookies["email"];

  const verifiedToken = await verifyToken({
    emailCookie,
    userGivenToken: token,
    request,
    reply,
  });

  const userFromToken = await prisma.user.findUnique({
    where: {
      email: verifiedToken.email,
    },
  });

  if (!userFromToken) {
    return reply.status(404).send({
      error: "User Not Found",
      message: "The user associated with this token was not found.",
    });
  }

  const allowPasswordReset = await reply.jwtSign({
    allowedToReset: true,
    email: userFromToken.email,
  });

  reply.setCookie("resetPassword", allowPasswordReset);

  reply.status(200).send({
    result: "Success",
    message: "Email successfully verified.",
  });
};

const confirmForgotPassword = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: ConfirmEmailTokenRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("ConfirmForgotPasswordRequestBody"),
      response: {
        404: $ref("GenericResponse"),
        200: $ref("GenericResponse"),
      },
    },
    handler,
    url,
  });
};

export default confirmForgotPassword;
