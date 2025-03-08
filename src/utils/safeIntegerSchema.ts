import { z } from "zod";

const safeIntegerSchema = z
  .number()
  .gte(Number.MIN_SAFE_INTEGER, {
    message: `Number must be greater than or equal to ${Number.MIN_SAFE_INTEGER}`,
  })
  .lte(Number.MAX_SAFE_INTEGER, {
    message: `Number must be less than or equal to ${Number.MAX_SAFE_INTEGER}`,
  });

export default safeIntegerSchema;
