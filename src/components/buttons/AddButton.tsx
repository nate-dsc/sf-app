import { ButtonStyles } from "@/components/buttons/ButtonStyles";
import { useStyle } from "@/context/StyleContext";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { AppIcon } from "../AppIcon";

const router = useRouter()

type AddButtonProps = {
    size?: number,
    onPress?: () => void
}

export default function AddButton({ size=40, onPress=()=>router.navigate("/modalAdd") }: AddButtonProps) {

    const theme = useStyle()
    const buttonStyles = ButtonStyles(theme.theme)
    const iconSize = size - 2


    const buttonSize = {
        width: size,
        height: size,
        borderRadius: size/2 
    }
    
    return(
        <TouchableOpacity style={[buttonSize, buttonStyles.addButton]} onPress={onPress} >
            <AppIcon name="plus" androidName="add" size={iconSize} tintColor={"#F5F5F5"} />
        </TouchableOpacity>
    )

}