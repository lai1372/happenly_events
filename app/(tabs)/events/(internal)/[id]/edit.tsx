import { db } from "@/src/core/firebase/client";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { updateEvent } from "../../api";

import {
  Button,
  Divider,
  HelperText,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEventById } from "../../api";
import type { Event } from "../../models";

export default function EditEvent() {
  const params = useLocalSearchParams();

  // Get event ID from route parameters
  const eventId = params.id as string;

  // Use Event type for form state, start with empty fields and populate on load
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

  // Load existing event data on focus, useful for pre-filling the form fields
  useFocusEffect(
    useCallback(() => {
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
    }, [eventId])
  );

  // Handle saving the updated event data to Firestore, then navigate back to the event details page. Log errors if the update fails.
  const handleSave = async () => {
    try {
      await updateEvent(eventId, eventData);
      router.push(`/events/${eventId}`);
    } catch (e) {
      console.error("Failed to update event", e);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Surface style={{ padding: 16, borderRadius: 12 }} elevation={2}>
          <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
            Editing event: {eventData.title}
          </Text>

          <TextInput
            label="Title"
            mode="outlined"
            accessibilityLabel="Event title"
            value={eventData.title}
            onChangeText={(text) => setEventData({ ...eventData, title: text })}
            style={{ marginBottom: 12 }}
          />

          <TextInput
            label="Description"
            accessibilityLabel="Event description"
            mode="outlined"
            multiline
            value={eventData.description}
            onChangeText={(text) =>
              setEventData({ ...eventData, description: text })
            }
            style={{ marginBottom: 12 }}
          />

          <TextInput
            label="Date (DD-MM-YYYY)"
            mode="outlined"
            accessibilityLabel="Event date in DD-MM-YYYY format"
            left={<TextInput.Icon icon="calendar" />}
            value={eventData.date}
            error={!!dateError}
            onChangeText={(text) => setEventData({ ...eventData, date: text })}
            onBlur={() => {
              if (eventData.date && !dateRegex.test(eventData.date)) {
                setDateError("Date must be in format DD-MM-YYYY");
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
            accessibilityLabel="Event location"
            left={<TextInput.Icon icon="map-marker" />}
            value={eventData.location}
            onChangeText={(text) =>
              setEventData({ ...eventData, location: text })
            }
            style={{ marginBottom: 12 }}
          />

          <TextInput
            label="Image URL"
            accessibilityLabel="Event image URL"
            mode="outlined"
            left={<TextInput.Icon icon="image" />}
            value={eventData.imageUrl}
            onChangeText={(text) =>
              setEventData({ ...eventData, imageUrl: text })
            }
            style={{ marginBottom: 12 }}
          />

          <TextInput
            label="Image description (max 50 chars)"
            accessibilityLabel="Description of the event image for accessibility"
            mode="outlined"
            value={eventData.imageDescription}
            maxLength={50}
            onChangeText={(text) =>
              setEventData({ ...eventData, imageDescription: text })
            }
          />

          <Button
            accessibilityRole="button"
            accessibilityLabel="Save changes to event"
            accessibilityHint="Saves the edited event and returns to the event details screen"
            mode="contained"
            onPress={handleSave}
            style={{ marginTop: 24 }}
          >
            Save Changes
          </Button>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}
