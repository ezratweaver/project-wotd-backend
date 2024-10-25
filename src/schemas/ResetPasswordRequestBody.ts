import { z } from "zod";

export const ResetPasswordRequestBody = z.object({
  password: z.string().min(8, "Password must be atleast 8 characters long."),
});

type ResetPasswordRequestBodyType = z.infer<typeof ResetPasswordRequestBody>;

export default ResetPasswordRequestBodyType;
