import { db } from "@/src/core/firebase/client";
import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function EventsList() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function loadEvents() {
      try {
        const snap = await getDocs(collection(db, "events"));
        const evts = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        console.log("Loaded events:", evts);
        setEvents(evts);
      } catch (e: any) {
        console.error("Failed to load events", e);
      }
    }
    loadEvents();
  }, []);

  return (
    <View>
      {events.map((event) => (
        <View key={event.id}>
          <Text>{event.title}</Text>
          <Text>{event.description}</Text>
          <Button
            title="View Details"
            onPress={() => router.push(`/events/${event.id}`)}
          />
        </View>
      ))}
    </View>
  );
}