import { useState } from "react";
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
import TaskProgress from "./components/TaskProgress.js";
import TaskFilters from "./components/TaskFilters.js";
import AddTaskForm from "./components/AddTaskForm.js";
import useTasks from "./hooks/useTasks.js";
import { colors, spacing } from "./theme.js";

const FILTERS_STATUS = {
  all: "all",
  completed: "completed",
  pending: "pending",
};

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

export default function App() {
  const {
    tasks,
    isLoaded,
    loadError,
    saveStatus,
    retryLoad,
    retrySave,
    handleToggle,
    handleDeleteTask,
    handleRenameTask,
    addTask,
  } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState(FILTERS_STATUS.all);

  const pendingTasksCount = tasks.filter((task) => !task.completed).length;
  const completedTasksCount = tasks.length - pendingTasksCount;

  // Add task
  function handleAddTask() {
    const title = newTaskTitle.trim();
    if (!title) return;

    addTask(title);
    setNewTaskTitle("");
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === FILTERS_STATUS.completed) return task.completed;
    if (filter === FILTERS_STATUS.pending) return !task.completed;
    return true; // for "all" filter
  });

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
                    saveStatus === "error" && { color: colors.danger },
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
                    onPress={retrySave}
                    accessibilityRole="button"
                    accessibilityLabel="Retry saving tasks"
                    style={({ pressed }) => ({
                      alignSelf: "flex-start",
                      minHeight: 44,
                      justifyContent: "center",
                      paddingHorizontal: spacing.s12,
                      borderRadius: 8,
                      backgroundColor: pressed ? colors.primaryLightPressed : colors.primaryLight,
                    })}
                  >
                    <Text style={{ color: colors.primary, fontWeight: "600" }}>
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
                onPress={retryLoad}
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
    backgroundColor: colors.background,
    alignItems: "center",
    paddingHorizontal: spacing.s24,
  },
  header: {
    width: "100%",
    paddingTop: spacing.s16,
    marginBottom: spacing.s25,
  },
  topic: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: spacing.s4,
    color: colors.text,
  },
  count: {
    fontSize: 14,
    color: colors.textMuted,
  },
  list: {
    flex: 1,
    width: "100%",
  },
  emptyState: {
    paddingVertical: spacing.s40,
    paddingHorizontal: spacing.s16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.s12,
  },
  progressContainer: {
    marginTop: spacing.s8,
    gap: spacing.s10,
  },
  addButton: {
    width: "100%",
    backgroundColor: colors.primary,
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.s12,
    marginBottom: spacing.s24,
    padding: spacing.s14,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});
