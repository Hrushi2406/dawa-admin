"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Loader2, Trash2 } from "lucide-react";

interface Medical {
  id: string;
  name: string;
  locality: string;
  state: string;
  email: string;
  createdAt: any;
  updatedAt: any;
}

interface FormFields {
  name: string;
  locality: string;
  state: string;
  email: string;
  password?: string;
}

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <div>
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default function AddMedicals() {
  const [medicals, setMedicals] = useState<Medical[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMedical, setCurrentMedical] = useState<Medical | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormFields>({
    name: "",
    locality: "",
    state: "",
    email: "",
    password: "",
  });

  const fetchMedicals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "medicals"));
      const medicalsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Medical[];
      setMedicals(medicalsData);
    } catch (error) {
      console.error("Error fetching medicals:", error);
      toast.error("Failed to fetch medicals");
    }
  };

  useEffect(() => {
    fetchMedicals();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing && currentMedical) {
        const docRef = doc(db, "medicals", currentMedical.id);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        toast.success("Medical store updated successfully");
      } else {
        // Create auth user first
        const auth = getAuth();
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password || ""
        );

        const docId = uuidv4();
        const { password, ...dataWithoutPassword } = formData;
        await setDoc(doc(db, "medicals", docId), {
          id: docId,
          ...dataWithoutPassword,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success("Medical store added successfully");
      }
      setIsOpen(false);
      setFormData({
        name: "",
        locality: "",
        state: "",
        email: "",
        password: "",
      });
      setIsEditing(false);
      setCurrentMedical(null);
      fetchMedicals();
    } catch (error) {
      console.error("Error saving medical:", error);
      toast.error("Failed to save medical store: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (medical: Medical) => {
    setCurrentMedical(medical);
    setFormData({
      name: medical.name,
      locality: medical.locality,
      state: medical.state,
      email: medical.email,
    });
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleDelete = async (medical: Medical) => {
    if (window.confirm("Are you sure you want to delete this medical store?")) {
      try {
        await deleteDoc(doc(db, "medicals", medical.id));
        toast.success("Medical store deleted successfully");
        fetchMedicals();
      } catch (error) {
        console.error("Error deleting medical:", error);
        toast.error("Failed to delete medical store");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Stores</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Medical Store</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Medical Store" : "Add New Medical Store"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <FormField
                label="Locality"
                name="locality"
                value={formData.locality}
                onChange={handleInputChange}
              />
              <FormField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
              {!isEditing && (
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              )}
              {!isEditing && (
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                />
              )}
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update" : "Add"} Medical Store
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {medicals.map((medical) => (
          <div
            key={medical.id}
            className="flex justify-between items-center border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div>
              <h2 className="text-lg font-semibold">{medical.name} </h2>
              <p className="dark:text-gray-400">
                {medical.locality}, {medical.state}{" "}
              </p>
            </div>
            <p className="font-normal text-base dark:text-gray-300 text-left">
              {medical.email}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => handleEdit(medical)} variant="outline">
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(medical)}
                variant="destructive"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
