import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { colors, spacing } from "../theme";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register(email.trim(), password);
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.message || "Unable to register.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Sign up to start tracking your tasks
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password (minimum 6 characters)"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.s24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.s8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: spacing.s25,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.s16,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.s16,
  },
  button: {
    backgroundColor: colors.primary,
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.s8,
    marginBottom: spacing.s20,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.s12,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
