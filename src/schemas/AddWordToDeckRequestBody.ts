import { z } from "zod";
import varchar255Schema from "../utils/type_schemas/varchar255Schema";

export const AddWordToDeckRequestBody = z.object({
  deckName: varchar255Schema,
  word: z.string(),
});

type AddWordToDeckRequestBodyType = z.infer<typeof AddWordToDeckRequestBody>;

export default AddWordToDeckRequestBodyType;
