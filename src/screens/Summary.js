import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/index";
// import { CircularProgressBase } from "react-native-circular-progress-indicator";
import { Rect, Text as TextSVG, Svg } from "react-native-svg";

export default function Summary() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [sessionData, setSessionData] = React.useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
  ]);
  const [totalDuration, setTotalDuration] = React.useState(0);
  const [numOfSessions, setNumOfSessions] = React.useState(0);
  const [longestSession, setLongestSession] = React.useState(0);
  const [mostProductive, setMostProductive] = React.useState();
  // [ 20, 45, 28, 80, 130, 43, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const dimWidth = Dimensions.get("window").width;
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [tooltipPos, setTooltipPos] = React.useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  const startOfMonth = () => {
    const date = new Date();
    date.setDate(1);
    return new Date(date).toISOString().split("T")[0];
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

    if (isLoading) {
      loadSummary();
      setIsLoading(false);
    }
  });

  const loadSummary = async () => {
    const currMonth = new Date().getMonth();
    const unsub = onSnapshot(
      doc(db, "sessions", auth.currentUser.uid + currMonth),
      (doc) => {
        setSessionData(doc.data().data);
        setTotalDuration(doc.data().totalDuration);
        setNumOfSessions(doc.data().totalNumberOfSessions);
        setLongestSession(doc.data().longestSession);
      }
    );
  };

  const findProductiveDay = (arrayOfDurations) => {
    const clone = [...arrayOfDurations];

    const checkIfSame = (arr) => {
      arr.sort();
      if (arr[0] === arr[arr.length - 1]) {
        return true;
      }
      return false;
    };

    const findMax = (elem) => {
      let temp = 0;
      arrayOfDurations.forEach((element) => {
        if (temp < element) {
          temp = element;
        }
      });
      return elem === temp;
    };

    if (checkIfSame(clone)) {
      return "You're equally productive everyday.";
    } else {
      return (
        arrayOfDurations.findIndex(findMax) +
        1 +
        " " +
        month[new Date().getMonth()]
      );
    }
  };

  const data = {
    labels: [
      "1",
      "5",
      "   10",
      "        15",
      "           20",
      "               25",
      "                  30",
    ],
    datasets: [
      {
        data: sessionData,
        // color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional changes outline color of line
        strokeWidth: 2, // optional
      },
    ],
  };

  const hideDataPoints = () => {
    const dataPoint = Array.from(Array(30), (e, i) => i + 1);
    const cutOffDate = new Date().getDate() - 1;
    return dataPoint.slice(cutOffDate);
  };

  function DataCard(props) {
    return (
      <View
        style={{
          width: dimWidth * 0.45,
          backgroundColor: "#FFF",
          // elevation: 1,
          height: 90,
          marginTop: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "500" }}>{props.header}</Text>
        <Text style={{ marginTop: 15, fontSize: 14 }}>{props.data}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 0.7,
          elevation: 5,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <Text style={{ paddingBottom: 15, fontSize: 18 }}>
          Productivity in {month[new Date().getMonth()]}
        </Text>
        <LineChart
          data={data}
          width={dimWidth}
          height={220}
          yAxisInterval={5}
          fromZero
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(255, 169, 50, 1)`,
            propsForBackgroundLines: {
              strokeOpacity: 0.2,
              stroke: "gray",
            },
            propsForHorizontalLabels: {
              fontSize: 14,
            },
            propsForVerticalLabels: {
              fontSize: 14,
            },
            decimalPlaces: 0,
            propsForDots: {
              r: "3.5",
            },
          }}
          style={{ marginLeft: -40 }}
          bezier
          decorator={() => {
            return tooltipPos.visible ? (
              <View>
                <Svg>
                  {/* <Rect
                    x={tooltipPos.x}
                    y={tooltipPos.y - 15}
                    width="40"
                    height="30"
                    fill="rgba(230, 230, 230, 0)"
                  /> */}
                  <TextSVG
                    x={tooltipPos.x}
                    y={tooltipPos.y - 5}
                    fill="rgba(0, 0, 0, 0.5)"
                    fontSize="15"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {tooltipPos.value + "s"}
                  </TextSVG>
                </Svg>
              </View>
            ) : null;
          }}
          onDataPointClick={(data) => {
            let isSamePoint =
              tooltipPos.x === data.x && tooltipPos.y === data.y;

            isSamePoint
              ? setTooltipPos((previousState) => {
                  return {
                    ...previousState,
                    value: data.value,
                    visible: !previousState.visible,
                  };
                })
              : setTooltipPos({
                  x: data.x,
                  value: data.value,
                  y: data.y,
                  visible: true,
                });
          }}
          hidePointsAtIndex={hideDataPoints()}
        />
      </View>
      <View
        style={{
          // marginTop: 10,
          flex: 1,
          justifyContent: "flex-start",
          backgroundColor: "rgba(248, 248, 248, 0.5)",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <DataCard
            header="Total Duration"
            data={Math.floor(totalDuration / 60) + " Minutes"}
          />
          <DataCard header="Total Number of Sessions" data={numOfSessions} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <DataCard
            header="Longest Session"
            data={Math.floor(longestSession / 60) + " Minutes"}
          />
          <DataCard
            header="Most Productive Day"
            data={findProductiveDay(sessionData)}
          />
        </View>
        {/* <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <DataCard header="Most Sessions in a Day" data="30" />
          <DataCard header="Most Productive Day" data="4 July 2022" />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <DataCard header="Longest Session" data="53 minutes" />
          <DataCard header="Shortest Session" data="13 minutes" />
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  creamPressed: {
    height: 16,
    width: 16,
    backgroundColor: "#Fff0d4",
    marginLeft: 40,
    borderWidth: 1.5,
    borderColor: "rgba(255, 169, 50, 1)",
    marginBottom: 20,
  },
  greenPressed: {
    height: 16,
    width: 16,
    backgroundColor: "#baffc1",
    marginLeft: 40,
    borderWidth: 1.5,
    borderColor: "#3ed64e",
    marginBottom: 20,
  },
  tealPressed: {
    height: 16,
    width: 16,
    backgroundColor: "#9cc8ff",
    marginLeft: 40,
    borderWidth: 1.5,
    borderColor: "#3981db",
    marginBottom: 20,
  },
  purplePressed: {
    height: 16,
    width: 16,
    backgroundColor: "#e8c9ff",
    marginLeft: 40,
    borderWidth: 1.5,
    borderColor: "#c478ff",
    marginBotom: 20,
  },
  percentageText: {
    marginLeft: 15,
    marginRight: 10,
  },
});
