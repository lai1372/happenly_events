import { db } from "@/src/core/firebase/client";
import * as Calendar from "expo-calendar";
import { router, useLocalSearchParams } from "expo-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Image, Text, View } from "react-native";

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

  async function addEventToCalendar() {
    try {
      const perm = await Calendar.requestCalendarPermissionsAsync();
      if (perm.status !== "granted") {
        throw new Error("Calendar permission not granted.");
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

      const writable = calendars.find((c) => c.allowsModifications);
      if (!writable) {
        throw new Error(
          "No writable event calendar found. Enable an iCloud/local calendar in iOS Calendar."
        );
      }
      const [y, m, d] = event.date.split("-").map(Number);

      const start = new Date(y, m - 1, d);

      const end = new Date(y, m - 1, d + 1);

      await Calendar.createEventAsync(writable.id, {
        title: event.title,
        startDate: start,
        endDate: end,
        allDay: true,
        location: event.location,
      });
    } catch (e) {
      console.error("Failed to add event to calendar", e);
    }
  }

  return (
    <View key={event.id}>
      <Text>{event.title}</Text>
      <Text>{event.description}</Text>
      <Text>{event.date}</Text>
      <Text>{event.location}</Text>
      <Image
        style={{ width: 300, height: 300 }}
        source={{ uri: event.imageUrl }}
      />
      <Button
        title="Delete Event"
        onPress={() => {
          deleteDoc(doc(db, "events", event.id));
          setEvent(null);
          router.replace("/events");
        }}
      />
      <Button
        title="Edit Event"
        onPress={() => {
          router.push(`/events/${event.id}/edit`);
        }}
      />
      <Button
        title="Add Event to Calendar"
        onPress={() => {
          addEventToCalendar();
        }}
      />
    </View>
  );
}
