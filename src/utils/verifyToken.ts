import { FastifyReply, FastifyRequest } from "fastify";
import { EmailTokenType } from "../helper/generateEmailTokenCookie";
import prisma from "../database";

const invalidEmailToken = {
  error: "Email Token Invalid",
  message: "Email token provided is invalid.",
};

const verifyToken = async ({
  emailCookie,
  userGivenToken,
  request,
  reply,
}: {
  emailCookie: string | undefined;
  userGivenToken: string;
  request: FastifyRequest;
  reply: FastifyReply;
}): Promise<EmailTokenType> => {
  if (!emailCookie) {
    return reply.status(401).send(invalidEmailToken);
  }

  const unsignedEmailCookie = request.unsignCookie(emailCookie).value;

  if (!unsignedEmailCookie) {
    return reply.status(401).send(invalidEmailToken);
  }

  let verifiedToken: EmailTokenType | null;
  try {
    verifiedToken = await request.decodeToken(unsignedEmailCookie);
  } catch (err) {
    return reply.status(401).send(invalidEmailToken);
  }

  if (!verifiedToken) return reply.status(401).send(invalidEmailToken);

  if (verifiedToken.token !== userGivenToken) {
    return reply.status(401).send(invalidEmailToken);
  }

  if (new Date() > verifiedToken.expires) {
    return reply.status(401).send({
      error: "Email Token Expired",
      message: "Token to verify email has already expired.",
    });
  }

  await prisma.jWTBlacklist.create({
    data: {
      jwt: unsignedEmailCookie,
    },
  });

  return verifiedToken;
};

export default verifyToken;
