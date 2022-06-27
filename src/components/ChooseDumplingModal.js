import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import OutIconTextInput from "./OutIconTextInput";
import ActionButton from "./ActionButton";
import { BottomSheet } from "react-native-btr";
import React from "react";
import { globalStyles } from "../styles/global";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { TimePicker } from "react-native-simple-time-picker";

export default function DumplingSelection(props) {
  const [dumplingList, setDumplingList] = React.useState([
    { title: "Dumpling", path: require("../../assets/cute-dumpling.png") },
    { title: "Dumpling2", path: require("../../assets/cute-dumpling.png") },
    { title: "Dumpling3", path: require("../../assets/cute-dumpling.png") },
  ]);

  return (
    <BottomSheet
      visible={props.visible}
      onBackButtonPress={props.toggleBottomNavigationView}
      onBackdropPress={props.toggleBottomNavigationView}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView style={globalStyles.dumplingList} enabled={false}>
          <Text style={globalStyles.dumplingListText}>Pick a dumpling</Text>
          <FlatList
            data={dumplingList}
            horizontal={true}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <View style={globalStyles.dumplingItem}>
                <Pressable
                  style={globalStyles.dumplingButton}
                  onPress={() => {
                    props.onPress(item);
                    props.toggleBottomNavigationView();
                  }}
                >
                  <Image style={globalStyles.dumplingItem} source={item.path} />
                </Pressable>
                <Text style={globalStyles.dumplingText}>{item.title}</Text>
              </View>
            )}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}
