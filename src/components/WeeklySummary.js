import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function WeeklySummary() {
  return (
    <View style={styles.container}>
      <Text>Weekly Summary</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 130,
    borderRadius: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    elevation: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
