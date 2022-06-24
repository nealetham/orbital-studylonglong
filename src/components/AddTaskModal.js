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

export default function AddTaskModal(props) {
  const [toDoTitle, setToDoTitle] = React.useState("");
  const [toDoDescription, setToDoDescription] = React.useState("");

  const [startDate, setStartDate] = React.useState(new Date());
  // const [endDate, setEndDate] = React.useState(new Date());

  const [startTime, setStartTime] = React.useState(new Date(Date.now()));
  const [endTime, setEndTime] = React.useState(new Date(Date.now()));

  const [showStartDate, setShowStartDate] = React.useState(false);
  // const [showEndDate, setShowEndDate] = React.useState(false);

  const [showStartTime, setShowStartTime] = React.useState(false);
  const [showEndTime, setShowEndTime] = React.useState(false);

  const [color, setColor] = React.useState([
    "rgba(255, 169, 50, 1)",
    "#Fff0d4",
  ]); // border color , background color

  const [creamPressed, setCreamPressed] = React.useState(true);
  const [greenPressed, setGreenPressed] = React.useState(false);
  const [tealPressed, setTealPressed] = React.useState(false);
  const [purplePressed, setPurplePressed] = React.useState(false);

  const onChangeStartDate = (event, selectedStartDate) => {
    setShowStartDate(false);
    setStartDate(selectedStartDate);
  };

  // const onChangeEndDate = (event, selectedEndDate) => {
  //   setShowEndDate(false);
  //   setEndDate(selectedEndDate);
  // };

  const onChangeStartTime = (event, selectedStartTime) => {
    setShowStartTime(false);
    setStartTime(selectedStartTime);
  };

  const onChangeEndTime = (event, selectedEndTime) => {
    setShowEndTime(false);
    setEndTime(selectedEndTime);
  };

  const showStartDatePicker = () => {
    setShowStartDate(true);
  };

  // const showEndDatePicker = () => {
  //   setShowEndDate(true);
  // };

  const showStartTimePicker = () => {
    setShowStartTime(true);
  };

  const showEndTimePicker = () => {
    setShowEndTime(true);
  };

  const fStartTime =
    String(startTime.getHours()).padStart(2, "0") +
    ":" +
    String(startTime.getMinutes()).padStart(2, "0");

  const fEndTime =
    String(endTime.getHours()).padStart(2, "0") +
    ":" +
    String(endTime.getMinutes()).padStart(2, "0");
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
            {/* <Text>--</Text> */}
            {/* <Text style={styles.dateTimeText} onPress={showEndDatePicker}>
              {endDate.toDateString()}
            </Text> */}
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
              {fStartTime}
            </Text>
            <Text>--</Text>
            <Text style={styles.dateTimeText} onPress={showEndTimePicker}>
              {fEndTime}
            </Text>
          </View>

          {/* COLOR PICKER */}
          <View style={styles.dateContainer}>
            <Ionicons
              name="color-palette-outline"
              size={22}
              color={"black"}
              style={{ paddingTop: 4 }}
            />
            <View style={{ flexDirection: "row" }}>
              <Pressable // Cream
                style={
                  creamPressed ? styles.creamPressed : styles.creamUnpressed
                }
                onPress={() => {
                  setCreamPressed(true);
                  setGreenPressed(false);
                  setTealPressed(false);
                  setPurplePressed(false);
                  setColor(["rgba(255, 169, 50, 1)", "#Fff0d4"]);
                }}
              />
              <Pressable // Green
                style={
                  greenPressed ? styles.greenPressed : styles.greenUnpressed
                }
                onPress={() => {
                  setGreenPressed(true);
                  setCreamPressed(false);
                  setTealPressed(false);
                  setPurplePressed(false);
                  setColor(["#3ed64e", "#baffc1"]);
                }}
              />
              <Pressable // Teal
                style={tealPressed ? styles.tealPressed : styles.tealUnpressed}
                onPress={() => {
                  setTealPressed(true);
                  setCreamPressed(false);
                  setGreenPressed(false);
                  setPurplePressed(false);
                  setColor(["#3981db", "#9cc8ff"]);
                }}
              />
              <Pressable // Purple
                style={
                  purplePressed ? styles.purplePressed : styles.purpleUnpressed
                }
                onPress={() => {
                  setPurplePressed(true);
                  setCreamPressed(false);
                  setGreenPressed(false);
                  setTealPressed(false);
                  setColor(["#c478ff", "#e8c9ff"]);
                }}
              />
            </View>
          </View>

          {showStartDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChangeStartDate}
              accentColor="orange"
            />
          )}
          {/* {showEndDate && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endDate}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChangeEndDate}
            />
          )} */}
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
              // setEndDate(new Date());
              setToDoTitle("");
              setStartTime(new Date(Date.now()));
              setEndTime(new Date(Date.now()));
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
                startDate.toISOString().split("T")[0],
                // endDate.toISOString().split("T")[0],
                startTime,
                endTime,
                new Date().toISOString().split("T")[0],
                color
              );
              setToDoTitle("");
              setToDoDescription("");
              setStartDate(new Date());
              // setEndDate(new Date());
              setStartTime(new Date(Date.now()));
              setEndTime(new Date(Date.now()));
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
  creamPressed: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#Fff0d4",
    marginLeft: 15,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255, 169, 50, 1)",
  },
  creamUnpressed: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#Fff0d4",
    marginLeft: 15,
    marginRight: 10,
  },
  greenPressed: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#baffc1",
    marginLeft: 15,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "#3ed64e",
  },
  greenUnpressed: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#baffc1",
    marginLeft: 15,
    marginRight: 10,
  },
  tealPressed: {
    height: 25,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#9cc8ff",
    marginLeft: 15,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "#3981db",
  },
  tealUnpressed: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#9cc8ff",
    marginLeft: 15,
    marginRight: 10,
  },
  purplePressed: {
    height: 25,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#e8c9ff",
    marginLeft: 15,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "#c478ff",
  },
  purpleUnpressed: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#e8c9ff",
    marginLeft: 15,
    marginRight: 10,
  },
});
