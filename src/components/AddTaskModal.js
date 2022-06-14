import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  View,
  Text,
  StyleSheet,
} from "react-native";
import OutIconTextInput from "./OutIconTextInput";
import ActionButton from "./ActionButton";
import { BottomSheet } from "react-native-btr";
import React from "react";
import { globalStyles } from "../styles/global";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export default function AddTaskModal(props) {
  const [toDoTitle, setToDoTitle] = React.useState("");
  const [toDoDescription, setToDoDescription] = React.useState("");

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const [startTime, setStartTime] = React.useState(new Date(Date.now()));
  const [endTime, setEndTime] = React.useState(new Date(Date.now()));

  const [showStartDate, setShowStartDate] = React.useState(false);
  const [showEndDate, setShowEndDate] = React.useState(false);

  const [showStartTime, setShowStartTime] = React.useState(false);
  const [showEndTime, setShowEndTime] = React.useState(false);

  const onChangeStartDate = (event, selectedStartDate) => {
    setStartDate(selectedStartDate);
    setShowStartDate(false);
  };

  const onChangeEndDate = (event, selectedEndDate) => {
    setEndDate(selectedEndDate);
    setShowEndDate(false);
  };

  const onChangeStartTime = (event, selectedStartTime) => {
    setStartTime(selectedStartTime);
    setShowStartTime(false);
  };

  const onChangeEndTime = (event, selectedEndTime) => {
    setEndTime(selectedEndTime);
    setShowEndTime(false);
  };

  const showStartDatePicker = () => {
    setShowStartDate(true);
  };

  const showEndDatePicker = () => {
    setShowEndDate(true);
  };

  const showStartTimePicker = () => {
    setShowStartTime(true);
  };

  const showEndTimePicker = () => {
    setShowEndTime(true);
  };

  return (
    <BottomSheet
      visible={props.visible}
      onBackButtonPress={props.toggleBottomNavigationView}
      onBackdropPress={props.toggleBottomNavigationView}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={globalStyles.addTaskBottomSheet}
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
            onChangeText={setToDoDescription}
          />
          {/* DATE CONTAINER */}
          <View style={styles.dateContainer}>
            <Ionicons
              name="ios-calendar-sharp"
              size={22}
              color={"black"}
              style={{ paddingTop: 4 }}
            />
            <Text style={styles.dateTimeText} onPress={showStartDatePicker}>
              {startDate.toDateString()}
            </Text>
            <Text>--</Text>
            <Text style={styles.dateTimeText} onPress={showEndDatePicker}>
              {endDate.toDateString()}
            </Text>
          </View>
          {/* TIME CONTAINER */}
          <View style={styles.dateContainer}>
            <Ionicons
              name="time-outline"
              size={22}
              color={"black"}
              style={{ paddingTop: 4 }}
            />
            <Text style={styles.dateTimeText} onPress={showStartTimePicker}>
              {startTime.toLocaleTimeString("en-US")}
            </Text>
            <Text>--</Text>
            <Text style={styles.dateTimeText} onPress={showEndTimePicker}>
              {endTime.toLocaleTimeString("en-US")}
            </Text>
          </View>

          {showStartDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChangeStartDate}
            />
          )}
          {showEndDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endDate}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChangeEndDate}
            />
          )}
          {showStartTime && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startTime}
              mode={"time"}
              is24Hour={true}
              display="default"
              onChange={onChangeStartTime}
            />
          )}
          {showEndTime && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endTime}
              mode={"time"}
              is24Hour={true}
              display="default"
              onChange={onChangeEndTime}
            />
          )}
          <ActionButton
            style={globalStyles.backButton}
            text="Cancel"
            onPress={() => {
              setStartDate(new Date());
              setEndDate(new Date());
              props.toggleBottomNavigationView();
            }}
          />
          <ActionButton
            style={globalStyles.nextButton}
            text="Save"
            onPress={() => {
              props.onPress(
                toDoTitle,
                toDoDescription,
                startDate,
                endDate,
                startTime,
                endTime
              );
              setToDoTitle("");
              setToDoDescription("");
              setStartDate(new Date());
              setEndDate(new Date());
              props.toggleBottomNavigationView();
            }}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  dateTimeText: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 3,
  },
});
