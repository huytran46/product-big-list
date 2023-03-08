import { useEffect, useMemo, useState } from "react";
import _debounce from "lodash/debounce";
import InfiniteScroll from "react-infinite-scroller";
import { z } from "zod";
import { VariableSizeList as List } from "react-window";

const ProductCard: React.FC<{
  product: Product;
}> = ({ product }) => (
  <div className="flex flex-col gap-y-4 border border-slate-300 rounded-md shadow-sm p-4 w-[320px]">
    <span className="flex flex-col">
      <h5 className="text-xl font-bold">{product.title}</h5>
      <h6 className="text-sm text-slate-500 line-clamp-2">
        {product.description}
      </h6>
    </span>
    <div className="aspect-auto">
      <img
        className="object-contain max-w-full max-h-full rounded-md"
        alt="product thumbnail"
        src={product.thumbnail}
      />
    </div>
    <div className="flex items-center justify-between gap-x-4">
      <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
      <button
        className="rounded-md py-1 px-2
      text-sm
      color-slate-900 
      shadow-sm
      border border-slate-900
      shadow-slate-400
      active:shadow-inner
      active:bg-white
      active:shadow-slate-50
      "
      >
        More info
      </button>
    </div>
  </div>
);

const ProductListItem: React.FC<{
  product: Product;
}> = ({ product }) => (
  <li className="flex items-stretch gap-x-4 p-4 w-full border-b border-slate-300">
    <img
      className="aspect-square rounded-md object-cover h-[128px] w-[128px]"
      alt="product thumbnail"
      src={product.thumbnail}
    />
    <span className="flex flex-col justify-between w-full">
      <span className="flex flex-col">
        <h5 className="text-xl font-bold line-clamp-1">{product.title}</h5>
        <h6 className="text-sm text-slate-500 line-clamp-2">
          {product.description}
        </h6>
      </span>
      <div className="flex items-end justify-between gap-x-4">
        <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
        <span className="flex items-center gap-x-4">
          <a className="text-sm font-bold color-slate-900 cursor-pointer">
            Add to cart
          </a>
          <a className="text-sm color-slate-900 cursor-pointer hover:underline">
            More info
          </a>
        </span>
      </div>
    </span>
  </li>
);

// NOTE: only declare fields that we care about
const ProductZodSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  thumbnail: z.string(),
});

type Product = z.infer<typeof ProductZodSchema>;

type QueryObj = {
  q?: string;
  limit?: number;
  skip?: number;
};

type FetchProductResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

async function getProducts(queryObj?: QueryObj): Promise<Product[]> {
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

  if (!data?.products) return [];

  const { products } = data;

  return products.map((prod) => ProductZodSchema.parse(prod)); // NOTE: runtime type checking
}

export function App() {
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    handleSearchProducts({ q: searchStr, skip: 0 });
  }, [searchStr]);

  const handleInputSearch = useMemo(
    () =>
      _debounce(
        (e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchStr(e.target.value),
        300
      ),
    []
  );

  async function handleLoadMoreProduct(_queryObj: QueryObj) {
    try {
      setLoading(true);
      const _limit = _queryObj.limit || 0;
      const products = await getProducts(_queryObj);

      if (_limit === 0) {
        setProducts(products ?? []);
        return;
      }

      if (!products?.length) return;

      setProducts((prevProducts) => prevProducts.concat(products));

      setHasMore(products.length >= _limit);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchProducts(_queryObj: QueryObj) {
    try {
      setLoading(true);
      setHasMore(false);
      const products = await getProducts(_queryObj);
      setProducts(products ?? []);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-screen h-[700px] max-h-full overflow-auto">
      <div className="sticky top-0 left-0 right-0 container pt-10 px-5 mx-auto space-y-10 bg-white">
        <h3 className="text-4xl">
          Hi there, ✋
          <br />
          just type what you're looking for and we'll do the rest&nbsp;✨🤘✨
        </h3>
        <div className="flex flex-col space-y-8 justify-center">
          <span className="flex flex-col">
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
          </span>
          <div className="block space-y-4">
            <h5 className="text-lg text-slate-900">
              {loading ? <>Searching...</> : <>Gotcha 🎉</>}
            </h5>
          </div>
        </div>
      </div>
      <InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={(pageNumber) => {
          const newSkip = 10 * pageNumber;
          const newQueryObj = { skip: newSkip, limit: 10 };
          handleLoadMoreProduct(newQueryObj);
        }}
        loader={
          <h4 key={0} className="p-4 text-md text-slate-900">
            Loading...
          </h4>
        }
        hasMore={!loading && !searchStr && hasMore}
        useWindow={false}
      >
        {products.map((prod) => (
          <ProductListItem key={prod.id} product={prod} />
        ))}
      </InfiniteScroll>
    </div>
  );
}
