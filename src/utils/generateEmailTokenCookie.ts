import { FastifyReply } from "fastify";
import { generateOTP } from "../helper/otpHelpers";
import { dateWithOffset } from "../helper/dateHelpers";

export interface EmailTokenType {
  token: string;
  email: string;
  expires: Date;
}

export const generateEmailTokenCookie = async (
  email: string,
  reply: FastifyReply,
) => {
  const otp = generateOTP(16);

  const tokenToSign: EmailTokenType = {
    token: otp,
    email,
    expires: dateWithOffset(1),
  };

  const jwtEmailToken = await reply.jwtSign(tokenToSign);

  reply.setCookie("email", jwtEmailToken);

  return otp;
};
