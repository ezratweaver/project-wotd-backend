import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const NODEMAILER_TEST = process.env.NODEMAILER_TEST === "true";
const NODEMAILER_SECURE = process.env.NODEMAILER_SECURE === "true";
const NODEMAILER_HOST = process.env.NODEMAILER_HOST;
const NODEMAILER_PORT = process.env.NODEMAILER_PORT;
const NODEMAILER_FROM = process.env.NODEMAILER_FROM;

const SMTP4DEV_SMTP_PORT = process.env.SMTP4DEV_SMTP_PORT;

if (
  !NODEMAILER_TEST &&
  (!NODEMAILER_HOST || !NODEMAILER_PORT || !NODEMAILER_SECURE)
) {
  throw new Error(
    "Nodemailer env variables must be in '.env' to use nodemailer.",
  );
} else if (NODEMAILER_TEST && !SMTP4DEV_SMTP_PORT) {
  throw new Error(
    "SMTP4DEV_SMTP_PORT must be present to use nodemailer in test.",
  );
}

if (!NODEMAILER_FROM) {
  throw new Error("NODEMAILER_FROM is required to send emails.");
}

const mailer = createTransport({
  host: NODEMAILER_TEST ? "localhost" : NODEMAILER_HOST,
  port: NODEMAILER_TEST
    ? +(SMTP4DEV_SMTP_PORT as string)
    : +(NODEMAILER_PORT as string),
  secure: NODEMAILER_SECURE,
});

export const sendEmail = (sendMailParams: Omit<Mail.Options, "from">) => {
  mailer.sendMail({
    from: NODEMAILER_FROM,
    ...sendMailParams,
  });
};
