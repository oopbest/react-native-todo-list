import { SafeAreaProvider } from "react-native-safe-area-context";
import { TasksProvider } from "./context/TasksContext.js";
import TaskListScreen from "./screens/TaskListScreen.js";

export default function App() {
  return (
    <SafeAreaProvider>
      <TasksProvider>
        <TaskListScreen />
      </TasksProvider>
    </SafeAreaProvider>
  );
}
