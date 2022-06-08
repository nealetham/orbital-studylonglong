import React from "react";
import { Text, View } from "react-native";
import { auth } from "../firebase/index";
import { globalStyles } from "../styles/global";
import { signOut } from "firebase/auth";

export default function Home({ navigation }) {
  let logout = () => {
    signOut(auth).then(() => {
      navigation.navigate("Login");
    });
  };

  return (
    <View style={globalStyles.containerDrawer}>
      <Text style={globalStyles.headerText}>
        Hi {auth.currentUser.displayName}
      </Text>
      <Text onPress={logout}>Logout</Text>
    </View>
  );
}
