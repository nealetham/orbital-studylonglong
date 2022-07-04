import React from "react";
import {
  Text,
  View,
  TouchableHighlight,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import { globalStyles } from "../styles/global";
import AddTaskButton from "../components/AddTaskButton";
import AddTimerModal from "../components/AddTimerModal";
import DumplingSelection from "../components/ChooseDumplingModal";
import CountDown from "react-native-countdown-component";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Timer() {
  const [visibleDumplingSelection, setVisibleDumplingSelection] =
    React.useState(false);
  const [visibleAddTimer, setVisibleAddTimer] = React.useState(false);
  const [singleTimerList, setSingleTimerList] = React.useState([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [timerRunning, setTimer] = React.useState(false);
  const [timerTime, setTimerTime] = React.useState(0);
  const [countDownId, setCountDownId] = React.useState(undefined);
  const [longImage, setLongImage] = React.useState(
    require("../../assets/long-default-pau.png")
  );

  React.useEffect(() => {
    const id = new Date().getTime().toString();
    setCountDownId(id);
  }, [timerTime]);

  const toggleDumplingSelectionView = () => {
    setVisibleDumplingSelection(!visibleDumplingSelection);
  };

  const toggleAddTimerView = () => {
    setVisibleAddTimer(!visibleAddTimer);
  };

  {
    /* To toggle on start and reset event for timer */
  }
  const toggleTimer = () => {
    if (timerRunning) setTimerTime(0);
    setTimer(!timerRunning);
  };

  {
    /* Remove item from Single Timer List */
  }
  let removeItem = (title) => {
    const filteredData = singleTimerList.filter((item) => item.title !== title);
    setSingleTimerList([...filteredData]);
  };

  {
    /* Set Time from Timer */
  }
  let setTime = (minutes, seconds) => {
    if (timerTime == minutes * 60 + seconds) {
      const id = new Date().getTime().toString();
      setCountDownId(id);
    }
    setTimerTime(minutes * 60 + seconds);
    toggleTimer();
  };

  {
    /* Reload on Timer Completion */
  }
  let timerFinish = () => {
    alert("Session Over!");
    toggleTimer();
  };

  {
    /* Add Single Timer to Single Timer List */
  }
  let addToSingleTimerList = async (title, task, minutes, seconds) => {
    const singleTimer = {
      title: title,
      task: task,
      minutes: minutes,
      seconds: seconds,
    };
    setSingleTimerList([...singleTimerList, singleTimer]);
  };

  const Bao = require("../../assets/long-default-pau.png");
  const Ebi = require("../../assets/ebi-long.png");
  const Gyoza = require("../../assets/gyoza-long.png");
  const Coconut = require("../../assets/coconut-long.png");

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

  {
    /* Set Dumpling Model to the one chosen */
  }
  let setDumplingChoice = (dumpling) => {
    // alert("'" + dumpling.title + "'" + "picked!");
    setLongImage(getImage(dumpling.title));
    // console.log(dumpling.path);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={globalStyles.timerContainer}>
        <Text style={globalStyles.subHeaderText}>
          {timerRunning ? "" : "Choose the menu!"}
        </Text>

        <TouchableHighlight onPress={toggleDumplingSelectionView}>
          <Image style={globalStyles.pic} source={longImage} />
        </TouchableHighlight>

        <Text style={globalStyles.subHeaderText}>
          {timerRunning ? "Time to focus!" : "Set your focus session"}
        </Text>

        {/* Timer component */}
        <CountDown
          id={countDownId}
          size={35}
          until={timerTime}
          onFinish={timerFinish}
          digitStyle={{ backgroundColor: "#FFF" }}
          digitTxtStyle={{ color: "#000" }}
          timeLabelStyle={{ color: "red", fontWeight: "bold" }}
          separatorStyle={{ color: "#000" }}
          timeToShow={["H", "M", "S"]}
          timeLabels={{ m: null, s: null }}
          running={timerRunning}
          showSeparator
        />

        <Pressable onPress={toggleTimer} disabled={timerTime == 0}>
          <Icon
            size={60}
            name={timerRunning ? "stop-circle-outline" : "play-circle-outline"}
          />
        </Pressable>
      </View>

      {!timerRunning && (
        <View>
          {/* List of Single Timer Settings */}
          <View style={globalStyles.singleTimerList}>
            <FlatList
              data={singleTimerList}
              horizontal={true}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <View style={globalStyles.singleListItem}>
                  <Text style={globalStyles.singleTimerText}>{item.title}</Text>
                  <Pressable
                    style={globalStyles.singleTimerButton}
                    onPress={() => {
                      setTime(item.minutes, item.seconds);
                    }}
                    onLongPress={() => {
                      removeItem(item.title);
                    }}
                  >
                    <Text style={globalStyles.singleTimerTime}>
                      {String(item.minutes).padStart(2, "0") +
                        ":" +
                        String(item.seconds).padStart(2, "0")}
                    </Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      )}

      {/* AddTaskButton at botton right of
                the screen to bring up the AddTimerModal. */}
      {!timerRunning && <AddTaskButton onPress={toggleAddTimerView} />}

      {/* Modal brought up by the AddTaskButton. Allows users
                to add single timers to their single timer list */}
      <AddTimerModal
        visible={visibleAddTimer}
        toggleBottomNavigationView={toggleAddTimerView}
        onPress={addToSingleTimerList}
      />

      {/* Modal to perform dumpling selection. Allows users
                to select from a list of dumplings */}
      <DumplingSelection
        visible={visibleDumplingSelection}
        toggleBottomNavigationView={toggleDumplingSelectionView}
        onPress={setDumplingChoice}
      />
    </View>
  );
}
