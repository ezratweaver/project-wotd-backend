import { z } from "zod";

export const ConfirmEmailTokenRequestBody = z.object({
  token: z.string(),
});

type ConfirmEmailTokenRequestBodyType = z.infer<
  typeof ConfirmEmailTokenRequestBody
>;

export default ConfirmEmailTokenRequestBodyType;
