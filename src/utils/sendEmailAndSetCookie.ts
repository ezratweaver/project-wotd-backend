import { FastifyReply } from "fastify";
import { generateEmailTokenCookie } from "../helper/generateEmailTokenCookie";
import { sendEmailForEmailVerfication } from "../helper/emailForEmailVerification";
import { sendEmailForForgotPassword } from "../helper/emailForForgotPassword";

export const sendVerificationEmailAndSetCookie = async ({
  email,
  firstName,
  reply,
}: {
  email: string;
  firstName: string;
  reply: FastifyReply;
}) => {
  const otp = await generateEmailTokenCookie(email, reply);

  sendEmailForEmailVerfication({
    email,
    firstName,
    token: otp,
  });
};

export const sendForgotPasswordEmailAndSetCookie = async ({
  email,
  firstName,
  reply,
}: {
  email: string;
  firstName: string;
  reply: FastifyReply;
}) => {
  const otp = await generateEmailTokenCookie(email, reply);

  sendEmailForForgotPassword({
    email,
    firstName,
    token: otp,
  });
};

export default sendVerificationEmailAndSetCookie;
