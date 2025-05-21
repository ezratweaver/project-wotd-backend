import { z } from "zod";

export const FetchLearnedWordsResponse = z.object({
  words: z.array(
    z.object({
      word: z.string(),
      definition: z.string(),
    }),
  ),
});

type FetchLearnedWordsResponseType = z.infer<typeof FetchLearnedWordsResponse>;

export default FetchLearnedWordsResponseType;
