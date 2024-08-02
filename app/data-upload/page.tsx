"use client";
import React from "react";
import csv from "csv";
import { triGram } from "@/services/search";
import { v4 } from "uuid";
import { db } from "@/lib/firebase";
import {
  setDoc,
  doc,
  getCountFromServer,
  collection,
} from "firebase/firestore";

export default function DataUpload() {
  const [sample, setsample] = React.useState();
  const [state, setstate] = React.useState();

  React.useEffect(() => {
    getCountFromServer(collection(db, "core")).then((data) => {
      console.log("core count: ", data.data().count);
    });
  }, []);

  const readXLSFile = async (file: File) => {
    const data = await file.text();

    let medicinesArr = [];
    let csvToRowArray = data.split("\n");

    for (let index = 1; index < csvToRowArray.length; index++) {
      let row = csvToRowArray[index].split(",");

      //converting mrp to number
      const tempMrp = parseFloat(row[2]);

      if (tempMrp !== 0) {
        //converting salt to array
        const tempSalt = [row[7], row[8].split("\r")[0]];
        const empty = tempSalt.filter((item) => item !== "");

        //adding search tags
        const tempName = row[1];
        const tempCompany = row[4];
        const searchTags1 = await addSearchTags(tempName);
        const searchTags2 = await addSearchTags(tempCompany);
        const searchTags = { ...searchTags1, ...searchTags2 };

        const tempCategory = row[6].toLowerCase();

        let packingType;

        if (
          tempCategory.includes("strip") ||
          tempCategory.includes("tablet") ||
          tempCategory.includes("tablets") ||
          tempCategory.includes("strips") ||
          tempCategory.includes("capsule") ||
          tempCategory.includes("capsules") ||
          tempCategory.includes("respules") ||
          tempCategory.includes("pill") ||
          tempCategory.includes("pills")
        ) {
          packingType = "strip";
        } else if (
          tempCategory.includes("bottle") ||
          tempCategory.includes("bottles") ||
          tempCategory.includes("drop") ||
          tempCategory.includes("drops") ||
          tempCategory.includes("spray") ||
          tempCategory.includes("syrup") ||
          tempCategory.includes("syrups") ||
          tempCategory.includes("canister") ||
          tempCategory.includes("liquid") ||
          tempCategory.includes("liquids")
        ) {
          packingType = "bottle";
        } else if (
          tempCategory.includes("vial") ||
          tempCategory.includes("ampoule") ||
          tempCategory.includes("for Injection") ||
          tempCategory.includes("for injection") ||
          tempCategory.includes("cartridge") ||
          tempCategory.includes("penfill") ||
          tempCategory.includes("pre-filled pen") ||
          tempCategory.includes("flexpen")
        ) {
          packingType = "vial";
        } else if (tempCategory.includes("syringe")) {
          packingType = "syringe";
        } else if (tempCategory.includes("tube")) {
          packingType = "tube";
        } else if (
          tempCategory.includes("sachet") ||
          tempCategory.includes("pouch")
        ) {
          packingType = "sachet";
        } else if (
          tempCategory.includes("kit") ||
          tempCategory.includes("box") ||
          tempCategory.includes("jar") ||
          tempCategory.includes("packet")
        ) {
          packingType = "kit";
        } else {
          console.log("index: med.type:  ", index, " :", tempCategory);
          console.log("index: med.type:  ", index, " :", row);
          // console.log("index: med.type:  ", index, " :", row);
          packingType = undefined;
        }

        // console.log("packingType: ", packingType);

        if (tempName !== undefined && packingType !== undefined) {
          medicinesArr.push({
            company: tempCompany,
            name: tempName,
            isDiscountinued: row[3],
            type: row[5],
            packSize: row[6],
            mrp: tempMrp,
            packingType: packingType,
            composition: empty,
            meta: searchTags,
          });
        }
      }
    }

    console.log("medicinesArr.length: ", medicinesArr.length);

    console.log("medicinesArr: ", medicinesArr.slice(0, 10));

    const filteredPrices = medicinesArr
      .filter(
        (med) =>
          med.mrp !== 0 || med.mrp !== undefined || !Number.isNaN(med.mrp)
      )
      .filter((med) => med.isDiscountinued !== "TRUE");

    console.log("filteredPrices.length: ", filteredPrices.length);
    const filterCategory = filteredPrices.filter(
      (med) => med.packingType !== "" || med.packingType !== undefined
    );

    console.log("Logging keys with undefined values in filterCategory:");
    filterCategory.forEach((med: any, index) => {
      Object.keys(med).forEach((key) => {
        if (med[key] === undefined) {
          console.log("med: ", med);

          console.log(`Index ${index}, Key: ${key}`);
        }
      });
    });

    // console.log("filtereCategory.length: ", filterCategory.length);
    // console.log("filtereCategory.length: ", filterCategory);

    const createBatch = (arr: any, batchSize: number) => {
      const batches = [];
      for (let i = 0; i < arr.length; i += batchSize) {
        batches.push(arr.slice(i, i + batchSize));
      }
      return batches;
    };

    const batches = createBatch(filterCategory, 5000);

    console.log("batches.length: ", batches.length);
    console.log("batches: ", batches[0].length);
    console.log("batches: ", batches[1].length);

    for (let i in batches) {
      const batch = batches[i];

      await Promise.all(
        batch.map(async (med: any, index: number) => {
          const id = v4();

          await setDoc(doc(db, "core", id), {
            id,
            ...med,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          // if ((index + 1) % 1000 === 0) {
          //   console.log(
          //     `Processed ${index + 1} items. Pausing for 20 seconds...`
          //   );
          //   await new Promise((resolve) => setTimeout(resolve, 20000));

          //   console.log("Resuming upload...");
          // }

          console.log("medicines index: ", index);
        })
      );

      console.log("Processed records: ", batch.length);
      console.log("Completed upload for file12-batch: ", i);
      console.log("Pausing for 20 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 20000));
      console.log("Resuming upload...");
    }
    console.log("Completed upload for file12: ");
    // const batch1 = filterCategory.splice(0, 10000);

    // const batch2 = filterCategory.splice(0, 10000);

    // for (let i in batch1) {

    // for (let i in batch1) {
    //   const id = v4();
    //   const med = medicinesArr[i];

    //   //   await setDoc(doc(db, "core", id), {
    //   //     id,
    //   //     ...med,
    //   //     createdAt: new Date().toISOString(),
    //   //     updatedAt: new Date().toISOString(),
    //   //   });
    // }
  };

  const addSearchTags = async (name: any) => {
    const index = triGram([name || ""].join(" ").slice(0, 500));

    const meta: any = {};

    //   console.log("index: ", index.entries());

    index.forEach((value, key) => {
      meta[key] = value;
    });

    return meta;
    // return data.map(async (item: any, i: number) => {
    //   const index = triGram([item.name || ""].join(" ").slice(0, 500));

    //   const meta: any = {};

    //   //   console.log("index: ", index.entries());

    //   index.forEach((value, key) => {
    //     meta[key] = value;
    //   });

    //   //   const db = getFirestore();
    //   //   const id = generateId();
    //   const payload = {
    //     ...item,
    //     meta,
    //   };

    //   //   console.log("meta: ", meta);

    //   // await setDoc(doc(db, "products", item.id), payload);

    //   return payload;
    // });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const data: any = await readXLSFile(file);
        // const first20Results = data.slice(0, 20);
        // console.log(first20Results);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <div>DataUpload</div>
    </div>
  );

  return <div>DataUpload</div>;
}
