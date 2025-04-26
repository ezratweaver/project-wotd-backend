import { z } from "zod";
import varchar255Schema from "../utils/type_schemas/varchar255Schema";

export const DeleteDeckRequestParams = z.object({
  deckName: varchar255Schema,
});

export type DeleteDeckRequestParamsType = z.infer<
  typeof DeleteDeckRequestParams
>;

export default DeleteDeckRequestParamsType;
