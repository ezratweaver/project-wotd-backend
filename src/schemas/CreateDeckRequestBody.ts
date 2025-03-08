import { z } from "zod";

export const CreateDeckRequestBody = z.object({
  deckName: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .max(255, { message: "Name must be 255 characters or less" }),
});

type CreateDeckRequestBodyType = z.infer<typeof CreateDeckRequestBody>;

export default CreateDeckRequestBodyType;
