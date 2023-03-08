import type { Product } from "./features/product-list";

import { useEffect, useMemo, useState } from "react";
import _debounce from "lodash/debounce";

import { ProductList } from "./features/product-list";
import { getDummyProducts } from "./api/dummy-product";

const PAGE_SIZE = 20;

export function App() {
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);

  const handleInputSearch = useMemo(
    () =>
      _debounce(
        (e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchStr(e.target.value),
        300
      ),
    []
  );

  const hasMore = useMemo(
    () => products?.length + 1 < total,
    [products, total]
  );

  const itemCount = useMemo(
    () => (!hasMore ? products.length : products.length + 1),
    [hasMore, products]
  );

  useEffect(() => {
    (async () => {
      const { data, total } = await getDummyProducts({
        q: searchStr,
        limit: PAGE_SIZE,
        skip: 0,
      });
      setTotal(total);
      setProducts(data);
    })();
  }, [searchStr]);

  useEffect(() => {
    (async () => {
      const { data, total } = await getDummyProducts({
        limit: PAGE_SIZE,
        skip: 0,
      });
      setTotal(total);
      setProducts(data);
    })();
  }, []);

  const isItemLoaded = (index: number) => {
    return !hasMore || index < products.length;
  };

  const onLoadMoreItems = async (startIndex: number) => {
    if (loading) return; // NOTE: skip while loading

    try {
      setLoading(true);

      const { data } = await getDummyProducts({
        limit: PAGE_SIZE,
        skip: startIndex,
      });

      if (data?.length && products.length <= startIndex) {
        setProducts((prevProducts) => prevProducts.concat(data));
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full max-w-screen max-h-full overflow-auto">
      {/* HEADER */}
      <div className="pt-10 px-5 space-y-10 bg-white shadow-sm shadow-slate-300">
        <h3 className="text-4xl">
          Hi there, ✋
          <br />
          just type what you're looking for and we'll do the rest&nbsp;✨🤘✨
        </h3>
        <div className="flex flex-col pb-4 justify-center">
          <label
            htmlFor="product_search"
            className="flex items-center text-xl font-bol"
          >
            Over here <span className="text-4xl">👇</span>
          </label>
          <input
            autoFocus
            type="search"
            name="product_search"
            placeholder="Type something to 🔎 for 📦📦📦"
            className="text-2xl text-slate-500 caret-blue-500  focus:outline-none"
            onChange={handleInputSearch}
          />
        </div>
      </div>

      {/* PRODUCT LIST*/}
      <ProductList
        products={products}
        itemCount={itemCount}
        isItemLoaded={isItemLoaded}
        onLoadMoreItems={onLoadMoreItems}
      />

      {/* MESSAGES BAR */}
      {loading && (
        <div className="flex items-center justify-center w-full p-4 text-slate-900 font-bold">
          {searchStr ? "Searching..." : "Loading more data..."}
        </div>
      )}
      {!hasMore && (
        <div className="flex items-center justify-center w-full p-4 text-yellow-400 font-bold">
          No more data to be loaded. 📭
        </div>
      )}
    </div>
  );
}
