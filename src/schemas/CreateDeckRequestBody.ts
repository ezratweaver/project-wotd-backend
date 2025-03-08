import { z } from "zod";
import varchar255Schema from "../utils/type_schemas/varchar255Schema";

export const CreateDeckRequestBody = z.object({
  deckName: varchar255Schema,
});

type CreateDeckRequestBodyType = z.infer<typeof CreateDeckRequestBody>;

export default CreateDeckRequestBodyType;
