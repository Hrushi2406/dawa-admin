"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import productService from "@/services/product-service";
import StorageService from "@/services/storage-service";
import { ImagePlusIcon, Loader2, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { v4 } from "uuid";

const medicineCategories = [
  "cold",
  "flu",
  "headache",
  "allergy",
  "cough",
  "fever",
  "pain",
  "digestive",
  "pain relief",
  "vitamins",
  "skin",
  "ear",
  "acidity",
  "heart-burn",
  "eye",
  "Multivitamins",
  "indigestion",
  "heartburn",
  "gas",
  "abdominal-discomfort",
];

const type = ["medicine", "personal-care"];
//   {
//     name: "Combiflam Strip Of 20 Tablets",
//     brand: "MACLEODS PHARMACEUTICALS",
//     stock: 50,
//     price: 50.65,
//     type: "medicine",
//     description:
//       "Combiflam tablets are a commonly used painkiller medication that helps to treat various conditions, including headaches, toothaches, body aches, muscle pain, joint pain, and fever. The active ingredients in Combiflam are Ibuprofen and paracetamol. Combiflam works by blocking the release of certain chemical messengers that cause pain, fever, as well as inflammation (redness and swelling). To ensure the best results, Combiflam should be taken as prescribed by a doctor, with or after food, for the recommended duration. It is important to follow the prescribed dose and not skip any doses or take more than advised.",
//     prescriptionRequired: false,
//     category: ["cold", "flu"],
//     indication: "Pain & Fever",
//     sideEffects:
//       "Increased appetite, hair loss, weight variations, headache, vomiting",
//     images: [
//       "https://dawa24seven.com/cdn/shop/files/combiflam-plus-headache-relief-tablet-strip-of-10-tablets-3-1669710916.webp?v=1713871694",
//     ],
//   },

export default function AddProductPage() {
  const [isUploadingImage, setisUploadingImage] = React.useState(false);

  const [isLoading, setisLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    name: "",
    brand: "",
    stock: 10,
    price: 0,
    type: "medicine",
    description: "",
    prescriptionRequired: false,
    category: [] as string[],
    indication: "",
    sideEffects: "",
    images: [] as string[],
  });

  const router = useRouter();
  const id = v4();

  const handleCategorySelect = (cat: string) => {
    let updated = form.category;

    if (form.category.includes(cat)) {
      updated = form.category.filter((data: string) => data !== cat);
    } else {
      updated = [...form.category, cat];
    }
    setForm({ ...form, category: updated });
  };

  const handleImageSelect = async (e: any) => {
    const files = e.target.files;

    if (files.length === 0) return;
    setisUploadingImage(true);

    let temp: string[] = [];

    await Promise.all(
      Array.from(files).map(async (f: any) => {
        const uploadFile = f;
        const url = await StorageService.uploadFileAndGetDownloadUrl(
          uploadFile,
          `products/${id}`
        );
        temp.push(url);
      })
    );
    setForm({ ...form, images: [...form.images, ...temp] });

    setisUploadingImage(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (form.category.length <= 0) {
      toast.error("Atleast one category is required");
      return;
    }

    if (form.images.length <= 0) {
      toast.error("Atleast one image is required");
      return;
    }

    setisLoading(true);
    if (productId) {
      await productService.update(productId, form);
    } else {
      await productService.add(id, form);
    }
    setisLoading(false);
    router.back();
  };

  const searchParams = useSearchParams();

  const productId = searchParams?.get("id");

  React.useEffect(() => {
    if (productId) {
      productService.get(productId).then((data: any) => setForm(data));
    }
  }, [productId]);

  return (
    <main className="mx-4 my-6 md:mx-24">
      <form
        className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="Calpol 650mg–Strip of 15 tablets"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Brand"
            required
            placeholder=""
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
          <Input
            label="Stock"
            type="number"
            placeholder="Stock Quantity"
            required
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: parseFloat(e.target.value) })
            }
          />
          <Input
            label="Price"
            required
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) })
            }
          />

          <Textarea
            label="Description"
            placeholder=""
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Input
            label="Indication"
            placeholder="Ex fever, cold, flu "
            value={form.indication}
            onChange={(e) => setForm({ ...form, indication: e.target.value })}
          />
          <Textarea
            label="Side Effects"
            placeholder=""
            value={form.sideEffects}
            onChange={(e) => setForm({ ...form, sideEffects: e.target.value })}
          />
          {/* <Input
        label="Images"
        placeholder="Product Images"
        value={form.images}
        onChange={(e) => setForm({ ...form, images: e.target.value })}
      /> */}

          <Button className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}{" "}
            {productId ? "Update" : "Save"}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-center justify-between mt-9">
            <Label className="font-normal text-muted-foreground">
              Perscription Required
            </Label>

            <Switch
              checked={form.prescriptionRequired}
              onCheckedChange={(value) =>
                setForm({ ...form, prescriptionRequired: value })
              }
            />
          </div>

          <div>
            <Label className="font-normal text-muted-foreground">Type</Label>

            <div className="flex gap-2 items-center flex-wrap mt-2">
              {type.map((t) => (
                <div
                  className={` py-2 px-4 text-sm  border rounded-md cursor-pointer ${
                    form.type === t
                      ? "text-green-800 border-green-600 bg-green-50 dark:bg-transparent dark:border-green-700 dark:text-green-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  onClick={() => setForm({ ...form, type: t })}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label className="font-normal text-muted-foreground">
              Categories
            </Label>

            <div className="flex gap-2 items-center flex-wrap mt-2">
              {medicineCategories.map((cat) => (
                <div
                  className={` py-2 px-4 text-sm  border rounded-md cursor-pointer ${
                    form.category.includes(cat)
                      ? "text-green-800 border-green-600 bg-green-50 dark:bg-transparent dark:border-green-700 dark:text-green-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {/* {cat.charAt(0).toUpperCase() + cat.slice(1)} */}
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="font-normal text-muted-foreground">Images</Label>

            <div className="flex gap-4 items-center mt-2">
              <label
                htmlFor="file-input"
                className="border rounded-md aspect-square w-28 grid place-items-center cursor-pointer"
              >
                <ImagePlusIcon className="text-gray-500 " />
              </label>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />

              {form.images.map((img) => (
                <div className="border rounded-md aspect-square w-28 grid place-items-center relative">
                  <div
                    className="absolute border rounded-full p-0.5 -top-2 -right-2 z-40 bg-gray-100 shadow-xl cursor-pointer"
                    onClick={() =>
                      setForm({
                        ...form,
                        images: form.images.filter((d) => d !== img),
                      })
                    }
                  >
                    <XIcon className="w-4 h-4" />
                  </div>
                  <div className="relative aspect-square w-full">
                    <Image
                      src={img}
                      alt="Image"
                      fill
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                </div>
              ))}

              {isUploadingImage && (
                <div className="border rounded-md aspect-square w-28 grid place-items-center relative ">
                  <Loader2 className="animate-spin " />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
