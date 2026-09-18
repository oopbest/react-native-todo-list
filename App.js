import { SafeAreaProvider } from "react-native-safe-area-context";
import TaskListScreen from "./screens/TaskListScreen.js";

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskListScreen />
    </SafeAreaProvider>
  );
}
