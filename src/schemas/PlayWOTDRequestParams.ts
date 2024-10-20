import { z } from "zod";

export const PlayWOTDRequestParams = z.object({
  word: z.string(),
});

type PlayWOTDRequestParamsType = z.infer<typeof PlayWOTDRequestParams>;

export default PlayWOTDRequestParamsType;
