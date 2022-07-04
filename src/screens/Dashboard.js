import "react-native-gesture-handler";
import * as React from "react";
import { View, Text } from "react-native";
import { auth, db } from "../firebase/index";
import { sendEmailVerification, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  orderBy,
  updateDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Schedule from "./Schedule";
import Home from "./Home";
import Settings from "./Settings";
import Shop from "./Shop";
import Summary from "./Summary";
import Timer from "./Timer";
import { globalStyles } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";

export default function Dashboard({ navigation, route }) {
  const [coins, setCoins] = React.useState(0);

  const Drawer = createDrawerNavigator();

  const headerOption = {
    headerTitleAlign: "center",
    headerTitle: "STUDYLONGLONG",
    headerRight: () => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginRight: 20,
        }}
      >
        <MaterialIcons name="attach-money" size={20} color="black" />
        <Text style={{ fontSize: 16 }}>{coins}</Text>
      </View>
    ),
  };

  let loadCoins = async () => {
    const unsubscribe = onSnapshot(
      doc(db, "coins", auth.currentUser.uid),
      (doc) => {
        let coinsData = doc.data();
        setCoins(coinsData.coins);
      }
    );
  };

  React.useEffect(() => {
    loadCoins();
  });

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
