import { z } from "zod";

export const AddWordToDeckRequestBody = z.object({
  deckKey: z.number(),
  word: z.string(),
});

type AddWordToDeckRequestBodyType = z.infer<typeof AddWordToDeckRequestBody>;

export default AddWordToDeckRequestBodyType;
