"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { addTestDataToFirebase } from "@/lib/test-data";
import productService from "@/services/product-service";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import StatsSection from "./stats-section";

const exportData = async () => {
  await productService.getAll().then((data) => {
    data = data.map((d) => {
      delete d.meta;
      return d;
    });
    console.log(data);
  });
};
export default function Home() {
  const [orders, setorders] = React.useState<any>([]);

  React.useEffect(() => {
    // fetchOrders().then((data) => setorders(data));
    // toast("Check console for data");
    // addPost();
  }, []);

  return (
    <main className="mx-4 my-6 md:mx-24 dark:bg-black">
      <div className="flex flex-wrap gap-2 items-center">
        {/* <Button
          variant={"outline"}
          onClick={async () => {
            toast.promise(addTestDataToFirebase(), {
              loading: "Loading",
              success: "Added data successfully",
              error: "Error when fetching",
            });
            // try {
            //   await addTestDataToFirebase();
            //   toast.success("Test data added successfully");
            // } catch (error: any) {
            //   console.log("error: ", error);
            //   toast.error(error.toString());
            // }
          }}
        >
          Add Test Data
        </Button> */}

        <Button asChild className="" variant={"outline"}>
          <Link href={"/search"}>Search </Link>
        </Button>
        <Button asChild className="" variant={"outline"}>
          <Link href={"/products"}>All Products</Link>
        </Button>
        <Button asChild className="" variant={"outline"}>
          <Link href={"/add-products"}>Add Product</Link>
        </Button>
        <Button asChild className="" variant={"outline"}>
          <Link href={"/discounts"}>Discounts </Link>
        </Button>

        <Button asChild className="" variant={"outline"}>
          <Link href={"/add-medicals"}>Add Medicals </Link>
        </Button>

        <Button asChild className="" variant={"outline"}>
          <Link href={"/whatsapp-chat"}>Whatsapp Chat </Link>
        </Button>
        <Button onClick={exportData} className="" variant={"outline"}>
          Export Data
        </Button>
      </div>
      <div className="my-8"></div>
      <StatsSection />
      <div className="my-8"></div>

      {/* <h4 className="text-xl font-medium">Orders</h4>
      <hr className="mt-2 mb-4" />

      <Table>
        <TableCaption>A list of your recent orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order No</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: any) => {
            return (
              <TableRow>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell className="space-y-3">
                  {order.items.map((item: any) => (
                    <p className="">{item.name}</p>
                  ))}
                </TableCell>
                <TableCell>
                  {order.user.firstName + " " + order.user.lastName}
                </TableCell>
                <TableCell className="text-right text-green-700 dark:text-green-600">
                  {order.status}
                </TableCell>
                <TableCell className="text-right ">
                  <EllipsisVertical className="w-4 h-4 float-right" />
                </TableCell>
              </TableRow>
            );
            return (
              <div className="grid grid-cols-6 border-b px-4 py-3">
                <div>{order.id}</div>

                <div>{order.user.firstName + " " + order.user.lastName}</div>
                <div>{order.status}</div>
                <div className="col-span-2">{order.items[0].name}</div>
                <div className="justify-end">
                  <Option />
                </div>
              </div>
            );
          })}
        </TableBody>
      </Table> */}
    </main>
  );
}

const fetchOrders = async () => {
  const snaps = await getDocs(collection(db, "orders"));

  return snaps.docs.map((doc) => doc.data());
};
