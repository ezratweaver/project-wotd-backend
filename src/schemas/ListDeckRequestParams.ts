import { z } from "zod";
import varchar255Schema from "../utils/type_schemas/varchar255Schema";

export const ListDeckRequestParams = z.object({
  deckName: varchar255Schema,
});

type ListDeckRequestParamsType = z.infer<typeof ListDeckRequestParams>;

export default ListDeckRequestParamsType;
