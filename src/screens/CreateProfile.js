import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View, TextInput, Alert } from "react-native";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase/index";
import { globalStyles } from "../styles/global";
import ActionButton from "../components/ActionButton";

export default function CreateProfile({ navigation, userCreds }) {
  const [name, setName] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [validationMessage, setValidationMessage] = React.useState("");

  const validateAndSet = (value, valueToCompare, setValue) => {
    if (value !== valueToCompare) {
      setValidationMessage("Passwords do not match.");
    } else {
      setValidationMessage("");
    }

    setValue(value);
  };

  const createProfile = () => {
    if (name !== "") {
      updateProfile(auth.currentUser, {
        displayName: name,
      }).then(() => {
        navigation.navigate("Dashboard", userCreds);
      });
    } else {
      Alert.alert("Missing required fields", "Please input your name.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>Create your profile</Text>
      <Text>{validationMessage}</Text>
      <TextInput
        placeholder="Name (Required)"
        value={name}
        onChangeText={setName}
        style={globalStyles.textInputContainer}
      ></TextInput>
      <TextInput
        placeholder="Nickname"
        value={nickname}
        onChangeText={setNickname}
        style={globalStyles.textInputContainer}
      ></TextInput>
      <TextInput
        placeholder="Date of Birth"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        style={globalStyles.textInputContainer}
      ></TextInput>
      <StatusBar style="auto" />
      <ActionButton
        text="Back"
        onPress={() => navigation.goBack()}
        style={globalStyles.backButton}
      />
      <ActionButton
        text="Next"
        onPress={createProfile}
        style={globalStyles.nextButton}
      />
    </View>
  );
}
