import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { $ref } from "../../app";

const url = "/signout";
const method = "DELETE";
const schema = {
  operationId: "signOut",
  tags: ["Authentication"],
} as FastifySchema;

const handler = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie("authentication");

  return reply.status(200).send({
    result: "Success",
    message: "You have been successfully signed out.",
  });
};

const signOut = async (fastify: FastifyInstance) => {
  fastify.route({
    method,
    schema: {
      ...schema,
      response: {
        200: $ref("GenericResponse"),
      },
    },
    handler,
    preHandler: [fastify.authenticate],
    url,
  });
};

export default signOut;
