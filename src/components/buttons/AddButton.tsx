import { ButtonStyles } from "@/components/buttons/ButtonStyles";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const router = useRouter()

type AddButtonProps = {
    size?: number,
    onPress?: () => void
}

export default function AddButton({ size=40, onPress=()=>router.navigate("./modalAdd") }: AddButtonProps) {

    const theme = useTheme()
    const buttonStyles = ButtonStyles(theme.theme)
    const iconSize = size - 2


    const buttonSize = {
        width: size,
        height: size,
        borderRadius: size/2 
    }
    
    return(
        <TouchableOpacity style={[buttonSize, buttonStyles.addButton]} onPress={onPress} >
            <Ionicons name="add" size={iconSize} color={"#F5F5F5"}/>
        </TouchableOpacity>
    )

}