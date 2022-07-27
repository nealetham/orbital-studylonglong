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
import { TimePicker } from 'react-native-simple-time-picker';

export default function AddMultiTimerModal(props) {
    const [toDoTitle, setToDoTitle] = React.useState("");
    const [toDoTask, setToDoTask] = React.useState("");

    const [minutes, setMinutes] = React.useState(0);
    const [seconds, setSeconds] = React.useState(0);

    const [toDoTask2, setToDoTask2] = React.useState(null);
    const [minutes2, setMinutes2] = React.useState(0);
    const [seconds2, setSeconds2] = React.useState(0);

    const [toDoTask3, setToDoTask3] = React.useState(null);
    const [minutes3, setMinutes3] = React.useState(0);
    const [seconds3, setSeconds3] = React.useState(0);

    const handleChange = (value: { minutes: number, seconds: number }) => {
        setMinutes(value.minutes);
        setSeconds(value.seconds);
    };

    const handleChange2 = (value: { minutes: number, seconds: number }) => {
        setMinutes2(value.minutes);
        setSeconds2(value.seconds);
    };

    const handleChange3 = (value: { minutes: number, seconds: number }) => {
        setMinutes3(value.minutes);
        setSeconds3(value.seconds);
    };

    const handleReset = () => {
        setMinutes(0);
        setSeconds(0);
        setMinutes2(0);
        setSeconds2(0);
        setMinutes3(0);
        setSeconds3(0);
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
                            value={{ minutes: minutes, seconds: seconds }}
                            onChange={handleChange}
                            pickerShows={["minutes", "seconds"]}
                            zeroPadding
                        />
                    </View>
                    <OutIconTextInput
                        iconName={"document-text-outline"}
                        activity={"Add a description or comment"}
                        onChangeText={setToDoTask2}
                    />
                    <View style={globalStyles.timePickerStyle}>
                        <TimePicker
                            value={{ minutes: minutes2, seconds: seconds2 }}
                            onChange={handleChange2}
                            pickerShows={["minutes", "seconds"]}
                            zeroPadding
                        />
                    </View>
                    <OutIconTextInput
                        iconName={"document-text-outline"}
                        activity={"Add a description or comment"}
                        onChangeText={setToDoTask3}
                    />
                    <View style={globalStyles.timePickerStyle}>
                        <TimePicker
                            value={{ minutes: minutes3, seconds: seconds3 }}
                            onChange={handleChange3}
                            pickerShows={["minutes", "seconds"]}
                            zeroPadding
                        />
                    </View>

                    <ActionButton
                        style={globalStyles.nextButton}
                        text="Continue"
                        onPress={() => {
                            props.onPress(
                                toDoTitle,
                                toDoTask,
                                minutes,
                                seconds,
                                toDoTask2,
                                minutes2,
                                seconds2,
                                toDoTask3,
                                minutes3,
                                seconds3
                            );
                            setToDoTitle(null);
                            setToDoTask(null);
                            setToDoTask2(null);
                            setToDoTask3(null);
                            handleReset();
                            props.toggleBottomNavigationView();
                        }}
                    />
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </BottomSheet>
    );
}