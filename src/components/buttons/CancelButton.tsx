import { ButtonStyles } from "@/components/styles/ButtonStyles"
import { FontStyles } from "@/components/styles/FontStyles"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"

export default function CancelButton({...rest}: TouchableOpacityProps) {

    return(
        <TouchableOpacity style={ButtonStyles.cancelButton} onPress={rest.onPress}>
            <Text style={[FontStyles.mainTitle, {color: "#fff"}]}> Cancel </Text>
        </TouchableOpacity>
    )
}