import React from "react";
import { TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../styles/global";

export default function OutIconTextInput(props) {
  return (
    <View style={{ flexDirection: "row", marginLeft: 30, marginTop: 10 }}>
      <Ionicons
        name={props.iconName}
        size={22}
        color={"black"}
        style={{ paddingTop: 4 }}
      />
      <TextInput
        placeholder={props.activity}
        style={globalStyles.outIconTextInputContainer}
        value={props.toDoDescription}
        onChangeText={props.onChangeText}
        multiline={true}
      />
    </View>
  );
}
