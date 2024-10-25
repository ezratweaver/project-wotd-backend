import { FastifyReply, FastifyRequest } from "fastify";
import { EmailTokenType } from "../helper/generateEmailTokenCookie";

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

  let verifiedToken: EmailTokenType;
  try {
    verifiedToken = await request.decodeToken(unsignedEmailCookie);
  } catch (err) {
    return reply.status(401).send(invalidEmailToken);
  }

  if (verifiedToken.token !== userGivenToken) {
    return reply.status(401).send(invalidEmailToken);
  }

  if (new Date() > verifiedToken.expires) {
    return reply.status(401).send({
      error: "Email Token Expired",
      message: "Token to verify email has already expired.",
    });
  }

  return verifiedToken;
};

export default verifyToken;
