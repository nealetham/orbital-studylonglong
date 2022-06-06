import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Button } from 'react-native';
import InlineTextButton from '../components/InlineTextButton';
import { auth } from "../firebase/index";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPassword({navigation}) {
    const [email, setEmail] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState('')

    const resetPassword = () => {
      sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.popToTop();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
    }

    return (
        <View style={styles.container}>
          <Text>{errorMessage}</Text>
            <TextInput placeholder='Email' value={email} onChangeText={setEmail}></TextInput>
            <Text>Don't have an account?<InlineTextButton text="Sign Up" onPress={() => navigation.navigate("SignUp")}/></Text>
        <StatusBar style="auto" />
        <Button title="Reset Password" onPress={resetPassword} />
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
