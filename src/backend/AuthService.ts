// src/backend/AuthService.ts
import { auth } from "./FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";

export interface AuthResponse {
  user: UserData | null;
  error: string | null;
}

export interface UserData {
  uid: string;
  email: string;
  role: string;
  status: string;
}

export const AuthService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // First, sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      console.log(`User authenticated with UID: ${firebaseUser.uid}`);

      // Check in all possible collections for the user
      const collectionsToCheck = ["students", "recruiters", "admins"];
      let userData: UserData | null = null;

      // Check each collection sequentially with a query
      // In AuthService.ts, modify the login function to return more user data:
      for (const collectionName of collectionsToCheck) {
        const q = query(
          collection(db, collectionName),
          where("uid", "==", firebaseUser.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          console.log(`Found user in ${collectionName} collection`);

          userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || email,
            role: collectionName,
            status: doc.data().status || "active",
            ...doc.data(), // Include all user data from the document
          };
          break;
        }
      }

      if (!userData) {
        console.error("User document not found in any collection:", {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
        throw new Error("User data not found. Please contact support.");
      }

      // Rest of your code remains the same...
      // Check if user is blocked
      if (userData.status === "blocked") {
        throw new Error(
          "Your account has been blocked. Please contact support."
        );
      }

      return {
        user: userData,
        error: null,
      };
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address format.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many login attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        default:
          if (error.message) {
            errorMessage = error.message;
          }
      }

      return {
        user: null,
        error: errorMessage,
      };
    }
  },
};
