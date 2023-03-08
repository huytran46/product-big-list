import type {
  FetchProductResponse,
  Product,
  QueryObj,
} from "../features/product-list";

import { ProductZodSchema } from "../features/product-list";

export async function getDummyProducts(
  queryObj?: QueryObj
): Promise<{ data: Product[]; total: number }> {
  const limit = queryObj?.limit || 10;

  const skip = queryObj?.skip || 0;

  const urlParams = new URLSearchParams({
    limit: limit.toString(),
    skip: skip.toString(),
  });

  let url = "https://dummyjson.com/products?";

  if (queryObj?.q) {
    urlParams.set("q", queryObj?.q);
    url = "https://dummyjson.com/products/search?";
  }

  const data: FetchProductResponse = await fetch(url + urlParams).then((res) =>
    res.json()
  );

  if (!data?.products) return { data: [], total: 0 };

  const { products } = data;

  return {
    data: products.map((prod) => ProductZodSchema.parse(prod)), // NOTE: runtime type checking
    total: data.total,
  };
}
