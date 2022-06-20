import React from "react";
import { Text, View, FlatList } from "react-native";
import { auth, db } from "../firebase/index";
import { globalStyles } from "../styles/global";
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

  let loadToDoList = async (todayDate) => {
    const q = query(
      collection(db, "todos"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("completed"),
      orderBy("startTime")
    );
    const querySnapshot = await getDocs(q);
    let toDos = [];
    querySnapshot.forEach((doc) => {
      let toDo = doc.data();
      toDo.id = doc.id;
      if (todayDate === toDo.startDate) {
        toDos.push(toDo);
      }
    });

    setToDos(toDos);
    setToDoLoading(false);
    setIsRefreshing(false);
  };

  React.useEffect(() => {
    if (toDoLoading) {
      loadToDoList(new Date().toISOString().split("T")[0]);
    }
  });

  let addToDo = async (
    toDoTitle,
    toDoDescription,
    toDoStartDate,
    // toDoEndDate,
    toDoStartTime,
    toDoEndTime,
    createdDate,
    toDoColor
  ) => {
    const toDoItem = {
      title: toDoTitle,
      description: toDoDescription,
      startDate: toDoStartDate,
      // endDate: toDoEndDate,
      startTime: toDoStartTime,
      endTime: toDoEndTime,
      completed: false,
      color: toDoColor,
      userId: auth.currentUser.uid,
    };
    const docRef = await addDoc(collection(db, "todos"), toDoItem);
    toDoItem.id = docRef.id;
    let updatedToDos = [...toDos];
    if (createdDate === toDoItem.startDate) {
      updatedToDos.push(toDoItem);
      setToDos(updatedToDos);
    }
    loadToDoList(createdDate);
  };

  let checkOffToDo = async (toDoId) => {
    const docRef = doc(db, "todos", toDoId);
    await updateDoc(docRef, {
      completed: true,
    });
    loadToDoList(new Date().toISOString().split("T")[0]);
  };

  let deleteToDo = async (toDoId) => {
    await deleteDoc(doc(db, "todos", toDoId));
    let updatedToDos = [...toDos].filter((item) => item.id != toDoId);
    setToDos(updatedToDos);
  };

  return (
    <View>
      <View style={globalStyles.summaryContainer}>
        <Text style={globalStyles.subHeaderText}>
          Hey {auth.currentUser.displayName}
        </Text>

        {/* Showcases a condensed weekly summary */}
        <WeeklySummary />
      </View>

      {/* Showcases all tasks added by the user. Implemented
            with FlatList. */}
      <View
        style={{
          height: 450,
          marginLeft: 15,
          marginRight: 15,
          paddingBottom: 80,
        }}
      >
        <Text style={globalStyles.subHeaderText}>
          Today's Tasks ({toDos.length})
        </Text>

        <FlatList
          data={toDos}
          refreshing={isRefreshing}
          onRefresh={() => {
            loadToDoList(new Date().toISOString().split("T")[0]);
            setIsRefreshing(true);
          }}
          renderItem={({ item }) => (
            <ToDoItem
              taskTitle={item.title}
              taskDescription={item.description}
              taskColor={item.color}
              taskStartTime={item.startTime}
              taskEndTime={item.endTime}
              taskStartDate={item.startDate}
              taskCompletion={item.completed}
              onSwipeFromRight={() => deleteToDo(item.id)}
              onSwipeFromLeft={() => checkOffToDo(item.id)}
            />
          )}
          style={{ marginTop: 10 }}
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
