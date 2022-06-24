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
  onSnapshot,
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
  const [totalWeeklyTasks, setTotalWeeklyTasks] = React.useState(0);
  const [totalCompletedWeeklyTasks, setTotalCompletedWeeklyTasks] =
    React.useState(0);
  const [completionRate, setCompletionRate] = React.useState(0);

  const toggleBottomNavigationView = () => {
    setVisible(!visible);
  };

  {
    /* Loads the tasks for the day. Utilises a listener to check
      for updates. */
  }
  let loadToDoList = async (todayDate) => {
    const q = query(
      collection(db, "todos"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("completed"),
      orderBy("startTime")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
    });
  };

  {
    /* Loads the weekly summary. Does not use a listener. Is called
      after tasks are added, checked or deleted. */
  }
  let loadWeeklySummary = async () => {
    function startOfWeek() {
      const d = new Date();
      let day = d.getDay();
      const diff = d.getDate() - day + (day == 0 ? -6 : 1);
      return new Date(d.setDate(diff)).toISOString().split("T")[0];
    }

    function endOfWeek() {
      const date = new Date();
      const today = date.getDate();
      const dayOfTheWeek = date.getDay();
      const newDate = date.setDate(today - dayOfTheWeek + 7);
      return new Date(newDate).toISOString().split("T")[0];
    }

    const q = query(
      collection(db, "todos"),
      where("userId", "==", auth.currentUser.uid),
      where("startDate", ">=", startOfWeek()),
      where("startDate", "<=", endOfWeek())
    );

    const querySnapshot = await getDocs(q);
    var totalCompleted = 0;
    var total = 0;
    querySnapshot.forEach((doc) => {
      let task = doc.data();
      if (task.completed) {
        totalCompleted = totalCompleted + 1;
        total = total + 1;
      } else {
        total++;
      }
    });
    setTotalCompletedWeeklyTasks(totalCompleted);
    setTotalWeeklyTasks(total);
    setCompletionRate(totalCompleted / total);
  };

  {
    /* Initial loading of the todo list and weekly summary. */
  }
  React.useEffect(() => {
    if (toDoLoading) {
      loadToDoList(new Date().toISOString().split("T")[0]);
      loadWeeklySummary();
    }
  });

  {
    /* Adds a document with the following fields into Firebase. */
  }
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
    loadToDoList(createdDate);
    loadWeeklySummary();
  };

  {
    /* Checks off the task as completed. Swipeable action, from left to right. */
  }
  let checkOffToDo = async (toDoId) => {
    const docRef = doc(db, "todos", toDoId);
    await updateDoc(docRef, {
      completed: true,
    });
    loadWeeklySummary();
  };

  {
    /* Deletes a task. Swipeable action, from right to left. */
  }
  let deleteToDo = async (toDoId) => {
    await deleteDoc(doc(db, "todos", toDoId));
    loadWeeklySummary();
  };

  return (
    <View>
      <View style={globalStyles.summaryContainer}>
        <Text style={globalStyles.subHeaderText}>
          Hey {auth.currentUser.displayName}
        </Text>

        {/* Showcases a condensed weekly summary */}
        <WeeklySummary
          totalTasks={totalWeeklyTasks}
          totalCompletedTasks={totalCompletedWeeklyTasks}
          completionRate={completionRate}
        />
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
          showsVerticalScrollIndicator={false}
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
