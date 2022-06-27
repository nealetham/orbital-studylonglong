import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CircularProgress from "react-native-circular-progress-indicator";

export default function WeeklySummary(props) {
  {
    /* Dynamic text display based on completion rate of weekly tasks. */
  }
  const completionText = () => {
    if (props.completionRate <= 0.4) {
      return <Text>You still have quite a bit of tasks to complete!</Text>;
    } else if (props.completionRate <= 0.6) {
      return <Text>You're halfway there for the week!</Text>;
    } else if (props.completionRate < 1.0) {
      return <Text>You are almost done with your weekly tasks!</Text>;
    } else {
      return <Text>You're all done for the week!</Text>;
    }
  };

  function isDefined(rate) {
    if (typeof rate === "NaN") {
      return 100;
    } else {
      return Math.trunc(rate * 100);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ margin: 15, justifyContent: "center" }}>
        <CircularProgress
          value={
            isNaN(props.completionRate)
              ? 100
              : Math.trunc(props.completionRate * 100)
          }
          radius={70}
          duration={1000}
          valueSuffix={"%"}
          activeStrokeColor={"rgba(255, 169, 50, 0.6)"}
          activeStrokeWidth={12}
          inActiveStrokeColor={"rgba(255, 169, 50, 1)"}
          inActiveStrokeOpacity={0.2}
          inActiveStrokeWidth={12}
        />
      </View>
      <View
        style={{
          marginLeft: 0,
          justifyContent: "center",
        }}
      >
        <Text style={styles.summaryHeader}>Weekly Summary</Text>
        <Text
          style={{
            width: 170,
            marginBottom: 20,
            fontSize: 15,
          }}
        >
          {completionText()}
        </Text>
        <Text style={{ width: 170, fontSize: 15 }}>
          {props.totalCompletedTasks}/{props.totalTasks} tasks are completed.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    elevation: 1.5,
    flexDirection: "row",
  },
  percentage: {
    top: -95,
    left: 52,
    fontSize: 30,
    fontWeight: "600",
  },
  summaryHeader: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: "600",
  },
});
