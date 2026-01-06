import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { router } from "expo-router";
import { login } from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onLogin() {
    setErr(null);
    try {
      await login(email.trim(), password);
      router.replace("/");
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    }
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />
      {err ? <Text style={{ color: "red" }}>{err}</Text> : null}
      <Button title="Sign in" onPress={onLogin} />
    </View>
  );
}
