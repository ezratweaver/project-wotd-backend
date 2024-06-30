import { z } from "zod";

export const signUpRequestBody = z.object({
  email: z.string().email(),
  firstName: z.string(),
  password: z.string().min(8, "Password must be atleast 8 characters long."),
});

type SignUpRequestBody = z.infer<typeof signUpRequestBody>;

export default SignUpRequestBody;
