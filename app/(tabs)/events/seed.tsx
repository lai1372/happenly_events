import React from "react";
import { View, Button } from "react-native";
import { seedEvents } from "../../../scripts/seed";

// Populate firebase db with dummy information
export default function SeedScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        title="Seed Firestore"
        onPress={async () => {
          try {
            await seedEvents();
          } catch (err) {
          }
        }}
      />
    </View>
  );
}