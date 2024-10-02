import { z } from "zod";

const learnedWord = z.object({
  word: z.string(),
  definition: z.string(),
  pronunciation: z.string(),
  partOfSpeech: z.string(),
  usage: z.string(),
  date: z.date(),
});

export const FetchReviewDashboardResponse = z.object({
  words: z.array(learnedWord),
  wordsToReview: z.number(),
});

type FetchReviewDashboardResponseType = z.infer<
  typeof FetchReviewDashboardResponse
>;

export default FetchReviewDashboardResponseType;
