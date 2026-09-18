import { TextInput, Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../theme.js";

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
        placeholderTextColor={colors.textMuted}
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    width: "100%",
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  addButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  addButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  addButton: {
    width: "100%",
    backgroundColor: colors.primary,
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 24,
    padding: 14,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});
