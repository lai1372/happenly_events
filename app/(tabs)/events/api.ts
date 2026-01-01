import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/src/core/firebase/client";
import type { Category, Event } from "./models";

export type CreateEventInput = Event;
export type UpdateEventInput = Partial<Event>;

export async function getAllCategories(): Promise<Category[]> {
  const snap = await getDocs(query(collection(db, "categories")));

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as { name: string }),
  }));
}

export async function getAllEvents(): Promise<(Event & { id: string })[]> {
  const snap = await getDocs(collection(db, "events"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Event) }));
}

export async function getEventById(
  id: string
): Promise<(Event & { id: string }) | null> {
  if (!id) throw new Error("id_required");

  const snap = await getDoc(doc(db, "events", id));
  if (!snap.exists()) return null;

  return { id: snap.id, ...(snap.data() as Event) };
}

export async function createEvent(input: CreateEventInput) {
  return addDoc(collection(db, "events"), {
    title: input.title.trim(),
    description: input.description?.trim() || "",
    location: input.location.trim() || "",
    date: input.date.trim() || "",
    categoryId: input.categoryId.trim(),
    imageUrl: input.imageUrl?.trim() || "",
    imageDescription: input.imageDescription?.trim() || "",
  } satisfies Event);
}

export async function updateEvent(id: string, patch: UpdateEventInput) {
  if (!id) throw new Error("id_required");
  return updateDoc(doc(db, "events", id), patch);
}

export async function deleteEvent(id: string) {
  if (!id) throw new Error("id_required");
  return deleteDoc(doc(db, "events", id));
}
