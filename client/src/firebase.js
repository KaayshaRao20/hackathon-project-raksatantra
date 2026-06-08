import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwppDg_IU7FQa-4AwsA3BXVPdjcqL9bGg",
  authDomain: "raksha-sastra.firebaseapp.com",
  projectId: "raksha-sastra",
  storageBucket: "raksha-sastra.firebasestorage.app",
  messagingSenderId: "345376054943",
  appId: "1:345376054943:web:4f6b158525b3992d", 
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
