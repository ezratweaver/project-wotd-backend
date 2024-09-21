import { z } from "zod";
import { Word } from "./FetchWOTDResponse";

export const FetchAllLearnedWOTDResponse = z.object({
  words: z.array(Word),
});

type FetchAllLearnedWOTDResponseType = z.infer<
  typeof FetchAllLearnedWOTDResponse
>;

export default FetchAllLearnedWOTDResponseType;
