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
      const tempMrp = parseFloat(row[8]);

      if (tempMrp !== 0) {
        //converting salt to array
        const tempSalt = row[10]?.split("+") ?? [];
        const empty = tempSalt.filter((item) => item !== "");

        //adding search tags
        const tempName = row[1];
        const tempCompany = row[0];
        const searchTags1 = await addSearchTags(tempName);
        const searchTags2 = await addSearchTags(tempCompany);
        const searchTags = { ...searchTags1, ...searchTags2 };

        if (tempName !== undefined) {
          medicinesArr.push({
            company: tempCompany,
            name: tempName,
            hsnCode: row[2],
            sgst: row[3],
            cgst: row[4],
            igst: row[5],
            srate: row[6],
            prate: row[7],
            mrp: tempMrp,
            category: row[9],
            salt: empty,
            meta: searchTags,
          });
        }
      }
    }

    console.log("medicinesArr 10K: ", medicinesArr[9999]);
    console.log("medicinesArr 10K: ", medicinesArr[10000]);
    console.log("medicinesArr: ", medicinesArr[10001]);

    const batch1 = medicinesArr.splice(0, 10000);
    const batch2 = medicinesArr.splice(0, 10000);
    const batch3 = medicinesArr.splice(0, 10000);
    const batch4 = medicinesArr.splice(0, 10000);

    console.log("batch.lenght 1: ", batch1[9999]);
    console.log("batch.lenght 2: ", batch2[0]);
    console.log("batch.lenght 2: ", batch2[1]);

    await Promise.all(
      batch4.map(async (med: any, index: number) => {
        const id = v4();
        console.log("index: ", index);

        await setDoc(doc(db, "core", id), {
          id,
          ...med,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      })
    );

    console.log("Completed upload for batch 4: ");

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
