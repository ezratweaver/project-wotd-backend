import { z } from "zod";

const varchar255Schema = z
  .string()
  .min(1, { message: "Name cannot be empty" })
  .max(255, { message: "Name must be 255 characters or less" });

export default varchar255Schema;
