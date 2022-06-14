import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddTaskButton(props) {
  return (
    <View style={{ position: "absolute", bottom: 30, right: 5 }}>
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "#Fff0d4",
          width: 40,
          height: 40,
          borderRadius: 20,
          elevation: 8,
        }}
      >
        <Ionicons
          name="add"
          size={30}
          color={"rgba(255, 169, 50, 1)"}
          backgroundColor={"white"}
          style={{ paddingRight: 0, paddingLeft: 3 }}
        />
      </TouchableOpacity>
    </View>
  );
}
