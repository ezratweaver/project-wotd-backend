import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { unsign } from "@fastify/cookie";

const authHandler = async (
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (!request.cookies.authentication) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "You are not authorized to use this resource.",
    });
  }

  const authentication = unsign(
    request.cookies.authentication,
    process.env.COOKIE_SECRET_KEY as string,
  );

  if (!authentication.value) {
    return reply.status(401).send({
      error: "Unauthorized",
      message: "You are not authorized to use this resource.",
    });
  }

  const decodedPayload = server.jwt.verify(authentication.value);

  request.user = decodedPayload as { userKey: number; email: string };
};

export default authHandler;
