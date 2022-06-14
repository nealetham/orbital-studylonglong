import React from "react";
import { Text, View, FlatList } from "react-native";
import { auth, db } from "../firebase/index";
import { globalStyles } from "../styles/global";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import AddTaskModal from "../components/AddTaskModal";
import ToDoItem from "../components/ToDoItem";
import AddTaskButton from "../components/AddTaskButton";
import WeeklySummary from "../components/WeeklySummary";

export default function Home({ navigation }) {
  const [visible, setVisible] = React.useState(false);
  const [toDoLoading, setToDoLoading] = React.useState(true);
  const [toDos, setToDos] = React.useState([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };

  let logout = () => {
    signOut(auth).then(() => {
      navigation.navigate("Login");
    });
  };

  let loadToDoList = async () => {
    const q = query(
      collection(db, "todos"),
      where("userId", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    let toDos = [];
    querySnapshot.forEach((doc) => {
      let toDo = doc.data();
      toDo.id = doc.id;
      toDos.push(toDo);
    });

    setToDos(toDos);
    setToDoLoading(false);
    setIsRefreshing(false);
  };

  React.useEffect(() => {
    if (toDoLoading) {
      loadToDoList();
    }
  });

  let addToDo = async (
    toDoTitle,
    toDoDescription,
    toDoStartDate,
    toDoEndDate,
    toDoStartTime,
    toDoEndTime
  ) => {
    const toDoItem = {
      title: toDoTitle,
      description: toDoDescription,
      startDate: toDoStartDate,
      endDate: toDoEndDate,
      startTime: toDoStartTime,
      endTime: toDoEndTime,
      completed: false,
      userId: auth.currentUser.uid,
    };
    const docRef = await addDoc(collection(db, "todos"), toDoItem);
    toDoItem.id = docRef.id;

    let updatedToDos = [...toDos];
    updatedToDos.push(toDoItem);
    setToDos(updatedToDos);
  };
  console.log(toDos);

  let checkOffToDo = async (toDoId) => {
    await deleteDoc(doc(db, "todos", toDoId));
    let updatedToDos = [...toDos].filter((item) => item.id != toDoId);
    setToDos(updatedToDos);
  };

  let deleteToDo = async (toDoId) => {
    await deleteDoc(doc(db, "todos", toDoId));
    let updatedToDos = [...toDos].filter((item) => item.id != toDoId);
    setToDos(updatedToDos);
  };

  return (
    <View style={globalStyles.containerDrawer}>
      <Text style={globalStyles.subHeaderText}>
        Hey {auth.currentUser.displayName}
      </Text>

      {/* Showcases a condensed weekly summary */}
      <WeeklySummary />

      {/* <Text onPress={logout}>Logout</Text> */}
      {/* {toDoLoading ? <ActivityIndicator size="large" /> : loadToDoList} */}

      <Text style={globalStyles.subHeaderText}>
        Today's Tasks ({toDos.length})
      </Text>

      {/* Showcases all tasks added by the user. Implemented
          with FlatList. */}
      <View
        style={{ height: 350, marginLeft: 10, marginRight: 10, paddingTop: 10 }}
      >
        <FlatList
          data={toDos}
          refreshing={isRefreshing}
          onRefresh={() => {
            loadToDoList();
            setIsRefreshing(true);
          }}
          renderItem={({ item }) => (
            <ToDoItem
              taskTitle={item.title}
              taskDescription={item.description}
              onSwipeFromRight={() => deleteToDo(item.id)}
              onSwipeFromLeft={() => checkOffToDo(item.id)}
            />
          )}
        />
      </View>

      {/* AddTaskButton at bottom right of
          the screen to bring up the AddTaskModal. */}
      <AddTaskButton onPress={toggleBottomNavigationView} />

      {/* Modal brought up by the AddTaskButton. Allows users
        to add items to their checklist. */}
      <AddTaskModal
        visible={visible}
        toggleBottomNavigationView={toggleBottomNavigationView}
        onPress={addToDo}
      />
    </View>
  );
}
