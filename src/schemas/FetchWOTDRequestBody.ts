import { z } from "zod";

export const FetchWOTDRequestBody = z.object({
  date: z.date(),
});

type FetchWOTDRequestBodyType = z.infer<typeof FetchWOTDRequestBody>;

export default FetchWOTDRequestBodyType;
