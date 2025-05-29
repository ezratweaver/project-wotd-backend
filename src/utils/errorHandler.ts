import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { unauthorizedError } from "./authHandler";

const sanitizeErrorMessage = (error: FastifyError) => {
  if (process.env.NODE_ENV !== "test") {
    switch (error.code) {
      case "FST_ERR_VALIDATION":
        return "Invalid request data provided.";
      case "FAST_JWT_MALFORMED":
      case "FAST_JWT_INVALID_SIGNATURE":
        return "Invalid authentication token.";
      default:
        return "An unexpected error occurred.";
    }
  }
  return error.message;
};

const errorHandler = (
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  // Always log the full error for debugging
  console.error(error);

  switch (error.code) {
    case "FST_ERR_VALIDATION":
      return reply.status(400).send({
        error: "Bad Request",
        message: sanitizeErrorMessage(error),
      });
    case "FAST_JWT_MALFORMED":
    case "FAST_JWT_INVALID_SIGNATURE":
      return reply.status(401).send(unauthorizedError);
    default:
      return reply.status(500).send({
        error: "Service failed",
        message: sanitizeErrorMessage(error),
      });
  }
};

export default errorHandler;
