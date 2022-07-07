import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View, TextInput } from "react-native";
import InlineTextButton from "../components/InlineTextButton";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/index";
import { globalStyles } from "../styles/global";
import ActionButton from "../components/ActionButton";

export default function SignUp({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [validationMessage, setValidationMessage] = React.useState("");

  const validateAndSet = (value, valueToCompare, setValue) => {
    if (value !== valueToCompare) {
      setValidationMessage("Passwords do not match.");
    } else {
      setValidationMessage("");
    }

    setValue(value);
  };

  const signUp = () => {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          sendEmailVerification(auth.currentUser);
          navigation.navigate("CreateProfile", { user: userCredential.user });
        })
        .then(() => {
          const charCollection = {
            coins: 50,
            // char1: true,
            // char2: false,
            // char3: false,
            // char4: false,
            available: ["Bao"],
            unavailable: ["Ebi", "Gyoza", "Coconut"],
            userId: auth.currentUser.uid,
          };
          const docRef = setDoc(
            doc(db, "coins", auth.currentUser.uid),
            charCollection
          );
        })
        .catch((error) => {
          setValidationMessage(error.message);
        });
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>Create your account</Text>
      <Text>{validationMessage}</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={globalStyles.textInputContainer}
      ></TextInput>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(value) =>
          validateAndSet(value, confirmPassword, setPassword)
        }
        secureTextEntry={true}
        style={globalStyles.textInputContainer}
      ></TextInput>
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(value) =>
          validateAndSet(value, password, setConfirmPassword)
        }
        secureTextEntry={true}
        style={globalStyles.textInputContainer}
      ></TextInput>
      <Text style={globalStyles.bodyText}>
        Already have an account?{" "}
        <InlineTextButton
          text="Login"
          onPress={() => navigation.navigate("Login")}
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
        onPress={signUp}
        style={globalStyles.nextButton}
      />
    </View>
  );
}
