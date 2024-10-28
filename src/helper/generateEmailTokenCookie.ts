import { FastifyReply } from "fastify";
import { generateOTP } from "./otpHelpers";
import { dateWithOffset } from "./dateHelpers";

export interface EmailTokenType {
  token: string;
  email: string;
  expires: Date;
}

export const generateEmailTokenCookie = async (
  email: string,
  reply: FastifyReply,
) => {
  const otp = generateOTP(+(process.env.OTP_LENGTH ?? 16));

  const tokenToSign: EmailTokenType = {
    token: otp,
    email,
    expires: dateWithOffset(1),
  };

  const jwtEmailToken = await reply.jwtSign(tokenToSign);

  reply.setCookie("email", jwtEmailToken);

  return otp;
};
