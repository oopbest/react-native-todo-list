import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { TasksProvider } from "./context/TasksContext";
import TaskListScreen from "./screens/TaskListScreen";
import TaskDetailsScreen from "./screens/TaskDetailsScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { colors } from "./theme";

import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { token, isLoading } = useAuth();

  // ขณะกำลังอ่าน Token จาก SecureStore ตอนเปิดแอป
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          // 🔒 Auth Stack (ยังไม่ได้ล็อกอิน)
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // 🔓 App Stack (ล็อกอินแล้ว)
          <>
            <Stack.Screen
              name="TaskList"
              component={TaskListScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TaskDetails"
              component={TaskDetailsScreen}
              options={{ title: "Task details" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TasksProvider>
          <RootNavigator />
        </TasksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
