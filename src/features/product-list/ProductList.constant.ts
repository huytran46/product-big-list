import { z } from "zod";

// NOTE: only declare fields that we care about
export const ProductZodSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnail: z.string(),
});
