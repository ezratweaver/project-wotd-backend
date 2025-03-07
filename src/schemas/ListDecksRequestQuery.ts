import { z } from "zod";

export const ListDecksRequestQuery = z.object({
  word: z.string().optional(),
});

type ListDecksRequestQueryType = z.infer<typeof ListDecksRequestQuery>;

export default ListDecksRequestQueryType;
