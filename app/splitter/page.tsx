"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [splitFiles, setSplitFiles] = useState<{ name: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSplitFiles([]); // Reset split files when new file selected
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const newSplitFiles: { name: string }[] = [];

      // Split data into chunks of 10,000
      const chunkSize = 10000;
      for (let i = 0; i < jsonData.length; i += chunkSize) {
        const chunk = jsonData.slice(i, i + chunkSize);
        const newWorkbook = XLSX.utils.book_new();
        const newWorksheet = XLSX.utils.json_to_sheet(chunk);
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Sheet1");

        // Generate file name (a1, a2, a3, etc.)
        const fileNumber = Math.floor(i / chunkSize) + 1;
        const fileName = `a${fileNumber}.xlsx`;

        // Convert to blob
        const wbout = XLSX.write(newWorkbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([wbout], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        newSplitFiles.push({
          name: fileName,
          //   data: blob,
        });
      }

      //   setSplitFiles(newSplitFiles);
      alert("Files have been split successfully!");
    } catch (error) {
      console.error("Error processing file:", error);
      alert("An error occurred while processing the file.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (file: { name: string; data: Blob }) => {
    const url = window.URL.createObjectURL(file.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Excel File Splitter
      </h1>
      <div className="space-y-4">
        <div>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="mb-4 bg-white border-gray-200"
          />
        </div>
        <Button
          onClick={handleSplit}
          disabled={!file || processing}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {processing ? "Processing..." : "Split File"}
        </Button>
        {file && (
          <p className="text-sm text-gray-600">Selected file: {file.name}</p>
        )}

        {splitFiles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Split Files
            </h2>
            <div className="space-y-2">
              {splitFiles.map((splitFile, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded bg-white"
                >
                  <span className="text-gray-900">{splitFile.name}</span>
                  <Button
                    // onClick={() => handleDownload(splitFile)}
                    variant="outline"
                    size="sm"
                    className="border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
