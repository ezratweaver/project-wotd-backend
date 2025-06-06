import { z } from "zod";

export const Word = z.object({
  word: z.string(),
  definition: z.string(),
  pronunciation: z.string(),
  pronunciationUrl: z.string(),
  partOfSpeech: z.string(),
  usage: z.string(),
  date: z.date(),
  learned: z.boolean(),
});

export const FetchWOTDResponse = z.object({
  wordData: Word.optional(),
  wordPrevDay: z.boolean(),
});

type FetchWOTDResponseType = z.infer<typeof FetchWOTDResponse>;

export default FetchWOTDResponseType;
