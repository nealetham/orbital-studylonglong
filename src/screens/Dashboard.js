import "react-native-gesture-handler";
import * as React from "react";
import { View, Text, LogBox } from "react-native";
import { auth } from "../firebase/index";
import { sendEmailVerification, signOut } from "firebase/auth";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Schedule from "./Schedule";
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
      <Drawer.Navigator useLegacyImplementation={true}>
        <Drawer.Screen name="Home" component={Home} options={headerOption} />
        <Drawer.Screen
          name="Schedule"
          component={Schedule}
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
