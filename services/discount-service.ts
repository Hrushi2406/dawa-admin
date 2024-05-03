import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";

class DiscountService {
  async getAll() {
    const snaps = await getDocs(collection(db, "discounts"));
    console.log("snaps:", snaps.docs.length);

    return snaps.docs.map((doc) => doc.data()) as IDiscount[];
  }

  async get(id: string) {
    const snap = await getDoc(doc(db, `discounts/${id}`));
    return snap.data() as IDiscount;
  }

  async update(id: string, data: IDiscount) {
    try {
      await updateDoc(doc(db, `discounts/${id}`), { ...data });
      toast.success("Updated discount successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.toString());
    }
  }

  async create(data: IDiscount) {
    try {
      await setDoc(doc(db, `discounts/${data.id}`), data);
      toast.success("Created discount successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.toString());
    }
  }

  async delete(id: string) {
    try {
      await deleteDoc(doc(db, `discounts/${id}`));
      toast.success("Deleted discount successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.toString());
    }
  }
}

const discountService = new DiscountService();

export default discountService;

export interface IDiscount {
  id: string;
  code: string;
  for?: string;
  discount: number;
  type: string;
  expiresAt?: string;
  createdAt: string;
}
