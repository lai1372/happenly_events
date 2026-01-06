import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
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

  if (events.length === 0) {
    return <Text>No events found.</Text>;
  }

  return (
    <View>
      {events.map((event) => (
        <Card key={event.id} style={{ margin: 10 }}>
          <Card.Title title={event.title} />
          <Card.Content>
            <View
              key={event.id}
              accessible
              accessibilityRole="summary"
              accessibilityLabel={`${event.title}. ${event.description}.`}
            >
              <Text accessible={false}>{event.title}</Text>
              <Text accessible={false}>{event.description}</Text>
              <Card.Actions>
                <Button onPress={() => router.push(`/events/${event.id}`)}>
                  View details
                </Button>
              </Card.Actions>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}
