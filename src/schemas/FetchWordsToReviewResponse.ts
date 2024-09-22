import { z } from "zod";

const learnedWord = z.object({
  word: z.string(),
  definition: z.string(),
  pronunciation: z.string(),
  partOfSpeech: z.string(),
  usage: z.string(),
  date: z.date(),
});

export const FetchWordsToReviewResponse = z.object({
  words: z.array(learnedWord),
});

type FetchWordsToReviewResponseType = z.infer<
  typeof FetchWordsToReviewResponse
>;

export default FetchWordsToReviewResponseType;
