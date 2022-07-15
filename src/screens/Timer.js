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
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/index";

export default function Timer() {
  const [visibleDumplingSelection, setVisibleDumplingSelection] =
    React.useState(false);
  const [visibleAddTimer, setVisibleAddTimer] = React.useState(false);
  const [singleTimerList, setSingleTimerList] = React.useState([]);
  const [timerRunning, setTimer] = React.useState(false);
  const [timerTime, setTimerTime] = React.useState(0);
  const [countDownId, setCountDownId] = React.useState(undefined);
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const Bao = require("../../assets/long-default-pau.png");
  const Ebi = require("../../assets/ebi-long.png");
  const Gyoza = require("../../assets/gyoza-long.png");
  const Coconut = require("../../assets/coconut-long.png");
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

  const pausePlayTimer = () => {
    setTimer(!timerRunning);
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
  };

  {
    /* Reload on Timer Completion */
  }
  let timerFinish = () => {
    alert("Session Over!");
    toggleTimer();
    // store timer time in firestore here
  };

  {
    /* Add Single Timer to Single Timer List */
  }
  // let addToSingleTimerList = async (title, task, minutes, seconds) => {
  //   const singleTimer = {
  //     title: title,
  //     task: task,
  //     minutes: minutes,
  //     seconds: seconds,
  //   };
  //   setSingleTimerList([...singleTimerList, singleTimer]);
  // };

  /* Remove item from Single Timer List */
  // }
  // let removeItem = (title) => {
  //   const filteredData = singleTimerList.filter((item) => item.title !== title);
  //   setSingleTimerList([...filteredData]);
  // };

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
    setLongImage(getImage(dumpling.title));
  };

  const mediaRunning = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => {
            toggleTimer();
            recordFinishedSession(elapsedTime + 1);
          }}
          disabled={timerTime == 0}
        >
          <Icon
            size={60}
            name="stop-circle-outline"
            style={{ paddingRight: 30 }}
          />
        </Pressable>

        <Pressable onPress={pausePlayTimer} disabled={timerTime == 0}>
          <Icon size={60} name="play-pause" style={{ paddingLeft: 30 }} />
        </Pressable>
      </View>
    );
  };

  const mediaNotRunning = () => {
    return (
      <Pressable onPress={toggleTimer} disabled={timerTime == 0}>
        <Icon size={60} name="play-circle-outline" />
      </Pressable>
    );
  };

  const createMonthRecord = async (bool) => {
    const currMonth = new Date().getMonth();
    const monthArray = (month, year) => {
      const numOfDays = new Date(year, month, 0).getDate();
      return new Array(numOfDays);
    };

    const arr = monthArray(currMonth, new Date().getFullYear());
    arr.fill(0, 0, arr.length);

    if (bool) {
      await setDoc(doc(db, "sessions", auth.currentUser.uid + currMonth), {
        userId: auth.currentUser.uid,
        month: currMonth,
        totalNumberOfSessions: 0,
        totalDuration: 0,
        longestSession: 0,
        data: arr,
      });
    } else {
    }
  };

  const recordFinishedSession = async (duration) => {
    const currDate = new Date().getDate();
    const currMonth = new Date().getMonth();
    const docRef = doc(db, "sessions", auth.currentUser.uid + currMonth);

    const checkLongestSessions = (lastLongestSession) => {
      if (lastLongestSession < duration) {
        return duration;
      } else {
        return lastLongestSession;
      }
    };

    const updateData = (previousData) => {
      previousData[currDate - 1] = previousData[currDate - 1] + duration;
      return previousData;
    };

    const foo = await getDoc(docRef);
    const sessionData = foo.data();

    const docSnap = await updateDoc(docRef, {
      totalNumberOfSessions: sessionData.totalNumberOfSessions + 1,
      totalDuration: sessionData.totalDuration + duration,
      longestSession: checkLongestSessions(sessionData.longestSession),
      data: updateData(sessionData.data),
    });
  };

  React.useEffect(() => {
    const currMonth = new Date().getMonth();

    const checkRecord = async () => {
      const docRef = doc(db, "sessions", auth.currentUser.uid + currMonth);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists() || new Date().getDate() === 1) {
        createMonthRecord(true);
      } else {
      }
    };
    checkRecord();
  });

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
          onFinish={() => {
            timerFinish();
            recordFinishedSession(timerTime);
          }}
          digitStyle={{ backgroundColor: "#FFF" }}
          digitTxtStyle={{ color: "#000" }}
          timeLabelStyle={{ color: "red", fontWeight: "bold" }}
          separatorStyle={{ color: "#000" }}
          timeToShow={["H", "M", "S"]}
          timeLabels={{ m: null, s: null }}
          running={timerRunning}
          showSeparator
          onPress={() => {
            toggleAddTimerView();
          }}
          onChange={(until) => {
            setElapsedTime(until);
          }} // keeps track of duration passed
        />
        <View>{timerRunning ? mediaRunning() : mediaNotRunning()}</View>
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
      {/* {!timerRunning && <AddTaskButton onPress={toggleAddTimerView} />} */}

      {/* Modal brought up by the AddTaskButton. Allows users
                to add single timers to their single timer list */}
      <AddTimerModal
        visible={visibleAddTimer}
        toggleBottomNavigationView={toggleAddTimerView}
        onPress={setTime}
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
