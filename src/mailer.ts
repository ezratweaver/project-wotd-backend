import { createTransport } from "nodemailer";

const NODEMAILER_TEST = process.env.NODEMAILER_TEST === "true";
const NODEMAILER_HOST = process.env.NODEMAILER_HOST;
const NODEMAILER_PORT = process.env.NODEMAILER_PORT;
const NODEMAILER_SECURE = process.env.NODEMAILER_SECURE === "true";

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

export const mailer = createTransport({
  host: NODEMAILER_TEST ? "localhost" : NODEMAILER_HOST,
  port: NODEMAILER_TEST
    ? +(SMTP4DEV_SMTP_PORT as string)
    : +(NODEMAILER_PORT as string),
  secure: NODEMAILER_SECURE,
});
