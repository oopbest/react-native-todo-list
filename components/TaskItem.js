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

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 12,

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
    borderColor: "#94A3B8",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  editForm: {
    width: "100%",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
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

export default function TaskItem({ task, onToggle, onDelete, onRename }) {
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
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
            Edit task
          </Text>
          <TextInput
            value={draftTitle}
            onChangeText={setDraftTitle}
            style={{
              fontSize: 16,
              width: "100%",
              minHeight: 48,
              padding: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#4F46E5",
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
                paddingHorizontal: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#E2E8F0",
                borderRadius: 10,
              })}
            >
              <Text
                style={{
                  color: "#0F172A",
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
                paddingHorizontal: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#4F46E5",
                borderRadius: 10,
              })}
            >
              <Text
                style={{
                  color: "#ffffff",
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

          <Text
            style={{
              fontSize: 16,
              textDecorationLine: task.completed ? "line-through" : "none",
              color: task.completed ? "#64748B" : "#0F172A",
              flex: 1,
              marginHorizontal: 8,
            }}
          >
            {task.title}
          </Text>

          {/* Edit button */}
          <Pressable
            onPress={handleEdit}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${task.title}`}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: pressed ? "#E0E7FF" : "#EEF2FF",
                marginRight: 8,
              },
            ]}
          >
            <Ionicons name="pencil-outline" size={20} color="#4F46E5" />
          </Pressable>

          {/* Delete button */}
          <Pressable
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${task.title}`}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: pressed ? "#FEE2E2" : "#FEF2F2",
              },
            ]}
          >
            <Ionicons name="trash-outline" size={20} color="#B91C1C" />
          </Pressable>
        </View>
      )}
    </View>
  );
}
