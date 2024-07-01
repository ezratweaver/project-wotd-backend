import { z } from "zod";

export const GenericResponse = z.object({
  result: z.string().optional(),
  error: z.string().optional(),
  message: z.string(),
});
