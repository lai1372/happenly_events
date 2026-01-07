import { auth } from "@/src/core/firebase/client";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { Button, View } from "react-native";

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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
