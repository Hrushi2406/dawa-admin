"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICoreMedicine, IMedicine } from "@/lib/types";
import { useDebounce } from "@/lib/useDebounce";
import productService from "@/services/product-service";
import { Loader2, XIcon } from "lucide-react";
import React from "react";
import { v4 } from "uuid";

export default function SearchPage() {
  const [products, setproducts] = React.useState<ICoreMedicine[]>();
  const [searchTerm, setsearchTerm] = React.useState("");
  const [selectedMed, setselectedMed] = React.useState<ICoreMedicine>();

  const [showDialog, setshowDialog] = React.useState(false);

  const debouncer = useDebounce((term: string) => {
    productService.search(term).then((data) => setproducts(data));
  }, 500);

  const handleSearchOnChange = (e: any) => {
    setsearchTerm(e.target.value);
    debouncer(e.target.value);
  };

  const handleCloseModal = () => {
    setshowDialog(false);
    debouncer(searchTerm);
  };

  return (
    <div className="mx-4 md:mx-24 my-6 ">
      <UpdateMedicineDialog
        isOpen={showDialog}
        closeModal={handleCloseModal}
        medicine={selectedMed}
      />
      <Input
        name="search"
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearchOnChange}
      />

      <div className="my-8"></div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Pack Size</TableHead>
            <TableHead>Packing Type</TableHead>
            <TableHead>MRP</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.company}</TableCell>
              <TableCell>{product.packSize}</TableCell>
              <TableCell>{product.packingType}</TableCell>
              <TableCell>₹{product.mrp}</TableCell>
              <TableCell>
                <Button
                  variant={"ghost"}
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setselectedMed(product);
                    setshowDialog(true);
                  }}
                >
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const UpdateMedicineDialog = ({
  isOpen,
  closeModal,
  medicine,
}: {
  isOpen: boolean;
  closeModal: any;
  medicine?: ICoreMedicine;
}) => {
  const [isLoading, setisLoading] = React.useState(false);
  const [form, setForm] = React.useState<ICoreMedicine>({
    id: v4(),
    name: "",
    company: "",
    mrp: 0,
    category: "",
    packingType: "",
    packSize: "",
  });

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setisLoading(true);
    if (medicine) await productService.update(medicine.id, form);
    else await productService.add(medicine!.id, form);
    setisLoading(false);
    closeModal();
  };

  React.useEffect(() => {
    if (medicine) setForm(medicine);
    else
      setForm({
        id: v4(),
        name: "",
        company: "",
        mrp: 0,
        category: "",
        packingType: "",
        packSize: "",
      });
  }, [medicine]);

  if (!medicine) return <></>;

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className="flex items-center gap-4 justify-between">
        <h1 className="text-lg font-medium">Update Medicine</h1>
        <Button
          onClick={closeModal}
          className="h-min p-0 pl-2"
          variant={"ghost"}
        >
          <XIcon className="h-5 w-5" />
        </Button>
      </div>
      <hr className="mt-2 mb-4" />
      <div className="my-4"></div>

      <form className="space-y-2" onSubmit={handleFormSubmit}>
        <Input
          label="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Company"
          required
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <Input
          label="Pack Size"
          required
          value={form.packSize}
          onChange={(e) => setForm({ ...form, packSize: e.target.value })}
        />
        <Input
          label="Packing Type"
          required
          value={form.packingType}
          onChange={(e) => setForm({ ...form, packingType: e.target.value })}
        />
        <Input
          label="MRP"
          required
          value={form.mrp}
          onChange={(e) =>
            setForm({ ...form, mrp: parseFloat(e.target.value) })
          }
        />

        <div className="flex items-center gap-2 justify-between pt-3">
          <Button
            onClick={closeModal}
            variant={"outline"}
            className="w-full"
            type="button"
          >
            Cancel
          </Button>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}{" "}
            {medicine ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
