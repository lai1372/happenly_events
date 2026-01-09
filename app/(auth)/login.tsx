import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Button, Card, HelperText, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { login } from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle user login, redirect to home on success, show error message on failure
  async function onLogin() {
    setErr(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/");
    } catch (e: any) {
      setErr("Incorrect username or email address, please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: 16,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Card>
              <Card.Title
                title="Sign in"
                titleVariant="headlineSmall"
                subtitle="Use your email and password"
              />
              <Card.Content style={{ gap: 12 }}>
                <TextInput
                  label="Email"
                  mode="outlined"
                  accessibilityLabel="Email address"
                  accessibilityHint="Enter your email address"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  left={<TextInput.Icon icon="email" />}
                  error={!!err}
                  returnKeyType="next"
                />

                <TextInput
                  label="Password"
                  accessibilityLabel="Password"
                  accessibilityHint="Enter your password"
                  mode="outlined"
                  secureTextEntry
                  autoComplete="password"
                  value={password}
                  onChangeText={setPassword}
                  left={<TextInput.Icon icon="lock" />}
                  error={!!err}
                  returnKeyType="done"
                  onSubmitEditing={onLogin}
                />

                {err ? (
                  <HelperText type="error" visible>
                    {err}
                  </HelperText>
                ) : null}

                <Button
                  mode="contained"
                  onPress={onLogin}
                  loading={loading}
                  disabled={loading || !email.trim() || !password}
                  icon="login"
                  contentStyle={{ paddingVertical: 6 }}
                >
                  Sign in
                </Button>
              </Card.Content>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
