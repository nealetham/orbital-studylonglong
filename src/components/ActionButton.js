import { Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global";

export default function ActionButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style}>
      <Text style={globalStyles.actionButtonText}>{props.text}</Text>
    </TouchableOpacity>
  );
}
