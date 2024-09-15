import mjml2html from "mjml";
import { sendEmail } from "../mailer";

export const sendEmailForEmailVerfication = ({
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
    subject: `Verify Email For ${process.env.APP_NAME as string}`,
    html: mjml2html(`<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text font-family="helvetica" color="#2B2B2B" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#F2F2F0">
    <mj-section padding-bottom="34px" />
    <mj-section background-color="white" border-radius="14px" >
      <mj-column width="90%">
        <mj-text font-size="14px" font-family="helvetica" padding-top="30px">Hi, ${firstName}</mj-text>

        <mj-text>Thanks for registering with us! You're almost done!</mj-text>

        <mj-text>To complete the process please copy the following verification code, and bring it back to the app!</mj-text>

        <mj-text font-size="14px" font-weight="600" padding-top="16px" padding-bottom="16px">${token}</mj-text>

        <mj-text>If you didn't request this, just ignore this email. For any issues, contact our support team.</mj-text>

        <mj-text>Best Regards,</mj-text>
        <mj-text padding-top="0px" padding-bottom="30px">The ${process.env.APP_NAME as string} Team.</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html,
  });
};
