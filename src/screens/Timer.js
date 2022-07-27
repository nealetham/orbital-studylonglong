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
import AddPresetModal from "../components/AddPresetModal";
import DumplingSelection from "../components/ChooseDumplingModal";
import CountDown from "react-native-countdown-component";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/index";
import useState from "react-usestateref";

export default function Timer() {
  const [visibleDumplingSelection, setVisibleDumplingSelection] =
    React.useState(false);
  const [visibleAddTimer, setVisibleAddTimer] = React.useState(false);
  const [visibleAddPreset, setVisibleAddPreset] = React.useState(false);
  const [singleTimerList, setSingleTimerList] = React.useState([]);
  const [multiTimerList, setMultiTimerList] = React.useState([]);
  const [timerRunning, setTimer, timerRunningRef] = useState(false);
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
  const [isMultiTimer, setIsMultiTimer, isMultiTimerRef] = useState(false);
  const [multiTimerState, setMultiTimerState, multiTimerStateRef] = useState(0);
  const [multiItem, setMultiItem, multiItemRef] = useState(null);

  const reminders = [
    "Remember to hydrate!",
    "Remember to rest your eyes!",
    "Grab a quick snack!",
    "Time to focus!",
    "Put your phone down and focus!",
  ];
  const [reminder, setReminder, reminderRef] = useState("Time to focus!");
  const intervalCycle_MS = 300000;
  React.useEffect(() => {
    const interval = setInterval(() => {
      let newReminder = reminderRef.current;
      while (newReminder == reminderRef.current) {
        newReminder = reminders[Math.floor(Math.random() * reminders.length)];
      }
      setReminder(newReminder);
    }, intervalCycle_MS);

    return () => clearInterval(interval);
  }, []);

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

  const toggleAddPresetView = () => {
    setVisibleAddPreset(!visibleAddPreset);
  };

  {
    /* To toggle on start and reset event for timer */
  }
  const toggleTimer = () => {
    if (timerRunningRef.current) setTimerTime(0);
    setTimer(!timerRunningRef.current);
  };

  // const pausePlayTimer = () => {
  //   setTimer(!timerRunningRef.current);
  // };

  {
    /* Remove item from Single Timer List */
  }
  let removeItem = (title: String) => {
    const filteredData = singleTimerList.filter((item) => item.title !== title);
    setSingleTimerList([...filteredData]);
  };

  {
    /* Remove item from Multi Timer List */
  }
  let removeMultiItem = (title: String) => {
    const filteredData = multiTimerList.filter((item) => item.title !== title);
    setMultiTimerList([...filteredData]);
  };

  {
    /* Set Time from Timer */
  }
  let setTime = (minutes, seconds) => {
    setIsMultiTimer(false);
    setMultiItem(null);
    setMultiTimerState(0);

    if (timerTime == minutes * 60 + seconds) {
      const id = new Date().getTime().toString();
      setCountDownId(id);
    }
    setTimerTime(minutes * 60 + seconds);
  };

  {
    /* Set MultiTime */
  }
  let setMultiTime = (item, running=false) => {
    // Check if initial task
    if ((multiTimerStateRef.current == 0 && multiItemRef.current == null) || multiItemRef.current != item || !running) {
      setIsMultiTimer(true);
      setMultiItem(item);
      setMultiTimerState(1);
    }

    // Check multiTimer task count versus current state
    if (multiTimerStateRef.current == 1) {
      if (timerTime == item.minutes * 60 + item.seconds) {
        const id = new Date().getTime().toString();
        setCountDownId(id);
      }
      setTimerTime(item.minutes * 60 + item.seconds);
      if (running) {
        toggleTimer();
      }
    } else if (multiTimerStateRef.current == 2 && item.task2 != null) {
      if (timerTime == item.minutes2 * 60 + item.seconds2) {
        const id = new Date().getTime().toString();
        setCountDownId(id);
      }
      setTimerTime(item.minutes2 * 60 + item.seconds2);
      if (running) {
        toggleTimer();
      }
    } else if (multiTimerStateRef.current == 3 && item.task3 != null) {
      if (timerTime == item.minutes3 * 60 + item.seconds3) {
        const id = new Date().getTime().toString();
        setCountDownId(id);
      }
      setTimerTime(item.minutes3 * 60 + item.seconds3);
      if (running) {
        toggleTimer();
      }
    } else if (multiTimerStateRef.current == 1) {
    } else {
      setIsMultiTimer(false);
      setMultiItem(null);
    }
  };

  {
    /* Choose between Single and Multi Timer Completion */
  }
  let checkFinish = () => {
    isMultiTimerRef.current ? multiTimerFinish() : timerFinish();
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
    /* MultiTimer Part Completion */
  }
  let multiTimerFinish = () => {
    alert("Segment Over!");
    toggleTimer();
    // Set next stage
    if (multiTimerStateRef.current < 3) {
        setMultiTimerState(multiTimerStateRef.current + 1);
    } else {
        setMultiTimerState(0);
    }
    // Check if has next segment
    setMultiTime(multiItemRef.current, running=true);
  };

  {
    /* Choose between Timer List to add */
  }
  let addToTimerList = async (
    title: String,
    task: String,
    minutes: int,
    seconds: int,
    task2: String,
    minutes2: int,
    seconds2: int,
    task3: String,
    minutes3: int,
    seconds3: int
  ) => {
    if (task2 == null) {
      addToSingleTimerList(title, task, minutes, seconds);
    } else {
      addToMultiTimerList(
        title,
        task,
        minutes,
        seconds,
        task2,
        minutes2,
        seconds2,
        task3,
        minutes3,
        seconds3
      );
    }
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

  {
    /* Add Multi Timer to Multi Timer List */
  }
  let addToMultiTimerList = async (
    title: String,
    task: String,
    minutes: int,
    seconds: int,
    task2: String,
    minutes2: int,
    seconds2: int,
    task3: String,
    minutes3: int,
    seconds3: int
  ) => {
    const multiTimer = {
      title: title,
      task: task,
      minutes: minutes,
      seconds: seconds,
      task2: task2,
      minutes2: minutes2,
      seconds2: seconds2,
      task3: task3,
      minutes3: minutes3,
      seconds3: seconds3,
    };
    setMultiTimerList([...multiTimerList, multiTimer]);
  };

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
            style={{ paddingRight: 0 }}
          />
        </Pressable>

        {/* <Pressable onPress={pausePlayTimer} disabled={timerTime == 0}>
          <Icon size={60} name="play-pause" style={{ paddingLeft: 30 }} />
        </Pressable> */}
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

    const numOfCoinsEarned = Math.floor(duration / 600) * 5;
    const coinRef = doc(db, "coins", auth.currentUser.uid);
    const bar = await getDoc(coinRef);
    const coinData = bar.data();

    const coinSnap = await updateDoc(coinRef, {
      coins: coinData.coins + numOfCoinsEarned,
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
          {timerRunningRef.current ? "" : "Choose the menu!"}
        </Text>

        <TouchableHighlight onPress={toggleDumplingSelectionView}>
          <Image style={globalStyles.pic} source={longImage} />
        </TouchableHighlight>

        <Text style={globalStyles.subHeaderText}>
          {timerRunningRef.current ? reminder : "Set your focus session"}
        </Text>

        {/* Timer component */}
        <CountDown
          id={countDownId}
          size={35}
          until={timerTime}
          onFinish={() => {
            checkFinish();
            recordFinishedSession(timerTime);
          }}
          digitStyle={{ backgroundColor: "#FFF" }}
          digitTxtStyle={{ color: "#000" }}
          timeLabelStyle={{ color: "red", fontWeight: "bold" }}
          separatorStyle={{ color: "#000" }}
          timeToShow={["H", "M", "S"]}
          timeLabels={{ m: null, s: null }}
          running={timerRunningRef.current}
          showSeparator
          onPress={() => {
            toggleAddTimerView();
          }}
          onChange={(until) => {
            setElapsedTime(until);
          }} // keeps track of duration passed
        />
        <View>{timerRunningRef.current ? mediaRunning() : mediaNotRunning()}</View>
      </View>

      {!timerRunningRef.current && (
        <View>
          {/* List of Multi Timer Settings */}
          <View style={globalStyles.multiTimerList}>
            <FlatList
              data={multiTimerList}
              horizontal={true}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <View style={globalStyles.multiListItem}>
                  <Text style={globalStyles.multiTimerText}>{item.title}</Text>
                  <Pressable
                    style={globalStyles.multiTimerButton}
                    onPress={() => {
                      setMultiTime(item);
                    }}
                    onLongPress={() => {
                      removeMultiItem(item.title);
                    }}
                  >
                    <Text style={globalStyles.multiTimerTime}>
                      {item.task +
                        " " +
                        String(item.minutes).padStart(2, "0") +
                        ":" +
                        String(item.seconds).padStart(2, "0")}
                    </Text>
                    <Text style={globalStyles.multiTimerTime}>
                      {item.task2 +
                        " " +
                        String(item.minutes2).padStart(2, "0") +
                        ":" +
                        String(item.seconds2).padStart(2, "0")}
                    </Text>
                    {item.task3 != null && (
                      <Text style={globalStyles.multiTimerTime}>
                        {item.task3 +
                          " " +
                          String(item.minutes3).padStart(2, "0") +
                          ":" +
                          String(item.seconds3).padStart(2, "0")}
                      </Text>
                    )}
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      )}

      {!timerRunningRef.current && (
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
      {!timerRunningRef.current && <AddTaskButton onPress={toggleAddPresetView} />}

      {/* Modal brought up by the selecting the timer. Allows users
                to set an adhoc timer */}
      <AddTimerModal
        visible={visibleAddTimer}
        toggleBottomNavigationView={toggleAddTimerView}
        onPress={setTime}
      />

      {/* Modal brought up by the AddTaskButton. Allows users
                to add single timers to their single timer list */}
      <AddPresetModal
        visible={visibleAddPreset}
        toggleBottomNavigationView={toggleAddPresetView}
        onPress={addToTimerList}
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
