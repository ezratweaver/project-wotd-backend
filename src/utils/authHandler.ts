import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { unsign } from "@fastify/cookie";
import { UserJWT } from "../app";

export const unauthorizedError = {
  error: "Unauthorized",
  message: "You are not authorized to use this resource.",
};

const authHandler = async (
  server: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (!request.cookies.authentication) {
    return reply.status(401).send(unauthorizedError);
  }

  const authentication = unsign(
    request.cookies.authentication,
    process.env.COOKIE_SECRET_KEY as string,
  );

  if (!authentication.value || !authentication.valid) {
    return reply.status(401).send(unauthorizedError);
  }

  const decodedPayload = server.jwt.verify(authentication.value);

  request.user = decodedPayload as UserJWT;
};

export default authHandler;
