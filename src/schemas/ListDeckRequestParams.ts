import { z } from "zod";
import safeIntegerSchema from "../utils/safeIntegerSchema";

export const ListDeckRequestParams = z.object({
  deckKey: safeIntegerSchema,
});

type ListDeckRequestParamsType = z.infer<typeof ListDeckRequestParams>;

export default ListDeckRequestParamsType;
