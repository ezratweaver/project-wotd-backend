import { z } from "zod";

export const GenericResponse = z.object({
  result: z.string(),
  message: z.string(),
});
