import { View, Text, StyleSheet } from "react-native";

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
    color: "#64748B",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 4,
  },
});
