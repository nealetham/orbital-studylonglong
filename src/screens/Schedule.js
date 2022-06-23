import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { auth, db } from "../firebase/index";
import { CalendarList } from "react-native-calendars";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import ToDoItem from "../components/ToDoItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Schedule() {
  const [toDoLoading, setToDoLoading] = React.useState(true);
  const [toDos, setToDos] = React.useState([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [monthlyMarkedDates, setMonthlyMarkedDates] = React.useState({});

  let checkOffToDo = async (toDoId) => {
    const docRef = doc(db, "todos", toDoId);
    await updateDoc(docRef, {
      completed: true,
    });
    loadSelectedDate(new Date().toISOString().split("T")[0]);
  };

  let deleteToDo = async (toDoId) => {
    await deleteDoc(doc(db, "todos", toDoId));
    let updatedToDos = [...toDos].filter((item) => item.id != toDoId);
    setToDos(updatedToDos);
  };

  let loadSelectedDate = async (selectedDate) => {
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
      if (selectedDate === toDo.startDate) {
        toDos.push(toDo);
      }
    });

    setToDos(toDos);
    setToDoLoading(false);
    setIsRefreshing(false);
    renderMarkedDates();
  };

  let renderMarkedDates = async () => {
    const q = query(
      collection(db, "todos"),
      orderBy("completed"),
      orderBy("startTime"),
      where("userId", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    let markedDates = {};
    let lastStartDate = "0";
    querySnapshot.forEach((doc) => {
      let itemData = doc.data();

      if (itemData.startDate === lastStartDate) {
        const previousMarkedDate = markedDates[itemData.startDate];
        // const newMarkedDateDots = previousMarkedDate["dots"].push({
        //   color: itemData.color[0],
        // });
        const previousDotsArray = previousMarkedDate["dots"];
        const updatedDotsArray = [
          ...previousDotsArray,
          { color: itemData.color[0] },
        ];
        const updatedMarkedDate = {
          [itemData.startDate]: { dots: updatedDotsArray },
        };
        Object.assign(markedDates, updatedMarkedDate);
      } else {
        const newMarkedDate = {
          [itemData.startDate]: {
            dots: [{ color: itemData.color[0] }],
          },
        };
        lastStartDate = itemData.startDate;
        Object.assign(markedDates, newMarkedDate);
      }
    });
    setMonthlyMarkedDates(markedDates);
  };

  React.useEffect(() => {
    if (toDoLoading) {
      loadSelectedDate(selectedDate);
      renderMarkedDates();
    }
  });
  return (
    <View style={{ height: 330 }}>
      <CalendarList
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          loadSelectedDate(day.dateString);
        }}
        themes={styles.theme}
        horizontal={true}
        pagingEnabled={true}
        markingType={"multi-dot"}
        markedDates={monthlyMarkedDates}
      />
      <View style={{ marginLeft: 15, marginRight: 15 }}>
        <FlatList
          data={toDos}
          refreshing={isRefreshing}
          onRefresh={() => {
            loadSelectedDate(selectedDate);
            renderMarkedDates();
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
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  theme: {
    backgroundColor: "#ffffff",
    calendarBackground: "#ffffff",
    textSectionTitleColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: "#00adf5",
    selectedDayTextColor: "#ffffff",
    todayTextColor: "#00adf5",
    dayTextColor: "#2d4150",
    textDisabledColor: "#d9e1e8",
    dotColor: "#00adf5",
    selectedDotColor: "#ffffff",
    arrowColor: "orange",
    disabledArrowColor: "#d9e1e8",
    monthTextColor: "blue",
    indicatorColor: "blue",
    textDayFontFamily: "monospace",
    textMonthFontFamily: "monospace",
    textDayHeaderFontFamily: "monospace",
    textDayFontWeight: "300",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  },
});
