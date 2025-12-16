import { db } from "@/src/core/firebase/client";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

export default function EventDetails() {
  const [event, setEvent] = useState<any>(null);
  const id = useLocalSearchParams().id;

  useEffect(() => {
    async function loadEvent() {
      try {
        const docRef = getDoc(doc(db, "events", id as string));
        const docSnap = await docRef;
        console.log("Document snapshot:", docSnap.data());
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...(docSnap.data() as any) });
        } else {
          console.log("No such document!");
        }
      } catch (e: any) {
        console.error("Failed to load event", e);
      }
    }
    loadEvent();
  }, [id]);

  if (!event) {
    return <Text>Loading...</Text>;
  }

  return (
    <View key={event.id}>
      <Text>{event.title}</Text>
      <Text>{event.description}</Text>
      <Text>{event.date.toDate().toString()}</Text>
      <Text>{event.location}</Text>
      <Image
        style={{ width: 300, height: 300 }}
        source={{ uri: event.imageUrl }}
      />
    </View>
  );
}
