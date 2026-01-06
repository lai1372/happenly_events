import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import {
  Button,
  Chip,
  Divider,
  HelperText,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
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
    const isValidDateFormat = (date: string) => dateRegex.test(date);

    return (
      title.trim().length > 0 &&
      location.trim().length > 0 &&
      isValidDateFormat(dateStr) &&
      categoryId.trim().length > 0 &&
      !saving
    );
  }, [title, location, dateStr, categoryId, saving]);

  function validateDate() {
    if (dateStr && !dateRegex.test(dateStr)) {
      setDateError("Date must be in format YYYY-MM-DD");
    } else {
      setDateError(null);
    }
  }

  async function onCreate() {
    setSaving(true);
    try {
      const docRef = await createEvent({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date: dateStr.trim(),
        categoryId: categoryId.trim(),
        imageUrl: imageUrl.trim(),
        imageDescription: imageDescription.trim(),
      });

      Alert.alert("Event created", `ID: ${docRef.id}`);
      router.replace("/events");
    } catch (e: any) {
      Alert.alert("Create failed", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  const showCategoryError = !saving && categoryId.trim().length === 0;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Surface style={{ padding: 16, borderRadius: 12 }} elevation={2}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>
          Create event
        </Text>

        <TextInput
          label="Title *"
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Jazz Night"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          placeholder="What’s happening?"
          multiline
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Location *"
          mode="outlined"
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Shoreditch, London"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Date (YYYY-MM-DD) *"
          mode="outlined"
          value={dateStr}
          onChangeText={(t) => setDateStr(t)}
          onBlur={validateDate}
          error={!!dateError}
          placeholder="e.g. 2026-01-20"
          keyboardType="numbers-and-punctuation"
        />
        <HelperText type="error" visible={!!dateError}>
          {dateError}
        </HelperText>

        <Divider style={{ marginVertical: 16 }} />

        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          Category *
        </Text>

        {categories.length === 0 ? (
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
            No categories found. Add some in Firestore.
          </Text>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {categories.map((c) => {
              const selected = categoryId === c.id;
              return (
                <Chip
                  key={c.id}
                  mode={selected ? "flat" : "outlined"}
                  selected={selected}
                  showSelectedCheck
                  onPress={() => setCategoryId(c.id)}
                >
                  {c.name}
                </Chip>
              );
            })}
          </View>
        )}

        <HelperText type="error" visible={showCategoryError && !!title}>
          Please choose a category
        </HelperText>

        <Divider style={{ marginVertical: 16 }} />

        <TextInput
          label="Image URL"
          mode="outlined"
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://..."
          autoCapitalize="none"
          keyboardType="url"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Image description (max 50 chars)"
          mode="outlined"
          value={imageDescription}
          onChangeText={setImageDescription}
          maxLength={50}
        />

        <Button
          mode="contained"
          loading={saving}
          disabled={!canSubmit}
          onPress={onCreate}
          style={{ marginTop: 24 }}
        >
          Create event
        </Button>

        <Button
          mode="text"
          disabled={saving}
          onPress={() => router.back()}
          style={{ marginTop: 8 }}
        >
          Cancel
        </Button>
      </Surface>
    </ScrollView>
  );
}
