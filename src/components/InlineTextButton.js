import { Text, Pressable } from 'react-native';

export default function InlineTextButton(props) {
    return (
        <Pressable onPress={props.onPress}>
                <Text>{props.text}</Text>
        </Pressable>
    )
}