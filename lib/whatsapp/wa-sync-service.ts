import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

class WASyncService {
  col = collection(db, "wasync");

  async saveMsg(phone: string, msg: any) {
    const docRef = doc(this.col, phone);

    await updateDoc(docRef, {
      updateAt: serverTimestamp(),
      messages: arrayUnion(msg),
    });
  }

  async getMsgs(phone: string) {
    const docRef = doc(this.col, phone);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }
}

const wasync = new WASyncService();
export default wasync;
