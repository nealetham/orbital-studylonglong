import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import Login from "./src/screens/Login";
import SignUp from "./src/screens/SignUp";
import CreateProfile from "./src/screens/CreateProfile";
import ResetPassword from "./src/screens/ResetPassword";
import Dashboard from "./src/screens/Dashboard";

const Stack = createStackNavigator();
const appTheme = {
  colors: {
    primary: "#FFA932",
    card: "#FFFFFF",
    background: "#FFFFFF",
  },
};

export default function App() {
  return (
    <NavigationContainer theme={appTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
