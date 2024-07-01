import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

const errorHandler = (
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  switch (error.code) {
    case "FST_ERR_VALIDATION":
      return reply.status(400).send({
        result: "Bad Request",
        message: error.message,
      });
    default:
      return reply.status(500).send({
        result: "Internal Server Error",
        message: "An internal server error has occured.",
      });
  }
};

export default errorHandler;
