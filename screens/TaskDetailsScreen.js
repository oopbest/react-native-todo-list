import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing } from "../theme.js";
import { useTasksContext } from "../context/TasksContext.js";

export default function TaskDetailsScreen({ route }) {
  const { tasks, handleToggle } = useTasksContext();
  const taskId = route.params?.taskId;
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text
        style={{
          color: colors.textMuted,
          marginTop: spacing.s12,
        }}
      >
        {task.completed ? "Completed" : "Pending"}
      </Text>
      <Pressable
        onPress={() => handleToggle(task.id)}
        accessibilityRole="button"
        style={({ pressed }) => ({
          marginTop: spacing.s24,
          minHeight: 48,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed ? colors.primaryPressed : colors.primary,
        })}
      >
        <Text style={{ color: colors.surface, fontWeight: "600" }}>
          {task.completed ? "Mark as pending" : "Mark as completed"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.s24,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "600",
  },
});
