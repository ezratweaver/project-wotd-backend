import { sendEmail } from "../mailer";

export const sendEmailForEmailVerfication = (to: string, token: string) => {
  sendEmail({
    to,
    subject: `Verify Email For ${process.env.APP_NAME as string}`,
    text: `
      Your token to verify your email is here!

      ${token}

      This token will expire in 24 hours.
      `,
  });
};
