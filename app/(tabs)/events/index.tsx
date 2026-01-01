import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { getAllEvents } from "./api";
import type { Event } from "./models";

type EventWithId = Event & { id: string };

export default function EventsList() {
  const [events, setEvents] = useState<EventWithId[]>([]);

  async function loadEvents() {
    const events = await getAllEvents();
    setEvents(events);
  }
  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <View>
      {events.map((event) => (
        <View
          key={event.id}
          accessible
          accessibilityRole="summary"
          accessibilityLabel={`${event.title}. ${event.description}.`}
        >
          <Text accessible={false}>{event.title}</Text>
          <Text accessible={false}>{event.description}</Text>

          <Button
            title="View details"
            accessibilityLabel={`View details for ${event.title}`}
            onPress={() => router.push(`/events/${event.id}`)}
          />
        </View>
      ))}
    </View>
  );
}
