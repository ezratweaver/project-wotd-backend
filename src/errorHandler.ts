import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

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
    case "FST_JWT_NO_AUTHORIZATION_IN_HEADER":
      return reply.status(401).send({
        error: "Unauthorized",
        message: "You are not authorized to use this resource.",
      });
    default:
      return reply.status(500).send({
        error: "Internal Server Error",
        message: "An internal server error has occured.",
      });
  }
};

export default errorHandler;
