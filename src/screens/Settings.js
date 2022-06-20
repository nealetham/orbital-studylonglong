import React from "react";
import { Text, View } from "react-native";
import { auth } from "../firebase/index";
import { signOut } from "firebase/auth";

export default function Settings({ navigation }) {
  let logout = () => {
    signOut(auth).then(() => {
      navigation.navigate("Login");
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text onPress={logout}>Logout</Text>
    </View>
  );
}
