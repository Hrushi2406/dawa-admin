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
  where,
} from "firebase/firestore";
import { toast } from "sonner";
import StorageService from "./storage-service";
import { IMedicine } from "@/lib/types";
import { triGram } from "./search";

class ProductService {
  async get(productId: string) {
    const snaps = await getDoc(doc(db, "products/" + productId));

    return snaps.data() as IMedicine;
  }
  async getAll() {
    const snaps = await getDocs(query(collection(db, "products")));

    return snaps.docs.map((doc) => doc.data()) as IMedicine[];
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
      await updateDoc(doc(db, `core/${id}`), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Updated product successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(`${error}`);
    }
  }

  async search(searchTerm: string) {
    const searchLimit = 5;
    console.log("searchTerm: ", searchTerm);

    // First we build out all our search constraints
    if (searchTerm.length < 3) return [];
    const searchConstraints: any = [];
    const terms = triGram(searchTerm);

    if (terms.size === 0) return [];

    terms.forEach((value, key) => console.log(key, value));

    // const name = "rub";

    terms.forEach((value, key) => {
      const temp = `meta.${key}`;

      searchConstraints.push(where(temp, "==", true));
    });
    // searchConstraints.push(where(`meta.rub`, "==", true))
    // searchConstraints.push(where(`meta.${name}`, "==", true));

    // Combine that with any other search constraint
    let constraints: any = [
      collection(db, "core"),
      // where('postType', '==', 'altfuel'),
      // where('visibility', '==', 'public'),
      ...searchConstraints,
      limit(searchLimit),
    ];

    // console.log("constraints: ", constraints);

    // Build the query and get the documents
    const q = query.apply(this, constraints);
    const querySnapshot = await getDocs(q);

    const results: any = [];
    querySnapshot.forEach((doc) => results.push(doc.data()));
    console.log("results: ", results);
    return results;

    // let ref: any = query(
    //   collection(db, "products"),
    //   // or(
    //   // where("slug", "array-contains-any", searchTerm.split(" ")),
    //   where("name", ">=", searchTerm),
    //   where("name", "<=", searchTerm + "\uf8ff")
    //   // )
    // );

    // const snap = await getDocs(ref);

    // const products = snap.docs.map((doc) => doc.data()) as IMedicine[];
    // console.log("products: ", products);

    // return products;
  }

  async searchProducts(searchTerm: string) {
    let ref: any = query(
      collection(db, "products"),
      // or(
      // where("slug", "array-contains-any", searchTerm.split(" ")),
      where("name", ">=", searchTerm),
      where("name", "<=", searchTerm + "\uf8ff")
      // )
    );

    const snap = await getDocs(ref);

    const products = snap.docs.map((doc) => doc.data()) as IMedicine[];
    console.log("products: ", products);

    return products;
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
