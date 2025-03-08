import { z } from "zod";
import safeIntegerSchema from "../utils/type_schemas/safeIntegerSchema";

export const DeleteDeckRequestParams = z.object({
  deckKey: safeIntegerSchema,
});

export type DeleteDeckRequestParamsType = z.infer<
  typeof DeleteDeckRequestParams
>;

export default DeleteDeckRequestParamsType;
