import { z } from "zod";

export const ListDecksResponse = z.array(
  z.object({
    deckKey: z.number(),
    deckName: z.string(),
    wordIncluded: z.boolean().optional(),
    wordCount: z.number(),
  }),
);

type ListDecksResponseType = z.infer<typeof ListDecksResponse>;

export default ListDecksResponseType;
