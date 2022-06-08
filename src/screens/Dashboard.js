import "react-native-gesture-handler";
import * as React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../firebase/index";
import { sendEmailVerification, signOut } from "firebase/auth";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DefaultTheme } from "@react-navigation/native";
import Calendar from "./Calendar";
import Home from "./Home";
import Settings from "./Settings";
import Shop from "./Shop";
import Summary from "./Summary";
import Timer from "./Timer";
import { globalStyles } from "../styles/global";

export default function Dashboard({ navigation, route }) {
  const Drawer = createDrawerNavigator();

  const headerOption = {
    headerTitleAlign: "center",
    headerTitle: "STUDYLONGLONG",
  };

  let showContent = () => {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Home} options={headerOption} />
        <Drawer.Screen
          name="Calendar"
          component={Calendar}
          options={headerOption}
        />
        <Drawer.Screen name="Timer" component={Timer} options={headerOption} />
        <Drawer.Screen
          name="Summary"
          component={Summary}
          options={headerOption}
        />
        <Drawer.Screen name="Shop" component={Shop} options={headerOption} />
        <Drawer.Screen
          name="Settings"
          component={Settings}
          options={headerOption}
        />
      </Drawer.Navigator>
    );
  };

  let showSendVerificationEmail = () => {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.bodyText}>Please verify your email.</Text>
        <Text
          style={globalStyles.inlineTextButton}
          onPress={() => sendEmailVerification(auth.currentUser)}
        >
          Send Verification Email.
        </Text>
      </View>
    );
  };

  return showContent();
  // auth.currentUser.emailVerified ? showContent() : showSendVerificationEmail()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

{
  /* <View style={globalStyles.container}>
<View>
    <InlineTextButton text="Manage Account" />

</View>
{auth.currentUser.emailVerified ? showContent : showSendVerificationEmail()}
</View> */
}
