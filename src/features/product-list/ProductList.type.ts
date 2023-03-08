import { z } from "zod";

import { ProductZodSchema } from "./ProductList.constant";

export type Product = z.infer<typeof ProductZodSchema>;

export type QueryObj = {
  q?: string;
  limit?: number;
  skip?: number;
};

export type FetchProductResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
