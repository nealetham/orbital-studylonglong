import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
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
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import ToDoItem from "../components/ToDoItem";

export default function Schedule() {
  const [toDoLoading, setToDoLoading] = React.useState(true);
  const [toDos, setToDos] = React.useState([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [monthlyMarkedDates, setMonthlyMarkedDates] = React.useState({});

  const convertMonth = (monthNumber) => {
    const date = new Date();
    date.setMonth(parseInt(monthNumber, 10) - 1);

    return date.toLocaleString("default", { month: "long" }).split(" ")[1];
  };

  let checkOffToDo = async (toDoId) => {
    const docRef = doc(db, "todos", toDoId);
    await updateDoc(docRef, {
      completed: true,
    });
  };

  let deleteToDo = async (toDoId) => {
    await deleteDoc(doc(db, "todos", toDoId));
  };

  let loadSelectedDate = async (selectedDate) => {
    // visible loading of all previous dates tasks.
    const q = query(
      collection(db, "todos"),
      where("userId", "==", auth.currentUser.uid),
      where("startDate", "==", selectedDate),
      orderBy("completed"),
      orderBy("startTime")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
    });
  };

  let renderMarkedDates = async () => {
    const q = query(
      collection(db, "todos"),
      orderBy("startDate"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let markedDates = {};
      let lastStartDate = "0";
      querySnapshot.forEach((doc) => {
        let itemData = doc.data();

        if (itemData.startDate === lastStartDate) {
          const previousMarkedDate = markedDates[itemData.startDate];
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
    });
  };

  React.useEffect(() => {
    if (toDoLoading) {
      loadSelectedDate(selectedDate);
      renderMarkedDates();
    }
  });

  return (
    <View>
      <CalendarList
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          loadSelectedDate(day.dateString);
        }}
        // themes={styles.theme}
        horizontal={true}
        pagingEnabled={true}
        markingType={"multi-dot"}
        markedDates={monthlyMarkedDates}
      />
      <View style={{ marginLeft: 15, marginRight: 15 }}>
        <Text
          style={{
            marginLeft: 5,
            marginBottom: 5,
            marginTop: 10,
            fontSize: 20,
          }}
        >
          {selectedDate.split("-")[2]}{" "}
          {convertMonth(selectedDate.split("-")[1])}{" "}
          {selectedDate.split("-")[0]}
        </Text>
        <FlatList
          style={{ height: 250 }}
          data={toDos}
          refreshing={isRefreshing}
          onRefresh={() => {
            loadSelectedDate(selectedDate);
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
    selectedDayBackgroundColor: "black",
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
    textDayFontSize: 10,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  },
});
