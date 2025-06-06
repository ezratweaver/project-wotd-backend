import { z } from "zod";
import safeIntegerSchema from "../utils/type_schemas/safeIntegerSchema";
import varchar255Schema from "../utils/type_schemas/varchar255Schema";

export const RenameDeckRequestBody = z.object({
  oldDeckName: varchar255Schema,
  newDeckName: varchar255Schema,
});

export type RenameDeckRequestBodyType = z.infer<typeof RenameDeckRequestBody>;

export default RenameDeckRequestBodyType;
