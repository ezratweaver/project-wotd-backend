import { z } from "zod";

export const signUpRequestBody = z.object({
  email: z.string().email(),
  firstName: z.string(),
  password: z.string(),
});

type SignUpRequestBody = z.infer<typeof signUpRequestBody>;

export default SignUpRequestBody;
