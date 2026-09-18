import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { colors, spacing } from "../theme.js";

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onRename,
  onOpen,
}) {
  const [isEditting, setIsEditting] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  function confirmDelete() {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete ${task.title}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete(task.id);
          },
        },
      ],
    );
  }

  function handleEdit() {
    setIsEditting(true);
    setDraftTitle(task.title);
  }

  function handleSave() {
    if (!draftTitle.trim()) return;

    onRename(task.id, draftTitle);
    setIsEditting(false);
  }

  return (
    <View style={styles.taskItem}>
      {isEditting ? (
        <View style={styles.editForm}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              marginBottom: spacing.s8,
            }}
          >
            Edit task
          </Text>
          <TextInput
            value={draftTitle}
            onChangeText={setDraftTitle}
            style={{
              fontSize: 16,
              width: "100%",
              minHeight: 48,
              padding: spacing.s12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.primary,
            }}
          />
          <View style={styles.editActions}>
            {/* Cancel button */}
            <Pressable
              onPress={() => setIsEditting(false)}
              accessibilityRole="button"
              accessibilityLabel={
                isEditting
                  ? `Cancel editing ${task.title}`
                  : `Edit ${task.title}`
              }
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
                {isEditting ? "Cancel" : "Edit"}
              </Text>
            </Pressable>

            {/* Save button */}
            <Pressable
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel={`Save ${task.title}`}
              disabled={!draftTitle.trim()}
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
              <Text
                style={{
                  color: colors.surface,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.taskRow}>
          <Pressable
            onPress={() => onToggle(task.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.completed }}
            accessibilityLabel={task.title}
            style={styles.toggleButton}
          >
            <View
              style={[
                styles.checkbox,
                task.completed && styles.checkboxChecked,
              ]}
            >
              {task.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </Pressable>

          {/* Task title */}
          <Pressable
            onPress={() => onOpen(task.id)}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${task.title}`}
            style={{
              flex: 1,
              marginHorizontal: spacing.s8,
              minHeight: 44,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                textDecorationLine: task.completed ? "line-through" : "none",
                color: task.completed ? colors.textMuted : colors.text,
              }}
            >
              {task.title}
            </Text>
          </Pressable>

          {/* Edit button */}
          <Pressable
            onPress={handleEdit}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${task.title}`}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: pressed
                  ? colors.primaryLightPressed
                  : colors.primaryLight,
                marginRight: spacing.s8,
              },
            ]}
          >
            <Ionicons name="pencil-outline" size={20} color={colors.primary} />
          </Pressable>

          {/* Delete button */}
          <Pressable
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${task.title}`}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: pressed
                  ? colors.dangerLightPressed
                  : colors.dangerLight,
              },
            ]}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.s16,
    marginBottom: spacing.s12,

    width: "100%",
  },
  toggleButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.disabled,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700",
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
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
