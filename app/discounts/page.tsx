"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { Loader2, PenLine, Plus, Trash2, XIcon } from "lucide-react";
import discountService, { IDiscount } from "@/services/discount-service";
import { v4 } from "uuid";
import Link from "next/link";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import Loader from "@/components/ui/loader";

export default function DiscountPage() {
  const [openModal, setopenModal] = React.useState(false);

  const [discounts, setdiscounts] = React.useState<IDiscount[]>();
  const [selectedDiscount, setSelectedDiscount] = React.useState<IDiscount>();

  const handleOpenModal = (discount?: IDiscount) => {
    setopenModal(true);
    setSelectedDiscount(discount);
  };

  const handleCloseModal = () => {
    setSelectedDiscount(undefined);
    setopenModal(false);
  };

  const deleteDiscount = async (id: string) => {
    await discountService.delete(id);
    const updated = discounts?.filter((p) => p.id !== id);
    setdiscounts(updated);
  };

  const updatedLocalState = (update: IDiscount, isUpdate: boolean) => {
    if (isUpdate) {
      const updated = discounts?.map((p) => (p.id === update.id ? update : p));
      setdiscounts(updated);
    } else {
      const updated = [...(discounts ?? []), update];
      setdiscounts([...updated]);
    }
  };

  React.useEffect(() => {
    discountService.getAll().then((data) => setdiscounts(data));
  }, []);

  if (!discounts) return <Loader />;

  return (
    <div className="mx-4 my-6 md:mx-24">
      <AddDiscountCode
        isOpen={openModal}
        closeModal={handleCloseModal}
        discount={selectedDiscount}
        updateLocalState={updatedLocalState}
      />
      <div className="flex items-center gap-4 justify-between">
        <h4 className="text-xl font-medium">Discounts</h4>
        <Button
          variant={"outline"}
          className=""
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Discount
        </Button>
      </div>
      <hr className="mt-2 mb-4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Code</TableHead>
            <TableHead>Discount(%)</TableHead>
            <TableHead className="text-left">Type</TableHead>
            <TableHead className="text-right">Expires At</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discounts.map((discount) => {
            return (
              <TableRow key={discount.id}>
                <TableCell className="font-medium">{discount.code}</TableCell>
                <TableCell>{discount.discount}</TableCell>
                <TableCell>{discount.type}</TableCell>
                <TableCell className="text-right ">
                  {discount.expiresAt}
                </TableCell>
                <TableCell className="flex gap-2 items-center justify-end">
                  <Button
                    className="text-primary"
                    variant={"ghost"}
                    onClick={() => handleOpenModal(discount)}
                  >
                    <PenLine className="w-5 h-5" />
                  </Button>
                  <Button
                    className="text-red-700"
                    variant={"ghost"}
                    onClick={() => deleteDiscount(discount.id)}
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

function AddDiscountCode({
  isOpen,
  closeModal,
  discount,
  updateLocalState,
}: {
  isOpen: boolean;
  closeModal: () => void;
  discount?: IDiscount;
  updateLocalState: (update: IDiscount, isUpdate: boolean) => void;
}) {
  const [isLoading, setisLoading] = React.useState(false);
  const [form, setform] = React.useState<IDiscount>({
    id: v4(),
    code: "",
    discount: 10,
    createdAt: new Date().toISOString(),
    type: "",
  });

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setisLoading(true);
    if (discount) await discountService.update(discount.id, form);
    else await discountService.create(form);
    setisLoading(false);
    closeModal();
    updateLocalState(form, discount !== undefined);
  };

  React.useEffect(() => {
    if (discount) setform(discount);
    else
      setform({
        id: v4(),
        code: "",
        discount: 10,
        createdAt: new Date().toISOString(),
        type: "",
      });
  }, [discount]);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className="flex items-center gap-4 justify-between">
        <h1 className="text-lg font-medium">Create Discount Code</h1>
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
          label="Code"
          required
          value={form.code}
          onChange={(e) => setform({ ...form, code: e.target.value })}
        />
        <Input
          label="Discount (in %)"
          value={form.discount}
          placeholder="20"
          required
          max={100}
          type="number"
          onChange={(e) =>
            setform({ ...form, discount: parseFloat(e.target.value) })
          }
        />
        <Input
          label="Type (All Caps)"
          value={form.type}
          required
          placeholder="GENERAL"
          onChange={(e) =>
            setform({ ...form, type: e.target.value.toUpperCase() })
          }
        />

        <Input
          label="Expires At"
          type="date"
          required
          value={form.expiresAt}
          onChange={(e) => setform({ ...form, expiresAt: e.target.value })}
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
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {discount ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
