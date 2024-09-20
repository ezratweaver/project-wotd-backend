import { FastifyReply } from "fastify";
import { generateEmailTokenCookie } from "../helper/generateEmailTokenCookie";
import { sendEmailForEmailVerfication } from "../helper/emailForEmailVerification";

const sendEmailAndSetCookie = async ({
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

export default sendEmailAndSetCookie;
