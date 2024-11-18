import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const NODEMAILER_SECURE = process.env.NODEMAILER_SECURE === "true";
const NODEMAILER_HOST = process.env.NODEMAILER_HOST;
const NODEMAILER_PORT = process.env.NODEMAILER_PORT;
const NODEMAILER_FROM = process.env.NODEMAILER_FROM;
const NODEMAILER_USERNAME = process.env.NODEMAILER_USERNAME;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;

if (
  typeof NODEMAILER_HOST === "undefined" ||
  typeof NODEMAILER_PORT === "undefined"
) {
  throw new Error(
    "Nodemailer env variables must be in '.env' to use nodemailer.",
  );
}

if (!NODEMAILER_FROM) {
  throw new Error("NODEMAILER_FROM is required to send emails.");
}

const mailer = createTransport({
  host: NODEMAILER_HOST,
  port: +NODEMAILER_PORT,
  secure: NODEMAILER_SECURE,
  auth: {
    user: NODEMAILER_USERNAME,
    pass: NODEMAILER_PASSWORD,
  },
});

export const sendEmail = (sendMailParams: Omit<Mail.Options, "from">) => {
  mailer.sendMail({
    from: NODEMAILER_FROM,
    ...sendMailParams,
  });
};
