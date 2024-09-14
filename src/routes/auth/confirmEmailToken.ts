import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import ConfirmEmailTokenRequestBodyType from "../../schemas/ConfirmEmailTokenRequestBody";
import { $ref } from "../../app";

const url = "/confirm-email-token";
const method = "POST";
const schema = {
  operationId: "confirmEmailToken",
  tags: ["Authentication"],
  summary: "Given a email token, marks user email as verified",
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  const { token } = request.body as ConfirmEmailTokenRequestBodyType;
};

const confirmEmailToken = async (fastify: FastifyInstance) => {
  fastify.route<{ Body: ConfirmEmailTokenRequestBodyType }>({
    method,
    schema: {
      ...schema,
      body: $ref("ConfirmEmailTokenRequestBody"),
    },
    handler,
    url,
  });
};

export default confirmEmailToken;
