import { z } from "zod";

export const SignUpRequestBody = z.object({
  email: z.string().email(),
  firstName: z.string(),
  password: z.string().min(8, "Password must be atleast 8 characters long."),
});

type SignUpRequestBodyType = z.infer<typeof SignUpRequestBody>;

export default SignUpRequestBodyType;
