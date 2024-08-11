import { z } from "zod";

export const LearnWOTDRequestBody = z.object({
  word: z.string(),
});

type LearnWOTDRequestBodyType = z.infer<typeof LearnWOTDRequestBody>;

export default LearnWOTDRequestBodyType;
