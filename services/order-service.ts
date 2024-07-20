import { db } from "@/lib/firebase";
import {
  setDoc,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  collection,
  getDocs,
  query,
  where,
  limit,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { v4 } from "uuid";

class OrderService {
  async getCustomers() {
    const snaps = await getDocs(
      query(
        collection(db, "order-entries"),
        limit(20),
        orderBy("updatedAt", "desc")
      )
    );

    return snaps.docs.map((doc) => doc.data()) as ICustomerEntity[];
  }

  async createCustomer(
    customerName: string,
    customerAddress: string
  ): Promise<ICustomerEntity> {
    const id = v4();

    await setDoc(
      doc(db, `order-entries/${id}`),
      {
        id,
        name: customerName,
        address: customerAddress,
        slug: customerName.toLowerCase().replaceAll(" ", "-"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    await setDoc(
      doc(db, `stats/orders`),
      {
        totalCustomers: increment(1),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return await this.getCustomer(id);
  }

  async recordEntry(id: string, amount: number) {
    await updateDoc(doc(db, `order-entries/${id}`), {
      orders: arrayUnion({
        amount,
        createdAt: new Date().toISOString(),
      }),
      updatedAt: new Date().toISOString(),
    });

    await updateDoc(doc(db, `stats/orders`), {
      totalOrders: increment(1),
      totalRevenue: increment(amount),
      updatedAt: new Date().toISOString(),
    });
  }

  async getCustomer(id: string) {
    const snap = await getDoc(doc(db, `order-entries/${id}`));
    return snap.data() as ICustomerEntity;
  }

  async searchCustomers(keyword: string) {
    const searchTerm = keyword.toLowerCase().replaceAll(" ", "-");
    const snaps = await getDocs(
      query(
        collection(db, "order-entries"),
        where("slug", ">=", searchTerm),
        where("slug", "<=", searchTerm + "\uf8ff"),
        limit(4)
      )
    );

    const data = snaps.docs.map((doc) => doc.data()) as ICustomerEntity[];
    console.log("data: ", data);

    return data;
  }

  async getStats() {
    const snap = await getDoc(doc(db, `stats/orders`));
    return snap.data() as IStatsEntity;
  }
}

const orderService = new OrderService();

export default orderService;

export interface ICustomerEntity {
  id: string;
  name: string;
  address: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  orders: IOrderEntity[];
}
export interface IOrderEntity {
  amount: number;
  createdAt: string;
}

export interface IStatsEntity {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  updatedAt: string;
}
