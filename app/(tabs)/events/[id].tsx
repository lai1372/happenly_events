import * as Calendar from "expo-calendar";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteEvent, getEventById } from "./api";
import type { Event } from "./models";

type EventWithId = Event & { id: string };

export default function EventDetails() {
  const [event, setEvent] = useState<EventWithId | null>(null);
  const id = useLocalSearchParams().id;

  useEffect(() => {
    async function loadEvent() {
      const evt = await getEventById(id as string);
      if (evt) setEvent(evt);
      else console.log("No such document!");
    }
    loadEvent();
  }, [id]);

  if (!event) {
    return <Text>No event found</Text>;
  }

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
            <Card.Title title={event.title} subtitle={event.date} />
            <Card.Content>
              <Text>{event.title}</Text>
              <Text>{event.description}</Text>
              <Text>{event.date}</Text>
              <Text>{event.location}</Text>
              <Image
                style={{ width: 300, height: 300 }}
                source={{ uri: event.imageUrl }}
                accessible={true}
                accessibilityLabel={event.imageDescription}
              />
              <Card.Actions>
                <Button onPress={confirmDelete}>Delete Event</Button>

                <Button
                  onPress={() => {
                    router.push(`/events/${event.id}/edit`);
                  }}
                >
                  Edit Event
                </Button>

                <Button
                  onPress={() => {
                    addEventToCalendar();
                  }}
                >
                  Add to Calendar
                </Button>
              </Card.Actions>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
