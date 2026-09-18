import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../theme.js";

export default function TaskDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Details</Text>
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
