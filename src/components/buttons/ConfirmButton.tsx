import { ButtonStyles } from "@/components/styles/ButtonStyles"
import { FontStyles } from "@/components/styles/FontStyles"
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native"

export default function ConfirmButton({...rest}: TouchableOpacityProps) {

    return(
        <TouchableOpacity style={ButtonStyles.confirmButton} disabled={rest.disabled}>
            <Text style={[FontStyles.mainTitle, {color: "#fff"}]}> Confirm </Text>
        </TouchableOpacity>
    )
}