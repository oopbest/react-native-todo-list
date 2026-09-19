import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { colors, spacing } from "../theme";
import { useTasksContext } from "../context/TasksContext";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "TaskDetails">;

export default function TaskDetailsScreen({ route, navigation }: Props) {
  const { tasks, handleToggle, handleDeleteTask, handleRenameTask } =
    useTasksContext();
  const taskId = route.params?.taskId;
  const task = tasks.find((item) => item.id === taskId);

  function confirmDelete() {
    if (!task) return;

    Alert.alert(
      "Delete task",
      `Are you sure you want to delete this ${task.title}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            handleDeleteTask(task.id);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true },
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  function startEditing() {
    if (!task) return;

    setDraftTitle(task.title);
    setIsEditing(true);
  }
  function saveTitle() {
    if (!task || !draftTitle.trim()) return;

    handleRenameTask(task.id, draftTitle);
    setIsEditing(false);
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isEditing ? (
        <View style={styles.editForm}>
          <Text>Edit task</Text>
          <TextInput
            style={{
              width: "100%",
              borderWidth: 1,
              borderColor: colors.textMuted,
              borderRadius: 12,
              padding: spacing.s16,
              marginTop: spacing.s24,
            }}
            value={draftTitle}
            onChangeText={setDraftTitle}
          />
          <View style={styles.editActions}>
            {/* Cancel button */}
            <Pressable
              onPress={() => setIsEditing(false)}
              accessibilityRole="button"
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                minHeight: 44,
                paddingHorizontal: spacing.s16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.border,
                borderRadius: 10,
              })}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Cancel
              </Text>
            </Pressable>
            {/* Save button */}
            <Pressable
              onPress={saveTitle}
              disabled={!draftTitle.trim()}
              accessibilityRole="button"
              style={({ pressed }) => ({
                opacity: !draftTitle.trim() ? 0.35 : pressed ? 0.5 : 1,
                minHeight: 44,
                paddingHorizontal: spacing.s16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.primary,
                borderRadius: 10,
              })}
            >
              <Text style={{ color: colors.surface, fontWeight: "600" }}>
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={styles.title}>{task.title}</Text>
      )}

      <Text
        style={{
          color: colors.textMuted,
          marginTop: spacing.s12,
        }}
      >
        {task.completed ? "Completed" : "Pending"}
      </Text>

      {/* Edit */}
      {!isEditing && (
        <Pressable
          onPress={startEditing}
          accessibilityRole="button"
          style={({ pressed }) => ({
            marginTop: spacing.s24,
            minHeight: 48,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pressed
              ? colors.primaryLightPressed
              : colors.primaryLight,
          })}
        >
          <Text style={{ color: colors.primary, fontWeight: "600" }}>Edit</Text>
        </Pressable>
      )}

      {/* Toggle */}
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

      <Pressable
        onPress={confirmDelete}
        accessibilityRole="button"
        style={({ pressed }) => ({
          marginTop: spacing.s24,
          minHeight: 48,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed
            ? colors.dangerLightPressed
            : colors.dangerLight,
        })}
      >
        <Text style={{ color: colors.danger, fontWeight: "600" }}>Delete</Text>
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
  editForm: {
    width: "100%",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.s8,
    marginTop: spacing.s12,
  },
});
