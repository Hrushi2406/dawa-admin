"use client";

import { Input } from "@/components/ui/input";
import { IMedicine } from "@/lib/types";
import { useDebounce } from "@/lib/useDebounce";
import productService from "@/services/product-service";
import React from "react";

export default function SearchPage() {
  const [products, setproducts] = React.useState<IMedicine[]>();

  const [searchTerm, setsearchTerm] = React.useState("");

  const debouncer = useDebounce((term: string) => {
    productService.search(term).then((data) => setproducts(data));
  }, 500);

  const handleSearchOnChange = (e: any) => {
    setsearchTerm(e.target.value);
    debouncer(e.target.value);
  };
  return (
    <div className="mx-4 md:mx-24 my-6 ">
      <Input
        name="search"
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchOnChange}
      />

      <div className="my-8"></div>

      <div>
        {products?.map((product: IMedicine) => (
          <div key={product.id} className="text-lg mb-4">
            {product.name}
          </div>
        ))}
      </div>
    </div>
  );
}
