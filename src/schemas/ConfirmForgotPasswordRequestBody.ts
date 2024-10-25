import { z } from "zod";

export const ConfirmForgotPasswordRequestBody = z.object({
  token: z.string(),
});

type ConfirmForgotPasswordRequestBodyType = z.infer<
  typeof ConfirmForgotPasswordRequestBody
>;

export default ConfirmForgotPasswordRequestBodyType;
