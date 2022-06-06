import { Text, Pressable } from 'react-native';
import { globalStyles } from '../styles/global';

export default function InlineTextButton(props) {
    return (
        <Pressable onPress={props.onPress}>
                <Text>{props.text}</Text>
        </Pressable>
    )
}