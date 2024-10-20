import { z } from "zod";

export const PlayWOTDResponse = z.string();

type PlayWOTDResponse = z.infer<typeof PlayWOTDResponse>;

export default PlayWOTDResponse;
