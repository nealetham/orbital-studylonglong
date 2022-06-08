import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Pressable,
} from "react-native";
import InlineTextButton from "../components/InlineTextButton";
import ActionButton from "../components/ActionButton";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/index";
import { AntDesign } from "@expo/vector-icons";
import { globalStyles } from "../styles/global";

export default function Login({ navigation }) {
  React.useEffect(() => {
    if (auth.currentUser) {
      navigation.navigate("Dashboard");
    }
  });

  const [errorMessage, setErrorMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const login = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigation.navigate("Dashboard", { user: userCredential.user });
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      setErrorMessage("Please enter an email and password.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>Login</Text>
      <Text>{errorMessage}</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={globalStyles.textInputContainer}
      ></TextInput>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={globalStyles.textInputContainer}
      ></TextInput>
      <Text style={globalStyles.bodyText}>
        Don't have an account?{" "}
        <InlineTextButton
          text="Sign Up"
          onPress={() => navigation.navigate("SignUp")}
        />
      </Text>
      <Text style={globalStyles.bodyText}>
        Forgot your Password?{" "}
        <InlineTextButton
          text="Reset"
          onPress={() => navigation.navigate("ResetPassword")}
        />
      </Text>
      <StatusBar style="auto" />
      <ActionButton
        onPress={login}
        text="Next"
        style={globalStyles.nextButton}
      />
    </View>
  );
}
