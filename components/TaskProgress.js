import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme.js";

export default function TaskProgress({ totalCount, completedCount }) {
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  return (
    <>
      <Text style={styles.count}>
        {totalCount === 0
          ? "Add your first task"
          : `${completedCount} / ${totalCount} completed · ${progressPercent}%`}
      </Text>

      <View
        style={styles.progressTrack}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Task completion"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: progressPercent,
        }}
      >
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  count: {
    fontSize: 14,
    color: colors.textMuted,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});
