// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCI6QcVcB7PTV8i4hzSZq0PGZlCvzEuYFw",
  authDomain: "dawa-247.firebaseapp.com",
  projectId: "dawa-247",
  storageBucket: "dawa-247.appspot.com",
  messagingSenderId: "528301612136",
  appId: "1:528301612136:web:586d873979209e37006fdd",
  measurementId: "G-T0F7S7F8MX",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
