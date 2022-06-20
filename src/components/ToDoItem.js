import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { globalStyles } from "../styles/global";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function ToDoItem(props) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const changeModalVisible = (bool) => {
    setIsModalVisible(bool);
  };

  const LeftActions = () => {
    return (
      <View style={styles.leftAction}>
        <View style={{ paddingLeft: 20 }}>
          <Ionicons name="checkmark" size={24} color="black" />
        </View>
      </View>
    );
  };

  const RightActions = () => {
    return (
      <View style={styles.rightAction}>
        <View style={{ paddingRight: 20 }}>
          <Ionicons name="trash-outline" size={24} color="black" />
        </View>
      </View>
    );
  };

  const bdrColor = props.taskColor[0];
  const bgColor = props.taskColor[1];

  const startTime = new Date(props.taskStartTime.seconds * 1000);
  const fStartTime =
    String(startTime.getHours()).padStart(2, "0") +
    ":" +
    String(startTime.getMinutes()).padStart(2, "0");

  const endTime = new Date(props.taskEndTime.seconds * 1000);
  const fEndTime =
    String(endTime.getHours()).padStart(2, "0") +
    ":" +
    String(endTime.getMinutes()).padStart(2, "0");

  return (
    <Swipeable
      renderLeftActions={LeftActions}
      onSwipeableLeftOpen={() => {
        props.onSwipeFromLeft();
      }}
      renderRightActions={RightActions}
      onSwipeableRightOpen={props.onSwipeFromRight}
      containerStyle={{ overflow: "visible" }} // container clips without this property
    >
      <Pressable
        style={styles.taskContainer}
        onPress={() => changeModalVisible(true)}
      >
        <View
          style={circleStyle(bdrColor, bgColor, props.taskCompletion)}
        ></View>
        <Text style={taskText(props.taskCompletion)} numberOfLines={1}>
          {props.taskTitle}
        </Text>
        <Text style={taskText(props.taskCompletion)}>
          {fStartTime} - {fEndTime}{" "}
        </Text>
      </Pressable>

      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => changeModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.taskModalUnderlay}
          activeOpacity={1}
          onPressOut={() => changeModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.taskModalOverlay}>
              <View style={styles.taskViewTitleContainer}>
                <View style={styles.taskCircle}></View>
                <Text style={styles.taskViewTitleText}>{props.taskTitle}</Text>
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.taskViewSubText}>
                  {props.taskStartDate}
                </Text>
                <Text style={styles.taskViewSubText}>
                  {fStartTime} - {fEndTime}{" "}
                </Text>
              </View>

              <View style={styles.taskViewDescriptionContainer}>
                <Ionicons
                  name={"document-text-outline"}
                  color={"black"}
                  size={22}
                  style={{ marginRight: 20 }}
                />
                <Text style={styles.taskViewDescriptionText}>
                  {props.taskDescription}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </Swipeable>
  );
}

function circleStyle(bdrColor, bgColor, completed) {
  const s = StyleSheet.create({
    circleCompleted: {
      height: 22,
      width: 22,
      borderRadius: 11,
      backgroundColor: bgColor,
      borderColor: bdrColor,
      borderWidth: 0,
      marginLeft: 15,
      marginRight: 15,
    },
    circleUncompleted: {
      height: 22,
      width: 22,
      borderRadius: 11,
      backgroundColor: bgColor,
      borderColor: bdrColor,
      borderWidth: 1.5,
      marginLeft: 15,
      marginRight: 15,
    },
  });

  if (completed) {
    return s.circleCompleted;
  } else {
    return s.circleUncompleted;
  }
}

function taskText(completed) {
  const t = StyleSheet.create({
    completed: {
      fontSize: 16,
      width: 200,
      color: "rgba(140, 140, 140, 0.4)",
      // textDecorationLine: "line-through",
      // textDecorationStyle: "solid",
    },
    uncompleted: {
      fontSize: 16,
      width: 200,
    },
  });

  if (completed) {
    return t.completed;
  } else {
    return t.uncompleted;
  }
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    marginRight: 1,
    marginLeft: 1,
    height: 70,
    backgroundColor: "#FFFFFF",
    elevation: 1.5,
    borderRadius: 5,
    alignItems: "center",
    borderColor: "#e8e8e8",
    borderWidth: 0.4,
  },
  leftAction: {
    backgroundColor: "#ECFFEA",
    justifyContent: "center",
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 1,
    marginRight: 1,
    height: 70,
    borderRadius: 5,
  },
  leftActionIcon: {
    marginLeft: 20,
  },
  rightAction: {
    backgroundColor: "#FFEAEA",
    justifyContent: "center",
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 1,
    marginRight: 1,
    alignItems: "flex-end",
    height: 70,
    borderRadius: 5,
  },
  rightActionIcon: {
    paddingRight: 20,
  },
  taskModalUnderlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskModalOverlay: {
    height: 400,
    width: 300,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    elevation: 1.5,
  },
  taskViewTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  taskCircle: {
    height: 16,
    width: 16,
    borderRadius: 5,
    backgroundColor: "#Fff0d4",
    borderColor: "rgba(255, 169, 50, 1)",
    borderWidth: 2,
    marginLeft: 20,
    marginRight: 20,
  },
  taskViewTitleText: {
    fontSize: 18,
  },
  taskViewSubText: {
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 56,
    marginRight: 30,
    color: "gray",
  },
  taskViewDescriptionContainer: {
    flexDirection: "row",
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  taskViewDescriptionText: {
    fontSize: 16,
    width: "80%",
  },
});
