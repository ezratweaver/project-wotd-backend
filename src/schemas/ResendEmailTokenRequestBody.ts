import { z } from "zod";

export const ResendEmailTokenRequestBody = z.object({
  email: z.string().email(),
});

type ResendEmailTokenRequestBodyType = z.infer<
  typeof ResendEmailTokenRequestBody
>;

export default ResendEmailTokenRequestBodyType;
