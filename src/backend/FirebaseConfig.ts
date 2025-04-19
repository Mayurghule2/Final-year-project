import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  onSnapshot,
  
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_Firebase_API_KEY,
  authDomain: "placement-portal-d8843.firebaseapp.com",
  projectId: "placement-portal-d8843",
  storageBucket: "placement-portal-d8843.appspot.com",
  messagingSenderId: "142133720679",
  appId: "1:142133720679:web:15cbe2d04ffd46cecd06c2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  addDoc, 
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  onSnapshot,
};