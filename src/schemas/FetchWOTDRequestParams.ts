import { z } from "zod";

export const FetchWOTDRequestParams = z.object({
  wordDate: z.string().datetime(),
});

type FetchWOTDRequestParamsType = z.infer<typeof FetchWOTDRequestParams>;

export default FetchWOTDRequestParamsType;
