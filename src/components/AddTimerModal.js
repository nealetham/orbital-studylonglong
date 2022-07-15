import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  View,
} from "react-native";
import ActionButton from "./ActionButton";
import { BottomSheet } from "react-native-btr";
import React from "react";
import { globalStyles } from "../styles/global";
import { TimePicker } from "react-native-simple-time-picker";

export default function AddTimerModal(props) {
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
              props.onPress(minutes, seconds);
              handleReset();
              props.toggleBottomNavigationView();
            }}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}
