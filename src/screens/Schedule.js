import React from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  Calendar,
  CalendarList,
  Agenda,
  AgendaList,
} from "react-native-calendars";

export default function Schedule() {
  const [selectedDate, setSelectedDate] = React.useState();
  return (
    <View>
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{ [selectedDate]: { selected: true, marked: true } }}
        theme={styles.calendarTheme}
        enableSwipeMonths={true}
      />
      <Agenda />
    </View>
  );
}

const styles = StyleSheet.create({
  calendarTheme: {
    backgroundColor: "#ffffff",
    calendarBackground: "#ffffff",
    textSectionTitleColor: "#b6c1cd",
    textSectionTitleDisabledColor: "#d9e1e8",
    selectedDayBackgroundColor: "#Fff0d4",
    selectedDayTextColor: "rgba(255, 169, 50, 1)",
    todayTextColor: "rgba(255, 169, 50, 1)",
    dayTextColor: "#2d4150",
    textDisabledColor: "#d9e1e8",
    dotColor: "#00adf5",
    selectedDotColor: "#ffffff",
    arrowColor: "rgba(255, 169, 50, 1)",
    disabledArrowColor: "#d9e1e8",
    monthTextColor: "black",
    indicatorColor: "black",
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
