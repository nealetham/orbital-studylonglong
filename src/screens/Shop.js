import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { auth, db } from "../firebase/index";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/AntDesign";

export default function Shop() {
  const [buyVisible, setBuyVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "You do not have enough coins!"
  );
  const [charPurchased, setCharPurchased] = useState("");

  const setCoins200 = async () => {
    await setDoc(doc(db, "coins", auth.currentUser.uid), {
      coins: 5000,
      available: ["Bao"],
      unavailable: ["Ebi", "Gyoza", "Coconut"],
      userId: auth.currentUser.uid,
    });
  };

  // setCoins200();

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

  const ErrorModal = (error) => {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={errorVisible}
        onRequestClose={() => changeErrorModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.taskModalUnderlay}
          activeOpacity={1}
          onPressOut={() => changeErrorModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.errorModalOverlay}>
              <Text
                style={{
                  marginTop: 30,
                  fontSize: 15,
                  textAlign: "center",
                  marginLeft: 20,
                  marginRight: 20,
                  justifyContent: "center",
                }}
              >
                {error}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  };

  const purchaseModal = (character) => {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={buyVisible}
        onRequestClose={() => changeBuyModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.taskModalUnderlay}
          activeOpacity={1}
          onPressOut={() => changeBuyModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.taskModalOverlay}>
              <View style={{ alignItems: "center" }}>
                <Image source={getImage(character)} style={styles.stretch} />
              </View>
              <Text
                style={{
                  marginTop: 30,
                  fontSize: 15,
                  textAlign: "center",
                }}
              >
                {" "}
                Congratulations!{"\n"}
                {character} has been added to your collection{" "}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  };

  const checkSufficientCoins = async () => {
    const docRef = doc(db, "coins", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    let coinsData = docSnap.data();

    if (coinsData.coins >= 100) {
      const purchaseOptions = coinsData.unavailable;
      const inventory = coinsData.available;

      if (purchaseOptions.length === 0) {
        setErrorMessage("You have collected all available characters!");
        changeErrorModalVisible(true);
      } else {
        function randomCharacter() {
          var randomIndex = Math.floor(Math.random() * purchaseOptions.length);
          return purchaseOptions.splice(randomIndex, 1)[0];
        }

        const purchasedCharacter = randomCharacter();
        setCharPurchased(purchasedCharacter);
        inventory.push(purchasedCharacter);

        await updateDoc(doc(db, "coins", auth.currentUser.uid), {
          coins: coinsData.coins - 100,
          available: inventory,
          unavailable: purchaseOptions,
        });

        changeBuyModalVisible(true);
      }
    } else {
      setErrorMessage("You do not have enough coins!");
      changeErrorModalVisible(true);
    }
  };

  const changeBuyModalVisible = (bool) => {
    setBuyVisible(bool);
  };

  const changeErrorModalVisible = (bool) => {
    setErrorVisible(bool);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Mystery Long</Text>
        <Image
          style={styles.stretch}
          source={{
            uri: "https://i.ibb.co/Z6dCZLc/Poster-3052022-59-4-84-1-cm-3.png",
          }}
        />
      </View>
      <View style={styles.inline}>
        <Text style={styles.subHeading}>Open for 100 coins?</Text>
        <TouchableOpacity
          onPress={() => checkSufficientCoins()}
          style={{ width: 40, height: 40 }}
        >
          <Icon name="checkcircleo" size={40} color="#000" />
        </TouchableOpacity>

        {purchaseModal(charPurchased)}
        {ErrorModal(errorMessage)}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  stretch: {
    width: 150,
    height: 150,
    paddingTop: 10,
    resizeMode: "contain",
  },
  heading: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 15,
    marginTop: 50,
  },
  subHeading: {
    fontSize: 20,
    textAlign: "center",
    //marginBottom: 5,
  },
  iconLayout: {
    marginTop: 110,
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  inline: {
    padding: 50,
    marginLeft: 20,
    marginTop: 120,
    height: 500,
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  taskModalUnderlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskModalOverlay: {
    height: 400,
    width: 300,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    elevation: 1.5,
    justifyContent: "center",
  },
  errorModalOverlay: {
    height: 200,
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    elevation: 1.5,
  },
});
