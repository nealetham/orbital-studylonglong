import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/index";
import { CircularProgressBase } from "react-native-circular-progress-indicator";

export default function Summary() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [creamRatio, setCreamRatio] = React.useState({});
  const [greenRatio, setGreenRatio] = React.useState({});
  const [blueRatio, setBlueRatio] = React.useState({});
  const [purpleRatio, setPurpleRatio] = React.useState({});

  const props = {
    activeStrokeWidth: 25,
    inActiveStrokeWidth: 20,
    inActiveStrokeOpacity: 0.2,
  };

  const startOfMonth = () => {
    const date = new Date();
    date.setDate(1);
    return new Date(date).toISOString().split("T")[0];
  };

  let loadMonthlySummary = async () => {
    const q = query(
      collection(db, "todos"),
      where("userId", "==", auth.currentUser.uid),
      where("startDate", ">=", startOfMonth())
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let cream = { completed: 0, total: 0 };
      let green = { completed: 0, total: 0 };
      let blue = { completed: 0, total: 0 };
      let purple = { completed: 0, total: 0 };
      querySnapshot.forEach((doc) => {
        let task = doc.data();
        task.id = doc.id;
        if (task.color[0] === "rgba(255, 169, 50, 1)") {
          // orange color
          if (task.completed === true) {
            cream["completed"] = cream["completed"] + 1;
            cream["total"] = cream["total"] + 1;
          } else {
            cream["total"] = cream["total"] + 1;
          }
        } else if (task.color[0] === "#3ed64e") {
          // green color
          if (task.completed === true) {
            green["completed"] = green["completed"] + 1;
            green["total"] = green["total"] + 1;
          } else {
            green["total"] = green["total"] + 1;
          }
        } else if (task.color[0] === "#3981db") {
          // blue color
          if (task.completed === true) {
            blue["completed"] = blue["completed"] + 1;
            blue["total"] = blue["total"] + 1;
          } else {
            blue["total"] = blue["total"] + 1;
          }
        } else {
          if (task.completed === true) {
            purple["completed"] = purple["completed"] + 1;
            purple["total"] = purple["total"] + 1;
          } else {
            purple["total"] = purple["total"] + 1;
          }
        }
      });
      setCreamRatio(cream);
      setGreenRatio(green);
      setBlueRatio(blue);
      setPurpleRatio(purple);
    });
  };

  React.useEffect(() => {
    if (isLoading) {
      loadMonthlySummary();
      setIsLoading(false);
    }
  });

  const legend = (color, percentage) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={styles[color]}></View>
        <Text style={styles.percentageText}>
          {isNaN(Math.round(percentage)) ? 100 : Math.round(percentage)}%
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          margin: 15,
          elevation: 1.5,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 25,
          }}
        >
          <CircularProgressBase
            {...props}
            value={(creamRatio["completed"] / creamRatio["total"]) * 100}
            radius={95}
            activeStrokeColor={"rgba(255, 169, 50, 0.6)"}
            inActiveStrokeColor={"rgba(255, 169, 50, 1)"}
            inActiveStrokeOpacity={0.2}
            activeStrokeWidth={20}
            inActiveStrokeWidth={16}
          >
            <CircularProgressBase
              {...props}
              value={(greenRatio["completed"] / greenRatio["total"]) * 100}
              radius={70}
              activeStrokeColor={"#3ed64e"}
              inActiveStrokeColor={"#3ed64e"}
              inActiveStrokeOpacity={0.2}
              activeStrokeWidth={20}
              inActiveStrokeWidth={16}
            >
              <CircularProgressBase
                {...props}
                value={(blueRatio["completed"] / blueRatio["total"]) * 100}
                radius={45}
                activeStrokeColor={"#3981db"}
                inActiveStrokeColor={"#3981db"}
                activeStrokeWidth={20}
                inActiveStrokeWidth={16}
              >
                <CircularProgressBase
                  {...props}
                  value={
                    (purpleRatio["completed"] / purpleRatio["total"]) * 100
                  }
                  radius={20}
                  activeStrokeColor={"#c478ff"}
                  inActiveStrokeColor={"#c478ff"}
                  activeStrokeWidth={20}
                  inActiveStrokeWidth={16}
                />
              </CircularProgressBase>
            </CircularProgressBase>
          </CircularProgressBase>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              marginBottom: 15,
              fontWeight: "600",
              fontSize: 15,
              marginLeft: 15,
              marginRight: 15,
            }}
          >
            Monthly Completion
          </Text>
          {legend(
            "creamPressed",
            (creamRatio["completed"] / creamRatio["total"]) * 100
          )}
          {legend(
            "greenPressed",
            (greenRatio["completed"] / greenRatio["total"]) * 100
          )}
          {legend(
            "tealPressed",
            (blueRatio["completed"] / blueRatio["total"]) * 100
          )}
          {legend(
            "purplePressed",
            (purpleRatio["completed"] / purpleRatio["total"]) * 100
          )}
        </View>
      </View>
      <View style={{ flex: 1.6 }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  creamPressed: {
    height: 16,
    width: 16,
    backgroundColor: "#Fff0d4",
    marginLeft: 40,
    // marginRight: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 169, 50, 1)",
    marginBottom: 20,
  },
  greenPressed: {
    height: 16,
    width: 16,
    backgroundColor: "#baffc1",
    marginLeft: 40,
    // marginRight: 10,
    borderWidth: 1.5,
    borderColor: "#3ed64e",
    marginBottom: 20,
  },
  tealPressed: {
    height: 16,
    width: 16,
    backgroundColor: "#9cc8ff",
    marginLeft: 40,
    // marginRight: 10,
    borderWidth: 1.5,
    borderColor: "#3981db",
    marginBottom: 20,
  },
  purplePressed: {
    height: 16,
    width: 16,
    backgroundColor: "#e8c9ff",
    marginLeft: 40,
    // marginRight: 10,
    // marginLeft: -5,
    borderWidth: 1.5,
    borderColor: "#c478ff",
    marginBotom: 20,
  },
  percentageText: {
    marginLeft: 15,
    marginRight: 10,
  },
});
