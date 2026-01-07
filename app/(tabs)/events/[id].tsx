import * as Calendar from "expo-calendar";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button, Card, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteEvent, getEventById } from "./api";
import type { Event } from "./models";

type EventWithId = Event & { id: string };

export default function EventDetails() {
  const [event, setEvent] = useState<EventWithId | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();

  // Load event details when the component is focused, useful for refreshing data after edits have been made
  useFocusEffect(
    useCallback(() => {
      async function loadEvent() {
        const evt = await getEventById(id);
        if (evt) setEvent(evt);
        else console.log("No such document!");
      }

      if (id) loadEvent();
    }, [id])
  );

  // Handle case where event is not found, show a message on the screen
  if (!event) {
    return <Text>No event found</Text>;
  }

  /* Confirm deletion of the event with an alert dialog, style the buttons appropriately. 
   If confirmed, delete the event and navigate back to the events list, otherwise cancel. */

  function confirmDelete() {
    if (!event) return;
    Alert.alert("Delete Event", "Are you sure you want to delete this event?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteEvent(event.id);
            setEvent(null);
            router.replace("/events");
          } catch (e) {
            Alert.alert("Delete failed", "Please try again.");
          }
        },
      },
    ]);
  }

  // Use Expo Calendar native API to add the event to the user's calendar. Throw errors if permissions are not granted or no writable calendar found.
  async function addEventToCalendar() {
    if (!event) return;
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View
          accessible
          accessibilityRole="summary"
          accessibilityLabel={`${event.title}. ${event.description}. ${event.date}. ${event.location}.`}
          key={event.id}
        >
          <Card>
            <Card.Title title={event.title} />
            <Card.Content>
              <List.Item title="Event" description={event.title} />
              <List.Item title="Description" description={event.description} />
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
              <Card.Cover
                source={{ uri: event.imageUrl }}
                accessibilityLabel={event.imageDescription}
                accessible={true}
              />
              <Card.Actions style={{ justifyContent: "space-between" }}>
                <Button
                  accessibilityLabel="button"
                  accessibilityHint="Adds this event to your device calendar"
                  icon="calendar-plus"
                  mode="contained-tonal"
                  onPress={() => {
                    addEventToCalendar();
                  }}
                >
                  Add to Calendar
                </Button>
                <Button
                  accessibilityLabel="button"
                  accessibilityHint="Edits this event"
                  icon="pencil"
                  mode="outlined"
                  onPress={() => {
                    router.push(`/events/${event.id}/edit`);
                  }}
                >
                  Edit Event
                </Button>

                <Button
                  accessibilityLabel="button"
                  accessibilityHint="Deletes this event permanently"
                  icon="delete"
                  mode="text"
                  onPress={confirmDelete}
                >
                  Delete Event
                </Button>
              </Card.Actions>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
