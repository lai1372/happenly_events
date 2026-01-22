import { auth } from "@/src/core/firebase/client";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

// Account screen with a sign out button that signs the user out and redirects to the login screen
export default function AccountScreen() {
  async function handleSignOut() {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (e: any) {
      console.error("Sign out failed", e);
    }
  }
  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        gap: 24,
      }}
    >
      <View style={{ alignItems: "center", gap: 8 }}>
        <Text
          variant="headlineMedium"
          style={{ fontWeight: "700", color: "#6200ee" }}
        >
          Account
        </Text>
      </View>

      <Card style={{ borderRadius: 20 }} elevation={2}>
        <Card.Content
          style={{ alignItems: "center", gap: 12, paddingVertical: 24 }}
        >
          <Avatar.Text
            accessibilityLabel="User avatar"
            size={72}
            label="JD"
            style={{ backgroundColor: "#EDE9FE" }}
            labelStyle={{ color: "#5B21B6", fontWeight: "700" }}
          />

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text variant="titleLarge" style={{ fontWeight: "700" }} accessibilityLabel="User name">
              John Doe
            </Text>
            <Text variant="bodyMedium" style={{ opacity: 0.7 }} accessibilityLabel="User email">
              john.doe@example.com
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSignOut}
        accessibilityRole="button"
        accessibilityLabel="Sign out of your account"
        accessibilityHint="Logs you out and returns you to the login screen"
        contentStyle={{ paddingVertical: 8 }}
        style={{ borderRadius: 14 }}
      >
        Sign out
      </Button>
    </View>
  );
}
