import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import StorageService from "./storage-service";

class ProductService {
  async getAll() {
    const snaps = await getDocs(query(collection(db, "products"), limit(50)));

    return snaps.docs.map((doc) => doc.data());
  }

  async add(id: string, data: any) {
    try {
      await setDoc(doc(db, `products/${id}`), {
        id,
        ...data,
        createdAt: new Date().toISOString(),
      });
      toast.success("Added product successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(`${error}`);
    }
  }

  async update(id: string, data: any) {}

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
