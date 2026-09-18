import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TasksProvider } from "./context/TasksContext.js";
import TaskListScreen from "./screens/TaskListScreen.js";
import TaskDetailsScreen from "./screens/TaskDetailsScreen.js";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <TasksProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="TaskList">
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
          </Stack.Navigator>
        </NavigationContainer>
      </TasksProvider>
    </SafeAreaProvider>
  );
}
