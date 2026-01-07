import { auth } from "@/src/core/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";

// Handle user login with email and password using Firebase Authentication
export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}
