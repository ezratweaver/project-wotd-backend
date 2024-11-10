import { FastifyReply, FastifyRequest } from "fastify";
import { EmailTokenType } from "../helper/generateEmailTokenCookie";
import prisma from "../database";

export const invalidEmailToken = {
  error: "Email Token Invalid",
  message: "Email token provided is invalid.",
};

const verifyToken = async ({
  emailCookie,
  userGivenToken,
  request,
}: {
  emailCookie: string | undefined;
  userGivenToken: string;
  request: FastifyRequest;
}): Promise<EmailTokenType | undefined> => {
  if (!emailCookie) {
    return undefined;
  }

  const unsignedEmailCookie = request.unsignCookie(emailCookie).value;

  if (!unsignedEmailCookie) {
    return undefined;
  }

  let verifiedToken: EmailTokenType | null;
  try {
    verifiedToken = await request.decodeToken(unsignedEmailCookie);
  } catch (err) {
    return undefined;
  }

  if (!verifiedToken) return undefined;

  if (verifiedToken.token !== userGivenToken) {
    return undefined;
  }

  if (new Date() > verifiedToken.expires) {
    return undefined;
  }

  await prisma.jWTBlacklist.create({
    data: {
      jwt: unsignedEmailCookie,
    },
  });

  return verifiedToken;
};

export default verifyToken;
