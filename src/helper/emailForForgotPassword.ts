import mjml2html from "mjml";
import { sendEmail } from "../mailer";

export const sendEmailForForgotPassword = ({
  email,
  firstName,
  token,
}: {
  email: string;
  firstName: string;
  token: string;
}) => {
  sendEmail({
    to: email,
    subject: `Reset Password For ${process.env.APP_NAME as string}`,
    html: mjml2html(`<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text font-family="helvetica" color="#2B2B2B" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#F2F2F0">
    <mj-section padding-bottom="34px" />
    <mj-section background-color="white" border-radius="14px">
      <mj-column width="90%">
        <mj-text font-size="14px" font-family="helvetica" padding-top="30px">Hi, ${firstName}</mj-text>

        <mj-text>We received a request to reset your password.</mj-text>

        <mj-text>If this was you, please use the code below to proceed:</mj-text>

        <mj-text font-size="14px" font-weight="600" padding-top="16px" padding-bottom="16px">${token}</mj-text>

        <mj-text>If you didn't request a password reset, you can safely ignore this email. Your account remains secure.</mj-text>
        
        <mj-text>For any issues, feel free to reach out to our support team.</mj-text>

        <mj-text>Best Regards,</mj-text>
        <mj-text padding-top="0px" padding-bottom="30px">The ${process.env.APP_NAME as string} Team.</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html,
  });
};
