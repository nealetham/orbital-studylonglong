import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { ProgressChart } from "react-native-chart-kit";

export default function WeeklySummary(props) {
  // const rebase = props.completionRate;
  const data = {
    data: [props.completionRate],
  };

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

  return (
    <View style={styles.container}>
      <View style={{ margin: 15 }}>
        <ProgressChart
          data={data}
          width={150}
          height={150}
          radius={60}
          strokeWidth={15}
          chartConfig={{
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#FFFFFF",
            color: (opacity = 1) => `rgba(255, 169, 50, ${opacity})`,
          }}
          hideLegend={true}
        />
        <Text style={{ top: -90, left: 56, fontSize: 24, fontWeight: "600" }}>
          {Math.trunc(props.completionRate * 100)}%
        </Text>
      </View>
      <View
        style={{
          marginLeft: 0,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            width: 170,
            marginBottom: 20,
            fontSize: 18,
            fontWeight: "400",
          }}
        >
          {completionText()}
        </Text>
        <Text style={{ width: 170 }}>
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
    // justifyContent: "center",
    // alignItems: "center",
    flexDirection: "row",
  },
});
