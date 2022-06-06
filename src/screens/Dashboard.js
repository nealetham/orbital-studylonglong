import * as React from 'react';
import {  View, Text, StyleSheet, Button } from 'react-native';
import { auth } from "../firebase/index";
import { sendEmailVerification, signOut } from 'firebase/auth'
import InlineTextButton from '../components/InlineTextButton';

export default function Dashboard({ navigation, route }) {

    let logout = () => {
        signOut(auth).then(() => {
            navigation.popToTop();
        });
    }

    let showContent = () => {
        <View>
            
        </View>
    }

    let showSendVerificationEmail = () => {
        return (
            <View>
                <Text>Please verify your email.</Text>
                <Button title="Send Verification Email" onPress={ () => sendEmailVerification(auth.currentUser)} />
            </View>
        )
    }


    return (
        <View style='styles.container'>
            <View>
                <InlineTextButton text="Manage Account" />

            </View>
            {auth.currentUser.emailVerified ? showContent : showSendVerificationEmail()}
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        marginTop: 20,
    }
})