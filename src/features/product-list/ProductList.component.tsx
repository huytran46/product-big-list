import type { Product } from "./ProductList.type";

import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

import { Loader } from "../../components";

const ProductListItem: React.FC<{
  product: Product;
  style?: React.CSSProperties;
}> = ({ product, style }) => (
  <li
    className="flex items-stretch gap-x-4 p-4 w-full border-b border-slate-300"
    style={style}
  >
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
            + Wishlist
          </a>
          <a className="text-sm color-slate-900 cursor-pointer hover:underline">
            More info
          </a>
        </span>
      </div>
    </span>
  </li>
);

export const ProductList: React.FC<{
  products: Product[];
  itemCount: number;
  isItemLoaded: (index: number) => boolean;
  onLoadMoreItems: (startIndex: number) => Promise<void>;
}> = ({ products, itemCount, isItemLoaded, onLoadMoreItems }) => {
  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={onLoadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <>
          <List
            height={500}
            itemSize={161}
            width="100%"
            ref={ref}
            itemCount={itemCount}
            onItemsRendered={onItemsRendered}
          >
            {({ index, style }) => {
              const prod = products[index];

              if (!prod) {
                return (
                  <div
                    key={index}
                    style={style}
                    className="text-lg text-slate-900 p-4 flex items-center justify-center border-b border-slate-300"
                  >
                    <Loader />
                  </div>
                );
              }

              return (
                <ProductListItem key={prod.id} style={style} product={prod} />
              );
            }}
          </List>
        </>
      )}
    </InfiniteLoader>
  );
};
