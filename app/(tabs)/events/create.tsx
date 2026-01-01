import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import { createEvent, getAllCategories } from "./api";
import type { Category } from "./models";


export default function CreateEventScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  const [dateStr, setDateStr] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const [saving, setSaving] = useState(false);

  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    }
    loadCategories();
  }, []);

  const canSubmit = useMemo(() => {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    const isValidDateFormat = (date: string) => dateRegex.test(date);

    return (
      title.trim().length > 0 &&
      location.trim().length > 0 &&
      isValidDateFormat(dateStr) &&
      categoryId.trim().length > 0 &&
      !saving
    );
  }, [title, location, dateStr, categoryId, saving]);

  async function onCreate() {
    setSaving(true);
    try {
      const docRef = await createEvent({
        title,
        description,
        location,
        date: dateStr,
        categoryId,
        imageUrl,
        imageDescription,
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
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          borderColor: dateError ? "red" : "#ccc",
        }}
        onBlur={() => {
          if (dateStr && !dateRegex.test(dateStr)) {
            setDateError("Date must be in format YYYY-MM-DD");
          } else {
            setDateError(null);
          }
        }}
        placeholder="e.g. 2026-01-20"
        keyboardType="numbers-and-punctuation"
      />

      {dateError && (
        <Text style={{ color: "red", marginTop: 4 }}>{dateError}</Text>
      )}

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
      <Text>Image description (50 characters max)</Text>
      <TextInput
        placeholder="Image description"
        value={imageDescription}
        onChangeText={setImageDescription}
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
