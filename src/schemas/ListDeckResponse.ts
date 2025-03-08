import { z } from "zod";

export const ListDeckResponse = z.object({
  name: z.string(),
  words: z.array(
    z.object({
      word: z.string(),
      definition: z.string(),
    }),
  ),
});

type ListDeckResponseType = z.infer<typeof ListDeckResponse>;

export default ListDeckResponseType;
