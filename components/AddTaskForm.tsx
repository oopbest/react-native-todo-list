import { TextInput, Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
interface AddTaskFormProps {
  taskTitle: string;
  onTaskTitleChange: (text: string) => void;
  onSubmit: () => void;
}

export default function AddTaskForm({
  taskTitle,
  onTaskTitleChange,
  onSubmit,
}: AddTaskFormProps) {
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
    padding: spacing.s16,
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
