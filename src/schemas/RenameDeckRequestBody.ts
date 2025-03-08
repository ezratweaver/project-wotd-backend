import { z } from "zod";
import safeIntegerSchema from "../utils/type_schemas/safeIntegerSchema";

export const RenameDeckRequestBody = z.object({
  deckKey: safeIntegerSchema,
  deckName: z
    .string()
    .min(1, { message: "Name cannot be empty" })
    .max(255, { message: "Name must be 255 characters or less" }),
});

export type RenameDeckRequestBodyType = z.infer<typeof RenameDeckRequestBody>;

export default RenameDeckRequestBodyType;
