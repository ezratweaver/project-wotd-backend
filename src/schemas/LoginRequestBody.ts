import { z } from "zod";

export const LoginRequestBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginRequestBodyType = z.infer<typeof LoginRequestBody>;

export default LoginRequestBodyType;
