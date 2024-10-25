import { z } from "zod";

export const ForgotPasswordRequestBody = z.object({
  email: z.string().email(),
});

type ForgotPasswordRequestBodyType = z.infer<typeof ForgotPasswordRequestBody>;

export default ForgotPasswordRequestBodyType;
