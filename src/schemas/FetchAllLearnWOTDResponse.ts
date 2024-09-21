import { z } from "zod";

const learnedWord = z.object({
  word: z.string(),
  definition: z.string(),
  pronunciation: z.string(),
  partOfSpeech: z.string(),
  usage: z.string(),
  date: z.date(),
});

export const FetchAllLearnedWOTDResponse = z.object({
  words: z.array(learnedWord),
});

type FetchAllLearnedWOTDResponseType = z.infer<
  typeof FetchAllLearnedWOTDResponse
>;

export default FetchAllLearnedWOTDResponseType;
