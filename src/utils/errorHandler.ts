import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { unauthorizedError } from "./authHandler";

const errorHandler = (
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  console.log(error);

  switch (error.code) {
    case "FST_ERR_VALIDATION":
      return reply.status(400).send({
        error: "Bad Request",
        message: error.message,
      });
    case "FAST_JWT_MALFORMED":
    case "FAST_JWT_INVALID_SIGNATURE":
      return reply.status(401).send(unauthorizedError);
    default:
      return reply.status(500).send({
        error: "Service failed",
        message: "A service could not be completed.",
      });
  }
};

export default errorHandler;
