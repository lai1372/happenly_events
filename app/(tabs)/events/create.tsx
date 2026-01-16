import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Platform, ScrollView, View, KeyboardAvoidingView} from "react-native";
import { Button, Card, Chip, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { createEvent, getAllCategories } from "./api";

import type { Category, Event } from "./models";

export default function CreateEventScreen() {
  // Form state variables
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

  // Regular expression to validate date format DD-MM-YYYY
  const dateRegex = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

  useEffect(() => {
    // Load categories from the API when page loads and set them in state
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

  // Determine if the form can be submitted, useMemo to optimise performance, recalculating only when dependencies (form state) change
  const canSubmit = useMemo(() => {
    const dateRegex = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
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
      const newEvent: Event = {
        title,
        description,
        location,
        date: dateStr,
        categoryId,
        imageUrl,
        imageDescription,
      };
      const docRef = await createEvent(newEvent);

      // Show success alert with the new event ID
      Alert.alert("Event created", `ID: ${docRef.id}`);
      router.replace("/events");
    } catch (e: any) {
      // Show error alert if creation fails
      Alert.alert("Create failed", e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    // Safe area to avoid notches and screen edges
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                >
        <Card style={{ marginHorizontal: 16 }}>
          <Card.Content style={{ gap: 12 }}>
            <Text style={{ fontSize: 22, fontWeight: "600" }}>
              Create event
            </Text>

            <Text>Title *</Text>
            <TextInput
              label="Title"
              mode="outlined"
              accessibilityLabel="Event title"
              value={title}
              onChangeText={setTitle}
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                minHeight: 90,
                borderColor: "#ccc",
              }}
            />

            <Text>Description</Text>
            <TextInput
              label="Description"
              accessibilityLabel="Event description"
              mode="outlined"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                minHeight: 90,
                borderColor: "#ccc",
              }}
            />

            <Text>Location *</Text>
            <TextInput
              label="Location"
              mode="outlined"
              accessibilityLabel="Event location"
              value={location}
              onChangeText={setLocation}
              left={<TextInput.Icon icon="map-marker" />}
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                borderColor: "#ccc",
              }}
            />

            <Text>Date (DD-MM-YYYY) *</Text>
            <TextInput
              label="Date (DD-MM-YYYY)"
              mode="outlined"
              accessibilityLabel="Event date in DD-MM-YYYY format"
              value={dateStr}
              left={<TextInput.Icon icon="calendar" />}
              onChangeText={setDateStr}
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                borderColor: dateError ? "red" : "#ccc",
              }}
              onBlur={() => {
                // Validate date format on blur (when user clicks away) and set error message if invalid
                if (dateStr && !dateRegex.test(dateStr)) {
                  setDateError("Date must be in format DD-MM-YYYY");
                } else {
                  setDateError(null);
                }
              }}
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
                  <Chip
                    key={c.id}
                    mode={categoryId === c.id ? "flat" : "outlined"}
                    selected={categoryId === c.id}
                    onPress={() => setCategoryId(c.id)}
                  >
                    {c.name}
                  </Chip>
                ))
              )}
            </View>

            <Text>Image URL</Text>
            <TextInput
              label="Image URL"
              accessibilityLabel="Event image URL"
              mode="outlined"
              value={imageUrl}
              left={<TextInput.Icon icon="image" />}
              onChangeText={setImageUrl}
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                borderColor: "#ccc",
              }}
            />
            <Text>Image description (50 characters max)</Text>
            <TextInput
              label="Image description (max 50 chars)"
              accessibilityLabel="Description of the event image for accessibility"
              mode="outlined"
              value={imageDescription}
              onChangeText={setImageDescription}
              style={{
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                borderColor: "#ccc",
              }}
            />
            <Button
              accessibilityLabel="button"
              accessibilityHint="Creates a new event with the provided details"
              mode="contained"
              loading={saving}
              disabled={!canSubmit}
              onPress={onCreate}
            >
              {saving ? "Saving..." : "Create event"}
            </Button>
          </Card.Content>
        </Card>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
