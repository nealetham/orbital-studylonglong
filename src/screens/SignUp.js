import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Button } from 'react-native';
import InlineTextButton from '../components/InlineTextButton';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { auth } from "../firebase/index";

export default function SignUp({navigation}) {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [validationMessage, setValidationMessage] = React.useState('')

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
          sendEmailVerification(auth.currentUser)
          navigation.navigate("Dashboard", { user: userCredential.user });
      })
        .catch((error) => {
          setValidationMessage(error.message);
        });
      }
    }

    return (
        <View style={styles.container}>
          
          <Text>{validationMessage}</Text>
            <TextInput placeholder='Email' value={email} onChangeText={setEmail}></TextInput>
            <TextInput placeholder='Password' value={password} onChangeText={(value) => validateAndSet(value, confirmPassword, setPassword)}></TextInput>
            <TextInput placeholder='Confirm Password' value={confirmPassword} onChangeText={(value) => validateAndSet(value, password, setConfirmPassword)}></TextInput>
            <Text>Already have an account?<InlineTextButton text="Login" onPress={() => navigation.navigate("Login")}/></Text>
        <StatusBar style="auto" />
        <Button title="Sign Up" onPress={signUp} />
        </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
