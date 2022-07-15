import React from "react";
import {
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { auth, db } from "../firebase/index";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  setDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

export default function Settings({ navigation }) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const changeModalVisible = (bool) => {
    setIsModalVisible(bool);
  };

  let logout = () => {
    signOut(auth).then(() => {
      navigation.navigate("Login");
    });
  };

  const clearData = () => {
    const resetCollection = async () => {
      await setDoc(doc(db, "coins", auth.currentUser.uid), {
        coins: 100,
        available: ["Bao"],
        unavailable: ["Ebi", "Gyoza", "Coconut"],
        userId: auth.currentUser.uid,
      });
    };

    const deleteAllTasks = async () => {
      const q = query(
        collection(db, "todos"),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((item) => {
        const document = item.id;
        deleteDoc(doc(db, "todos", document));
        // console.log(doc.id);
      });
    };

    const resetSessions = async () => {
      const currMonth = new Date().getMonth();
      const monthArray = (month, year) => {
        const numOfDays = new Date(year, month, 0).getDate();
        return new Array(numOfDays);
      };

      const arr = monthArray(currMonth, new Date().getFullYear());
      arr.fill(0, 0, arr.length);

      await setDoc(doc(db, "sessions", auth.currentUser.uid + currMonth), {
        userId: auth.currentUser.uid,
        month: currMonth,
        totalNumberOfSessions: 0,
        totalDuration: 0,
        longestSession: 0,
        data: arr,
      });
    };

    resetCollection();
    deleteAllTasks();
    resetSessions();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(210, 210, 210, 0.8)",
          width: 150,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          margin: 15,
        }}
        onPress={logout}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "rgba(210, 210, 210, 0.8)",
          width: 150,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          margin: 15,
        }}
        onPress={() => {
          setIsModalVisible(true);
        }}
      >
        <Text>Clear Data</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => changeModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.taskModalUnderlay}
          activeOpacity={1}
          onPressOut={() => changeModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.taskModalOverlay}>
              <View style={{ margin: 20 }}>
                <Text style={{ fontSize: 16 }}>
                  The following data will be wiped from your account.
                </Text>
                <Text style={{ fontSize: 14, paddingTop: 16, marginLeft: 10 }}>
                  {"\u2B24"} Tasks
                </Text>
                <Text style={{ fontSize: 14, marginLeft: 10 }}>
                  {"\u2B24"} Records of Study Sessions
                </Text>
                <Text style={{ fontSize: 14, marginLeft: 10 }}>
                  {"\u2B24"} Coins
                </Text>
                <Text style={{ fontSize: 14, marginLeft: 10 }}>
                  {"\u2B24"} Collection of Characters
                </Text>
                <Text style={{ fontSize: 16, paddingTop: 16, color: "red" }}>
                  There is no reversing this action, click Delete to continue.
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingTop: 30,
                  }}
                >
                  <Text
                    style={{ fontSize: 18 }}
                    onPress={() => setIsModalVisible(false)}
                  >
                    Cancel
                  </Text>
                  <Text
                    style={{ fontSize: 18, color: "red" }}
                    onPress={() => {
                      clearData();
                      setIsModalVisible(false);
                    }}
                  >
                    Delete
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  taskModalUnderlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskModalOverlay: {
    height: 300,
    width: 300,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    elevation: 1.5,
  },
  cancelButton: {
    // elevation: 8,
    // backgroundColor: "#Fff0d4",
    borderRadius: 15,
    height: 34,
    width: 120,
    paddingVertical: 6,
    // position: "absolute",
  },
});
