import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { Redirect, Stack, router } from "expo-router";
import React, { useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import OfflineBanner from "../../components/offline-banner";

function HamburgerMenu() {
  const [visible, setVisible] = useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <IconButton
          style={{ margin: 0 }}
          size={24}
          icon="menu"
          onPress={() => setVisible(true)}
          accessibilityLabel="Open menu"
        />
      }
    >
      <Menu.Item
        title="Home"
        onPress={() => {
          setVisible(false);
          router.push("/");
        }}
      />
      <Menu.Item
        title="Account"
        onPress={() => {
          setVisible(false);
          router.push("/account");
        }}
      />
      <Menu.Item
        title="Events"
        onPress={() => {
          setVisible(false);
          router.push("/events");
        }}
      />
      <Menu.Item
        title="Create Event"
        onPress={() => {
          setVisible(false);
          router.push("/events/create");
        }}
      />
    </Menu>
  );
}

export default function TabsLayout() {
  // Firebase authentication
  const { user, loading } = useAuth();

  if (loading) return null;

  // If no user found, redirect to login page
  if (!user) return <Redirect href="/login" />;

  // If user exists, show hamburger menu
  return (
    <>
      <OfflineBanner />
      <Stack
        screenOptions={{
          headerTitle: "",
          headerLeft: () => <HamburgerMenu />,
        }}
      />
    </>
  );
}
