import { db } from "@/src/core/firebase/client";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";

export default function EditEvent() {
  const eventId = useLocalSearchParams().id;
  const [eventData, setEventData] = useState<any>({
    title: "",
    description: "",
    date: "",
    location: "",
    imageUrl: "",
    imageDescription: "",
  });
  const [loading, setLoading] = useState(true);

  const [dateError, setDateError] = useState<string | null>(null);
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  useEffect(() => {
    async function fetchEvent() {
      try {
        const docRef = getDoc(doc(db, "events", eventId as string));
        const docSnap = await docRef;
        if (docSnap.exists()) {
          setEventData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (e: any) {
        console.error("Failed to load event", e);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  const handleSave = async () => {
    try {
      const eventRef = doc(db, "events", eventId as string);
      await updateDoc(eventRef, eventData);
      router.replace(`/events/${eventId}`);
    } catch (e: any) {
      console.error("Failed to update event", e);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>
        Editing event: {eventData.title}
      </Text>
      <View>
        <Text>Title</Text>
        <TextInput
          placeholder="Title"
          value={eventData.title}
          onChangeText={(text) => setEventData({ ...eventData, title: text })}
          style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
        />
        <Text>Description</Text>
        <TextInput
          placeholder="Description"
          value={eventData.description}
          onChangeText={(text) =>
            setEventData({ ...eventData, description: text })
          }
          style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
        />

        <Text>Date (YYYY-MM-DD) *</Text>
        <TextInput
          value={eventData.date}
          onChangeText={(text) => setEventData({ ...eventData, date: text })}
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            borderColor: dateError ? "red" : "#ccc",
          }}
          onBlur={() => {
            if (eventData.date && !dateRegex.test(eventData.date)) {
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

        <Text>Location</Text>
        <TextInput
          placeholder="Location"
          value={eventData.location}
          onChangeText={(text) =>
            setEventData({ ...eventData, location: text })
          }
          style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
        />

        <Text>Image URL</Text>
        <TextInput
          placeholder="Image URL"
          value={eventData.imageUrl}
          onChangeText={(text) =>
            setEventData({ ...eventData, imageUrl: text })
          }
          style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
        />
        <Text>Image description (50 characters max)</Text>
        <TextInput
          placeholder="Image description"
          value={eventData.imageDescription}
          onChangeText={(text) =>
            setEventData({ ...eventData, imageDescription: text })
          }
          style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
        />
        <Button title="Save Changes" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}
