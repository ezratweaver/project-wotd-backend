import { z } from "zod";

export const FetchWOTDResponse = z.object({
  wordData: z
    .object({
      word: z.string(),
      definition: z.string(),
      pronunciation: z.string(),
      partOfSpeech: z.string(),
      usage: z.string(),
      date: z.date(),
    })
    .optional(),
  wordNextDay: z.boolean(),
  wordPrevDay: z.boolean(),
});

type FetchWOTDResponseType = z.infer<typeof FetchWOTDResponse>;

export default FetchWOTDResponseType;
