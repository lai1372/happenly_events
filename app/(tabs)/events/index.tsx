import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, Card, List, Text } from "react-native-paper";
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
            <Card.Title title={event.title} titleVariant="titleLarge" />
            <Card.Content>
              <View
                key={event.id}
                accessible
                accessibilityRole="summary"
                accessibilityLabel={`${event.date}.`}
              >
                <List.Item
                  title="Date"
                  description={event.date}
                  left={(props) => <List.Icon {...props} icon="calendar" />}
                />
                <List.Item
                  title="Location"
                  description={event.location}
                  left={(props) => <List.Icon {...props} icon="map-marker" />}
                />
                <Image
                  source={{ uri: event.imageUrl }}
                  style={{ width: "100%", height: 200, marginTop: 8 }}
                  accessibilityLabel={event.imageDescription || "Event image"}
                />
                <Card.Actions>
                  <Button
                    mode="contained-tonal"
                    accessibilityRole="button"
                    accessibilityLabel={`View details for ${event.title}`}
                    accessibilityHint="Opens the event details screen"
                    onPress={() => router.push(`/events/${event.id}`)}
                  >
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
