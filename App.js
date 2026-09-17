import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import TaskItem from "./components/TaskItem.js";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskProgress from "./components/TaskProgress.js";
import TaskFilters from "./components/TaskFilters.js";
import AddTaskForm from "./components/AddTaskForm.js";

const FILTERS_STATUS = {
  all: "all",
  completed: "completed",
  pending: "pending",
};

const TASKS_STORAGE_KEY = "task-tracker:tasks";

function getEmptyMessage(filter, totalCount) {
  if (totalCount === 0) {
    return "Start by adding your first task.";
  }
  if (filter === FILTERS_STATUS.pending) {
    return "All done! No pending tasks.";
  }
  if (filter === FILTERS_STATUS.completed) {
    return "No completed tasks yet.";
  }
  return "No tasks found.";
}

function isValidTasks(value) {
  if (!Array.isArray(value)) return false;

  const ids = new Set();

  return value.every((task) => {
    if (typeof task !== "object" || task === null) return false;
    if (!Number.isInteger(task.id) || task.id <= 0) return false;
    if (typeof task.title !== "string" || !task.title.trim()) return false;
    if (typeof task.completed !== "boolean") return false;

    if (ids.has(task.id)) return false;

    ids.add(task.id);
    return true;
  });
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState(FILTERS_STATUS.all);

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveAttempt, setSaveAttempt] = useState(0);

  useEffect(() => {
    async function loadTasks() {
      setLoadError(null);
      setIsLoaded(false);

      try {
        const savedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

        if (savedTasks !== null) {
          const loadedTasks = JSON.parse(savedTasks); // Convert JSON string back to an array

          if (!isValidTasks(loadedTasks)) {
            throw new Error("Invalid saved tasks format.");
          }

          setTasks(loadedTasks);
          console.log("Tasks loaded successfully.");
        }

        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading tasks:", error);
        setLoadError("Unable to load your tasks. Please try again.");
      }
    }

    loadTasks();
  }, [loadAttempt]);

  useEffect(() => {
    if (!isLoaded) return; // Don't attempt to save tasks if they haven't been loaded

    let isActive = true;

    async function saveTasks() {
      setSaveStatus("saving");

      try {
        const serializedTasks = JSON.stringify(tasks);
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, serializedTasks);

        if (isActive) {
          setSaveStatus("saved");
        }
      } catch (error) {
        console.error("Error saving tasks:", error);

        if (isActive) {
          setSaveStatus("error");
        }
      }
    }

    saveTasks();

    return () => {
      isActive = false;
    };
  }, [tasks, isLoaded, saveAttempt]);

  function handleToggle(taskId) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  const pendingTasksCount = tasks.filter((task) => !task.completed).length;
  const completedTasksCount = tasks.length - pendingTasksCount;

  function handleAddTask() {
    const title = newTaskTitle.trim();

    if (title) {
      setTasks((prevTasks) => {
        const highestId =
          prevTasks.length > 0
            ? Math.max(...prevTasks.map((task) => task.id))
            : 0;

        const newTask = {
          id: highestId + 1,
          title,
          completed: false,
        };
        return [...prevTasks, newTask];
      });

      setNewTaskTitle("");
    }
  }

  function handleDeleteTask(taskId) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === FILTERS_STATUS.completed) return task.completed;
    if (filter === FILTERS_STATUS.pending) return !task.completed;
    return true; // for "all" filter
  });

  function handleRenameTask(taskId, newTitle) {
    const title = newTitle.trim();
    if (!title) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, title } : task)),
    );
  }

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.topic}>My Tasks</Text>

            {isLoaded && (
              <View style={styles.progressContainer}>
                {/* Save status */}
                <Text
                  style={[
                    styles.count,
                    saveStatus === "error" && { color: "#B91C1C" },
                  ]}
                >
                  {saveStatus === "saving"
                    ? "Saving…"
                    : saveStatus === "saved"
                      ? "Saved on this device"
                      : saveStatus === "error"
                        ? "Could not save changes"
                        : ""}
                </Text>
                {/* Retry button */}
                {saveStatus === "error" && (
                  <Pressable
                    onPress={() => setSaveAttempt((previous) => previous + 1)}
                    accessibilityRole="button"
                    accessibilityLabel="Retry saving tasks"
                    style={({ pressed }) => ({
                      alignSelf: "flex-start",
                      minHeight: 44,
                      justifyContent: "center",
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      backgroundColor: pressed ? "#E0E7FF" : "#EEF2FF",
                    })}
                  >
                    <Text style={{ color: "#4F46E5", fontWeight: "600" }}>
                      Retry save
                    </Text>
                  </Pressable>
                )}

                {/* Progress bar */}
                <TaskProgress
                  totalCount={tasks.length}
                  completedCount={completedTasksCount}
                />
              </View>
            )}
          </View>

          {loadError ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.emptyText}>{loadError}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setLoadAttempt((previous) => previous + 1)}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Try again</Text>
              </Pressable>
            </View>
          ) : !isLoaded ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Text style={styles.emptyText}>Loading tasks...</Text>
            </View>
          ) : (
            <>
              {/* Form to add a new task */}
              <AddTaskForm
                taskTitle={newTaskTitle}
                onTaskTitleChange={setNewTaskTitle}
                onSubmit={handleAddTask}
              />

              {/* Filter Buttons */}
              <TaskFilters selectedFilter={filter} onFilterChange={setFilter} />

              {/* Task List */}
              <FlatList
                style={styles.list}
                data={filteredTasks}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TaskItem
                    task={item}
                    onToggle={handleToggle}
                    onDelete={handleDeleteTask}
                    onRename={handleRenameTask}
                  />
                )}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                      {getEmptyMessage(filter, tasks.length)}
                    </Text>
                  </View>
                }
              />
            </>
          )}

          <StatusBar style="auto" />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    width: "100%",
    paddingTop: 16,
    marginBottom: 25,
  },
  topic: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#0F172A",
  },
  count: {
    fontSize: 14,
    color: "#64748B",
  },
  list: {
    flex: 1,
    width: "100%",
  },
  emptyState: {
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  progressContainer: {
    marginTop: 8,
    gap: 10,
  },
  addButton: {
    width: "100%",
    backgroundColor: "#4F46E5",
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 24,
    padding: 14,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
