import { FastifyReply } from "fastify";

const setAuthenticationCookie = async ({
  email,
  userKey,
  reply,
}: {
  email: string;
  userKey: number;
  reply: FastifyReply;
}) => {
  const authentication = await reply.jwtSign({
    email,
    userKey,
  });

  reply.setCookie("authentication", authentication);
};

export default setAuthenticationCookie;
