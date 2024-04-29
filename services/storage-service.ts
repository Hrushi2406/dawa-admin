import { storage } from "@/lib/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

class StorageService {
  static async uploadFileAndGetDownloadUrl(file: File, path: string = "") {
    // Create a unique filename for the file

    const fileName = path + `${file.name}`;

    // Create a storage reference for the file
    const storageRef = ref(storage, fileName);

    // Upload the file to Firebase Storage
    let snap = await uploadBytes(storageRef, file);

    return await getDownloadURL(snap.ref);
  }

  static async deleteFile(fileName: string, path: string = "") {
    const fullPath = path + `${fileName}`;
    const storageRef = ref(storage, fullPath);

    await deleteObject(storageRef);
  }
}

export default StorageService;
