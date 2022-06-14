import { Text } from "react-native";
import { globalStyles } from "../styles/global";

export default function InlineTextButton(props) {
  return (
    <Text onPress={props.onPress}>
      <Text style={globalStyles.inlineTextButton}>{props.text}</Text>
    </Text>
  );
}
