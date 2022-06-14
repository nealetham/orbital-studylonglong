import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { globalStyles } from "../styles/global";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

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

export default function ToDoItem(props) {
  return (
    <Swipeable
      renderLeftActions={LeftActions}
      onSwipeableLeftOpen={props.onSwipeFromLeft}
      renderRightActions={RightActions}
      onSwipeableRightOpen={props.onSwipeFromRight}
      containerStyle={{ overflow: "visible" }} // container clips without this property
    >
      <View style={globalStyles.taskContainer}>
        <View style={globalStyles.taskCircle}></View>
        <Text style={globalStyles.taskText} numberOfLines={1}>
          {props.taskTitle} - {props.taskDescription}
        </Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  leftAction: {
    backgroundColor: "#ECFFEA",
    justifyContent: "center",
    flex: 1,
    marginTop: 7,
    marginBottom: 7,
    marginLeft: 5,
    marginRight: 5,
    height: 55,
    borderRadius: 15,
  },
  leftActionIcon: {
    marginLeft: 20,
  },
  rightAction: {
    backgroundColor: "#FFEAEA",
    justifyContent: "center",
    flex: 1,
    marginTop: 7,
    marginBottom: 7,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "flex-end",
    height: 55,
    borderRadius: 15,
  },
  rightActionIcon: {
    paddingRight: 20,
  },
});
