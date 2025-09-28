import { ButtonStyles } from "@/components/styles/ButtonStyles";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

type AddButtonProps = {
    size?: number,
    onPress: () => void
}

export default function AddButton({ size=40, onPress }: AddButtonProps) {

    const buttonSize = {
        width: size,
        height: size,
        borderRadius: size/2
    }
    
    return(
        <TouchableOpacity style={[ButtonStyles.addButton, buttonSize]} onPress={onPress} >
            <Ionicons name="add" size={size} color={"#fff"}/>
        </TouchableOpacity>
    )

}