import { TextInput, Pressable, Text, StyleSheet } from "react-native";

export default function AddTaskForm({
  taskTitle,
  onTaskTitleChange,
  onSubmit,
}) {
  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Enter a new task"
        placeholderTextColor="#64748B"
        value={taskTitle}
        onChangeText={onTaskTitleChange}
      />
      <Pressable
        onPress={onSubmit}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
          !taskTitle.trim() && styles.addButtonDisabled,
        ]}
        disabled={!taskTitle.trim()}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    width: "100%",
    padding: 16,
    fontSize: 16,
    color: "#0F172A",
  },
  addButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  addButtonPressed: {
    backgroundColor: "#4338CA",
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
