import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const authHandler = async (
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authentication = request.cookies.authentication;

  if (!authentication) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "You are not authorized to use this resource.",
    });
  }

  const decodedPayload = server.jwt.verify(authentication);

  request.user = decodedPayload as { userKey: number; email: string };
};

export default authHandler;
