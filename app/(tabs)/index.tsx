import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { Button, Card, Chip, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllCategories } from "./events/api";
import { Category } from "./events/models";

// Type safe structure for dummy past event
type DummyPastEvent = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  imageDescription: string;
};

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories from firestore on page load
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    }
    loadCategories();
  }, []);

  // List of dummy past events
  const pastEvents: DummyPastEvent[] = useMemo(
    () => [
      {
        id: "feat-1",
        title: "Seafront Live Sessions",
        subtitle: "Fri • 7:30pm • North Pier",
        category: "Music",
        imageUrl:
          "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=60",
        imageDescription: "Seaside sunset with person dancing",
      },
      {
        id: "feat-2",
        title: "Taste of Blackpool",
        subtitle: "Sat • 12:00pm • Promenade",
        category: "Food & Drink",
        imageUrl:
          "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=60",
        imageDescription: "People eating food around a restaurant table",
      },
      {
        id: "feat-3",
        title: "Creative Workshop Morning",
        subtitle: "Sun • 10:00am • Stanley Park",
        category: "Education",
        imageUrl:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60",
        imageDescription: "Creative workshop",
      },
    ],
    []
  );

  // If no categories in state, return null
  if (categories.length === 0) {
    return null;
  }

  return (
    <ScrollView>
      <SafeAreaView>
        <Card>
          <Card.Content>
            <Text variant="headlineSmall">What’s on in Blackpool</Text>

            <Text variant="bodyMedium">
              Discover events happening across Blackpool, UK — from live music
              and food pop-ups to workshops, talks, comedy nights, family days,
              and community meet-ups.
            </Text>

            <Text variant="bodyMedium">
              Whether you’re planning ahead or looking for something
              spontaneous, this is a quick way to see what’s going on — without
              the noise.
            </Text>

            <Divider style={{ marginVertical: 12 }} />

            <Text variant="titleSmall">How it works</Text>
            <Text variant="bodyMedium">
              Browse categories, open the full events list, and keep an eye out
              for featured picks we highlight each week. New listings get added
              as soon as they’re available.
            </Text>

            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              Tip: If you’re not sure what you fancy, start with “Food & Drink”
              or “Music” — they’re usually the most active.
            </Text>
          </Card.Content>

          <Card.Actions>
            <Button
              accessibilityLabel="button"
              accessibilityHint="Navigates to the events list screen"
              mode="contained"
              onPress={() => router.push("/events")}
            >
              Browse all events
            </Button>
          </Card.Actions>
        </Card>

        <Card>
          <Card.Content>
            <Text variant="titleMedium">Past events </Text>
            <Text variant="bodySmall">
              A few previous events to show the range of what we can offer!
            </Text>

            <Divider style={{ marginVertical: 12 }} />

            <FlatList
              horizontal
              accessibilityRole="list"
              accessibilityLabel="Past events"
              accessibilityHint="Swipe left or right to browse event cards"
              data={pastEvents}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View
                  style={{ width: 320, marginRight: 12 }}
                  accessible
                  accessibilityRole="summary"
                  accessibilityLabel={`${item.title}. ${item.subtitle}. Category ${item.category}.`}
                >
                  <Card mode="outlined">
                    <Card.Cover
                      source={{ uri: item.imageUrl }}
                      accessible
                      accessibilityRole="image"
                      accessibilityLabel={`${item.imageDescription} event image`}
                    />
                    <Card.Content style={{ marginTop: 12 }}>
                      <Text variant="titleMedium">{item.title}</Text>
                      <Text variant="bodySmall">{item.subtitle}</Text>

                      <View style={{ marginTop: 10, flexDirection: "row" }}>
                        <Chip>{item.category}</Chip>
                      </View>

                      <Text variant="bodyMedium" style={{ marginTop: 10 }}>
                        A quick snapshot of the kind of events you’ll see here —
                        local spots, good vibes, and something to do in town.
                      </Text>
                    </Card.Content>

                    <Card.Actions>
                      <Button
                        mode="text"
                        onPress={() => router.push("/events")}
                      >
                        View all events
                      </Button>
                    </Card.Actions>
                  </Card>
                </View>
              )}
            />
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <Text variant="titleMedium">Event categories</Text>

            <Text variant="bodySmall">
              These are the types of events currently available. Tap a category
              later to filter (when you’re ready to add that).
            </Text>

            <Divider style={{ marginVertical: 12 }} />

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {categories.map((category) => (
                <Chip key={category.id}>{category.name}</Chip>
              ))}
            </View>

            <Text variant="bodySmall" style={{ marginTop: 12 }}>
              Looking for something specific? Head to the full list to search by
              date, venue, or vibe.
            </Text>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <Text variant="titleMedium">Ready to explore?</Text>

            <Text variant="bodyMedium">
              View the full list of upcoming events and start planning your next
              day or night out in Blackpool.
            </Text>

            <Text variant="bodySmall" style={{ marginTop: 8 }}>
              You’ll find everything from free community events to ticketed
              nights out — with a wide range of times, prices, and locations.
            </Text>

            <Button
              accessibilityLabel="button"
              accessibilityHint="Navigates to events list page"
              style={{ marginTop: 12 }}
              mode="contained"
              onPress={() => router.push("/events")}
            >
              View all events
            </Button>
          </Card.Content>
        </Card>
      </SafeAreaView>
    </ScrollView>
  );
}
