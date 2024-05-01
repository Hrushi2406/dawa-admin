"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import productService from "@/services/product-service";
import Loader from "@/components/ui/loader";
import { Edit, Edit2, PenLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setproducts] = React.useState<any>();

  React.useEffect(() => {
    productService.getAll().then((data) => setproducts(data));
  }, []);

  const deleteP = async (id: string) => {
    await productService.delete(id);

    const updated = products.filter((p: any) => p.id !== id);

    setproducts(updated);
  };

  if (!products) return <Loader />;

  return (
    <div className="mx-4 my-6 md:mx-24">
      <div className="flex items-center gap-4 justify-between">
        <h4 className="text-xl font-medium">Products</h4>
        <Button asChild variant={"outline"} className="">
          <Link href={"/add-products"}>Add Product</Link>
        </Button>
      </div>
      <hr className="mt-2 mb-4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: any) => {
            return (
              <TableRow>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell className="text-right ">{product.stock}</TableCell>
                <TableCell className="flex gap-2 items-center justify-end">
                  <Button asChild className="text-primary" variant={"ghost"}>
                    <Link href={`/add-products?id=${product.id}`}>
                      <PenLine className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    className="text-red-700"
                    variant={"ghost"}
                    onClick={() => deleteP(product.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
