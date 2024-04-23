"use client";
import { Button } from "@/components/ui/button";
import { addTestDataToFirebase } from "@/lib/test-data";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";

export default function Home() {
  React.useEffect(() => {}, []);

  return (
    <main className="mx-4 my-6 md:mx-24">
      <Button
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
      </Button>
    </main>
  );
}
