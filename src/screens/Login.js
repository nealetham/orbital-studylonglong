import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Button } from 'react-native';
import InlineTextButton from '../components/InlineTextButton';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/index";

export default function Login({navigation}) {

    if (auth.currentUser) {
        navigation.navigate("Dashboard");
    }

    const [errorMessage, setErrorMessage] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const login = () => {
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigation.navigate("Dashboard", { user: userCredential.user });

            })
            .catch((error) => {
                setErrorMessage(error.message)
            });
        } else {
            setErrorMessage("Please enter an email and password.")
        }
    }

    return (
        <View style={styles.container}>
            <Text>{errorMessage}</Text>
            <TextInput placeholder='Email' value={email} onChangeText={setEmail}></TextInput>
            <TextInput placeholder='Password' value={password} onChangeText={setPassword}></TextInput>
            <Text>Don't have an account?<InlineTextButton text="Sign Up" onPress={() => navigation.navigate("SignUp")}/></Text>
            <Text>Forgot your Password?<InlineTextButton text="Reset" onPress={() => navigation.navigate("ResetPassword")} /></Text>
        <StatusBar style="auto" />
        <Button title="Login" onPress={login} />
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
