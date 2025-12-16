import { router } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";

import { db } from "@/src/core/firebase/client";

type Category = { id: string; name: string };

export default function CreateEventScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [dateStr, setDateStr] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const snap = await getDocs(query(collection(db, "categories")));
        const cats = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as { name: string }),
        })) as Category[];
        setCategories(cats);
        if (!categoryId && cats.length) setCategoryId(cats[0].id);
      } catch (e: any) {
        console.error("Failed to load categories", e);
      }
    }
    loadCategories();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      title.trim().length > 0 &&
      location.trim().length > 0 &&
      dateStr.trim().length > 0 &&
      categoryId.trim().length > 0 &&
      !saving
    );
  }, [title, location, dateStr, categoryId, saving]);

  function parseDateToTimestamp(input: string): Timestamp | null {
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]); // 1-12
    const day = Number(m[3]);
    const dt = new Date(year, month - 1, day, 12, 0, 0);
    if (Number.isNaN(dt.getTime())) return null;
    return Timestamp.fromDate(dt);
  }

  async function onCreate() {
    const ts = parseDateToTimestamp(dateStr.trim());
    if (!ts) {
      Alert.alert("Invalid date", "Use format YYYY-MM-DD (e.g. 2026-01-20).");
      return;
    }

    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, "events"), {
        title: title.trim(),
        description: description.trim() || "",
        location: location.trim(),
        date: ts,
        categoryId,
        imageUrl: imageUrl.trim() || "",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Event created", `ID: ${docRef.id}`);
      router.replace("/events");
    } catch (e: any) {
      Alert.alert("Create failed", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Create event</Text>

      <Text>Title *</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Jazz Night"
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />

      <Text>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="What’s happening?"
        multiline
        style={{ borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 90 }}
      />

      <Text>Location *</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="e.g. Shoreditch, London"
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />

      <Text>Date (YYYY-MM-DD) *</Text>
      <TextInput
        value={dateStr}
        onChangeText={setDateStr}
        placeholder="e.g. 2026-01-20"
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />

      <Text>Category *</Text>
      <View style={{ gap: 8 }}>
        {categories.length === 0 ? (
          <Text style={{ opacity: 0.7 }}>
            No categories found. Add some in Firestore.
          </Text>
        ) : (
          categories.map((c) => (
            <Button
              key={c.id}
              title={c.id === categoryId ? `✓ ${c.name}` : c.name}
              onPress={() => setCategoryId(c.id)}
            />
          ))
        )}
      </View>

      <Text>Image URL</Text>
      <TextInput
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholder="https://..."
        autoCapitalize="none"
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />

      <Button
        title={saving ? "Saving..." : "Create event"}
        onPress={onCreate}
        disabled={!canSubmit}
      />
    </ScrollView>
  );
}
