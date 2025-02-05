"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { addSearchTags } from "@/services/search";
import { randomUUID } from "crypto";
import {
  collection,
  doc,
  getCountFromServer,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React from "react";
import { v4 } from "uuid";

export default function DataUpload() {
  const [data, setData] = React.useState<any[]>([]);
  const [displayData, setDisplayData] = React.useState<any[]>([]);
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [columnAliases, setColumnAliases] = React.useState<{
    [key: string]: { name: string; type: string };
  }>({});
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    const ref = collection(db, "maitriData");

    // getCountFromServer(ref).then((count) => {
    //   console.log("count: ", count.data().count);
    // });
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      let rows: any[] = [];

      if (file.name.endsWith(".csv")) {
        // Parse CSV
        rows = text.split("\n").map((row) => row.split(","));
      } else if (file.name.endsWith(".xls") || file.name.endsWith(".xlsx")) {
        // For Excel files, you'll need to add xlsx package
        // This is simplified parsing
        const lines = text.split("\n");
        rows = lines.map((line) => line.split("\t"));
      }

      rows = rows.map((row) => row.map((cell: any) => cell.trim()));

      let rowIndex = 0;

      rows.map((row, index) => {
        row.map((cell: any) => {
          if (cell.toLowerCase() === "name") {
            rowIndex = index;
            return;
          }
        });
      });

      rows = rows.slice(rowIndex);

      if (rows.length > 0) {
        setHeaders(rows[0]);
        setData(rows.slice(1));
        setDisplayData(rows.slice(1, 101));
      }
    };
    reader.readAsText(file);
  };

  const handleColumnAlias = (
    originalName: string,
    newName: string,
    type: string = "string"
  ) => {
    if (newName && headers.includes(originalName)) {
      const headerIndex = headers.indexOf(originalName);
      const newHeaders = [...headers];
      newHeaders[headerIndex] = newName;
      setColumnAliases({
        ...columnAliases,
        [originalName]: { name: newName, type },
      });
    }
  };

  const handleUploadToDatabase = async () => {
    try {
      setIsUploading(true);

      console.log("Total rows to upload:", data.length);

      // Upload each row individually
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        let formattedRow: Map<string, any> = new Map();

        row.forEach((value: string, index: number) => {
          const header = headers[index];
          const alias = columnAliases[header];

          if (alias && value) {
            let parsedValue: any = value;

            switch (alias.type) {
              case "int":
                parsedValue = parseInt(value);
                break;
              case "double":
                parsedValue = parseFloat(value);
                break;
              default:
                parsedValue = value;
            }

            formattedRow.set(alias.name, parsedValue);
          }
        });

        if (formattedRow.size > 0) {
          // Validate that formattedRow has valid values for all keys
          const hasValidValues = Object.entries(formattedRow).every(
            ([key, value]) => {
              return value !== undefined && value !== "";
            }
          );

          if (!hasValidValues) {
            console.log(
              "Skipping row due to invalid/empty values:",
              formattedRow
            );
            return;
          }

          const id = v4();

          const searchTags1 = await addSearchTags(formattedRow.get("name"));
          const searchTags2 = await addSearchTags(
            formattedRow.get("packingType")
          );
          const searchTags = { ...searchTags1, ...searchTags2 };

          const data = {
            id,
            meta: searchTags,
            ...Object.fromEntries(formattedRow),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };

          await setDoc(doc(db, `maitriData/${id}`), data, { merge: true });

          console.log("data: ", data);
          //   console.log("uploaded: ", data?.get("name"));
        }

        // Add delay after every 4000 entries
        if ((i + 1) % 4000 === 0) {
          console.log(`Processed ${i + 1} items. Pausing for 20 seconds...`);
          await new Promise((resolve) => setTimeout(resolve, 20000));
          console.log("Resuming upload...");
        }
      }

      alert("Data uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload data");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={handleFileUpload}
        className="mb-4 p-2 border rounded"
      />

      {headers.length > 0 && (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Column Names and Aliases</h2>
            <div className="grid grid-cols-1 gap-4 mb-4 max-w-xl">
              {headers.map((header, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Column Name
                    </Label>
                    <Input
                      type="text"
                      value={header}
                      disabled
                      className="dark:text-gray-50"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                      Map as DB key
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={columnAliases[header]?.name || ""}
                        onChange={(e) =>
                          handleColumnAlias(
                            header,
                            e.target.value,
                            columnAliases[header]?.type || "string"
                          )
                        }
                        className="flex-1"
                        placeholder="Enter alias name"
                      />
                      <select
                        className="border rounded px-2 dark:text-gray-50 dark:bg-gray-800"
                        value={columnAliases[header]?.type || "string"}
                        onChange={(e) =>
                          handleColumnAlias(
                            header,
                            columnAliases[header]?.name || "",
                            e.target.value
                          )
                        }
                      >
                        <option value="string">String</option>
                        <option value="int">Int</option>
                        <option value="double">Double</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleUploadToDatabase}
            disabled={isUploading}
            className={`my-4`}
          >
            {isUploading ? "Uploading..." : "Upload Data to Database"}
          </Button>
        </>
      )}

      {displayData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="border p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell: any, cellIndex: number) => (
                    <td key={cellIndex} className="border p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
