import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing } from "../theme.js";

export default function TaskFilters({ selectedFilter, onFilterChange }) {
  return (
    <View style={styles.filters}>
      {/* All */}
      <Pressable
        onPress={() => onFilterChange("all")}
        accessibilityRole="button"
        accessibilityState={{
          selected: selectedFilter === "all",
        }}
        style={[
          styles.filterButton,
          selectedFilter === "all" && styles.filterButtonActive,
        ]}
      >
        <Text
          style={[
            styles.filterText,
            selectedFilter === "all" && styles.filterTextActive,
          ]}
        >
          All
        </Text>
      </Pressable>

      {/* Pending */}
      <Pressable
        onPress={() => onFilterChange("pending")}
        accessibilityRole="button"
        accessibilityState={{
          selected: selectedFilter === "pending",
        }}
        style={[
          styles.filterButton,
          selectedFilter === "pending" && styles.filterButtonActive,
        ]}
      >
        <Text
          style={[
            styles.filterText,
            selectedFilter === "pending" && styles.filterTextActive,
          ]}
        >
          Pending
        </Text>
      </Pressable>

      {/* Completed */}
      <Pressable
        onPress={() => onFilterChange("completed")}
        accessibilityRole="button"
        accessibilityState={{
          selected: selectedFilter === "completed",
        }}
        style={[
          styles.filterButton,
          selectedFilter === "completed" && styles.filterButtonActive,
        ]}
      >
        <Text
          style={[
            styles.filterText,
            selectedFilter === "completed" && styles.filterTextActive,
          ]}
        >
          Completed
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: colors.border,
    borderRadius: 12,
    padding: spacing.s4,
    marginBottom: spacing.s20,
  },
  filterButton: {
    flex: 1,
    minHeight: 44,
    paddingVertical: spacing.s10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: colors.surface,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
});
