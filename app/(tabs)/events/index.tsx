import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllEvents } from "./api";
import type { Event } from "./models";

// Extend Event type to include an id for listing purposes (key prop)
type EventWithId = Event & { id: string };

export default function EventsList() {

  // State to hold the list of events
  const [events, setEvents] = useState<EventWithId[]>([]);

  // Function to load events from the API
  async function loadEvents() {
    const events = await getAllEvents();
    setEvents(events);
  }

  // Reload events when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  // Handle empty state - if no events, show a message on the screen
  if (events.length === 0) {
    return <Text>No events found.</Text>;
  }

  return (
    // Safe area to avoid notches and screen edges
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
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
      </ScrollView>
    </SafeAreaView>
  );
}
