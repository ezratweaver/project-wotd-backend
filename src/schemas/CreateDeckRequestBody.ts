import { z } from "zod";

export const CreateDeckRequestBody = z.object({
  deckName: z.string(),
});

type CreateDeckRequestBodyType = z.infer<typeof CreateDeckRequestBody>;

export default CreateDeckRequestBodyType;
