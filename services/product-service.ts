import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import StorageService from "./storage-service";

class ProductService {
  async getAll() {
    const snaps = await getDocs(query(collection(db, "products"), limit(50)));

    return snaps.docs.map((doc) => doc.data());
  }

  async get(id: string) {
    const snap = await getDoc(doc(db, `products/${id}`));
    return snap.data();
  }

  async add(id: string, data: any) {
    try {
      await setDoc(doc(db, `products/${id}`), {
        id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success("Added product successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(`${error}`);
    }
  }

  async update(id: string, data: any) {
    try {
      await updateDoc(doc(db, `products/${id}`), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Updated product successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(`${error}`);
    }
  }

  async delete(id: string) {
    try {
      await deleteDoc(doc(db, `products/${id}`));
      toast.success("Deleted product successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(`${error}`);
    }
  }
}

const productService = new ProductService();

export default productService;
