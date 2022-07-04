import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { BottomSheet } from "react-native-btr";
import React from "react";
import { globalStyles } from "../styles/global";
import { auth, db } from "../firebase/index";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function DumplingSelection(props) {
  // const [dumplingList, setDumplingList] = React.useState([
  //   { title: "Dumpling", path: require("../../assets/cute-dumpling.png") },
  //   { title: "Dumpling2", path: require("../../assets/cute-dumpling.png") },
  //   { title: "Dumpling3", path: require("../../assets/cute-dumpling.png") },
  // ]);

  const [inventory, setInventory] = React.useState([]);

  React.useEffect(() => {
    listOfCharacters();
  });

  const Bao = require("../../assets/Bao.png");
  const Ebi = require("../../assets/Ebi.png");
  const Gyoza = require("../../assets/Gyoza.png");
  const Coconut = require("../../assets/Coconut.png");

  function getImage(name) {
    if (name === "Bao") {
      return Bao;
    } else if (name === "Ebi") {
      return Ebi;
    } else if (name === "Gyoza") {
      return Gyoza;
    } else {
      return Coconut;
    }
  }

  const listOfCharacters = async () => {
    const docRef = doc(db, "coins", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    let coinsData = docSnap.data();
    let charList = [];
    let inventoryData = coinsData.available;
    for (let i = 0; i < inventoryData.length; i++) {
      // const asset = "../../assets/" + inventoryData[i] + ".png";
      const item = {
        title: inventoryData[i],
        path: getImage(inventoryData[i]),
      };
      charList.push(item);
    }
    setInventory(charList);
  };

  return (
    <BottomSheet
      visible={props.visible}
      onBackButtonPress={props.toggleBottomNavigationView}
      onBackdropPress={props.toggleBottomNavigationView}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={globalStyles.dumplingModal}
          enabled={false}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={globalStyles.dumplingModalText}>Pick a dumpling</Text>
          </View>
          <FlatList
            data={inventory}
            horizontal={true}
            keyExtractor={(item) => item.title}
            style={{ marginLeft: 15, marginRight: 15 }}
            renderItem={({ item }) => (
              <View style={globalStyles.dumplingItem}>
                <Pressable
                  style={globalStyles.dumplingButton}
                  onPress={() => {
                    props.onPress(item);
                    props.toggleBottomNavigationView();
                  }}
                >
                  <Image style={globalStyles.dumplingItem} source={item.path} />
                </Pressable>
                <Text style={globalStyles.dumplingText}>{item.title}</Text>
              </View>
            )}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}
