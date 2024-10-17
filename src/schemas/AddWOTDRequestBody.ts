import { z } from "zod";

export const Word = z.object({
  word: z.string(),
  definition: z.string(),
  pronunciation: z.string(),
  pronunciationSound: z.instanceof(File).optional(),
  partOfSpeech: z.string(),
  usage: z.string(),
  date: z.date(),
});

export const AddWOTDRequestBody = z.object({
  password: z.string(),
  word: Word,
});

type AddWOTDRequestBodyType = z.infer<typeof AddWOTDRequestBody>;

export default AddWOTDRequestBodyType;
