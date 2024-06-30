import { z } from "zod";

export const genericResponse = z.object({
  result: z.string(),
  message: z.string(),
});
