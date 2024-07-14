import { z } from "zod";

export const FetchWOTDResponse = z.object({
  word: z.string(),
  definition: z.string(),
  pronunciation: z.string(),
  partOfSpeech: z.string(),
  usage: z.string(),
  date: z.date(),
});
