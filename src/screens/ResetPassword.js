import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import InlineTextButton from "../components/InlineTextButton";
import { auth } from "../firebase/index";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { globalStyles } from "../styles/global";
import ActionButton from "../components/ActionButton";

export default function ResetPassword({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.popToTop();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>Reset Password</Text>
      <Text>{errorMessage}</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={globalStyles.textInputContainer}
      ></TextInput>
      <Text style={globalStyles.bodyText}>
        Don't have an account?{" "}
        <InlineTextButton
          text="Sign Up"
          onPress={() => navigation.navigate("SignUp")}
        />
      </Text>
      <StatusBar style="auto" />
      <ActionButton
        text="Back"
        onPress={() => navigation.goBack()}
        style={globalStyles.backButton}
      />
      <ActionButton
        text="Next"
        onPress={resetPassword}
        style={globalStyles.nextButton}
      />
    </View>
  );
}
