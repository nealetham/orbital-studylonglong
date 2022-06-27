import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import OutIconTextInput from "./OutIconTextInput";
import ActionButton from "./ActionButton";
import { BottomSheet } from "react-native-btr";
import React from "react";
import { globalStyles } from "../styles/global";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { TimePicker } from "react-native-simple-time-picker";

export default function AddTimerModal(props) {
  const [toDoTitle, setToDoTitle] = React.useState("");
  const [toDoTask, setToDoTask] = React.useState("");

  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  const handleChange = (value: { minutes: number, seconds: number }) => {
    setMinutes(value.minutes);
    setSeconds(value.seconds);
  };

  const handleReset = () => {
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <BottomSheet
      visible={props.visible}
      onBackButtonPress={props.toggleBottomNavigationView}
      onBackdropPress={props.toggleBottomNavigationView}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={globalStyles.addTimerModal}
          enabled={false}
        >
          <TextInput
            placeholder="Task Title"
            style={globalStyles.textInputContainer}
            onChangeText={setToDoTitle}
          />
          <OutIconTextInput
            iconName={"document-text-outline"}
            activity={"Add a description or comment"}
            onChangeText={setToDoTask}
          />

          <View style={globalStyles.timePickerStyle}>
            <TimePicker
              value={{ minutes, seconds }}
              onChange={handleChange}
              pickerShows={["minutes", "seconds"]}
              zeroPadding
            />
          </View>

          <ActionButton
            style={globalStyles.nextButton}
            text="Continue"
            onPress={() => {
              props.onPress(toDoTitle, toDoTask, minutes, seconds);
              setToDoTitle("");
              setToDoTask("");
              handleReset();
              props.toggleBottomNavigationView();
            }}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}
