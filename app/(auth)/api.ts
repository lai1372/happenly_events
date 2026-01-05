import { auth } from "@/src/core/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}
