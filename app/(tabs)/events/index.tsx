import { getDocs, collection } from "firebase/firestore";

import { db } from "@/src/core/firebase/client";
import { useState, useEffect } from "react";
import { Text, View } from "react-native";

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
        </View>
      ))}
    </View>
  );
}