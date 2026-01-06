import { db } from "@/src/core/firebase/client";
import { router, useLocalSearchParams } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import {
  Button,
  Divider,
  HelperText,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import { getEventById } from "../api";
import type { Event } from "../models";

export default function EditEvent() {
  const params = useLocalSearchParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;

  console.log("Editing event with ID:", eventId);
  const [eventData, setEventData] = useState<Event>({
    title: "",
    description: "",
    date: "",
    location: "",
    categoryId: "",
    imageUrl: "",
    imageDescription: "",
  });

  const [loading, setLoading] = useState(true);

  const [dateError, setDateError] = useState<string | null>(null);
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  useEffect(() => {
    if (!eventId) return;

    async function fetchEvent() {
      try {
        const evt = await getEventById(eventId);
        if (evt) {
          const { id, ...docFields } = evt;
          setEventData(docFields);
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error("Failed to fetch event", e);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "events", eventId as string), {
        title: eventData.title.trim(),
        description: eventData.description?.trim(),
        location: eventData.location.trim(),
        date: eventData.date.trim(),
        categoryId: eventData.categoryId.trim(),
        imageUrl: eventData.imageUrl?.trim(),
        imageDescription: eventData.imageDescription?.trim(),
      });
      router.push(`/events/${eventId}`);
    } catch (e) {
      console.error("Failed to update event", e);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Surface style={{ padding: 16, borderRadius: 12 }} elevation={2}>
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>
          Editing event: {eventData.title}
        </Text>

        <TextInput
          label="Title"
          mode="outlined"
          value={eventData.title}
          onChangeText={(text) => setEventData({ ...eventData, title: text })}
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Description"
          mode="outlined"
          multiline
          value={eventData.description}
          onChangeText={(text) =>
            setEventData({ ...eventData, description: text })
          }
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Date (YYYY-MM-DD)"
          mode="outlined"
          value={eventData.date}
          error={!!dateError}
          onChangeText={(text) => setEventData({ ...eventData, date: text })}
          onBlur={() => {
            if (eventData.date && !dateRegex.test(eventData.date)) {
              setDateError("Date must be in format YYYY-MM-DD");
            } else {
              setDateError(null);
            }
          }}
          keyboardType="numbers-and-punctuation"
        />

        <HelperText type="error" visible={!!dateError}>
          {dateError}
        </HelperText>

        <Divider style={{ marginVertical: 16 }} />

        <TextInput
          label="Location"
          mode="outlined"
          value={eventData.location}
          onChangeText={(text) =>
            setEventData({ ...eventData, location: text })
          }
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Image URL"
          mode="outlined"
          value={eventData.imageUrl}
          onChangeText={(text) =>
            setEventData({ ...eventData, imageUrl: text })
          }
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Image description (max 50 chars)"
          mode="outlined"
          value={eventData.imageDescription}
          maxLength={50}
          onChangeText={(text) =>
            setEventData({ ...eventData, imageDescription: text })
          }
        />

        <Button mode="contained" onPress={handleSave} style={{ marginTop: 24 }}>
          Save Changes
        </Button>
      </Surface>
    </ScrollView>
  );
}
