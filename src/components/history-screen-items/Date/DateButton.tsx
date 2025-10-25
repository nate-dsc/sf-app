import { useStyle } from "@/context/StyleContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type DateButtonProps = TouchableOpacityProps & {
    isActive: boolean
}

export default function DateButton({isActive, ...rest}: DateButtonProps) {

    const {theme} = useStyle()

    return(
        <TouchableOpacity style={{
            width: 48,
            borderRadius: 100,
            aspectRatio: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.fill.tertiary
        }}
        {...rest}
        >
            <View style={{justifyContent: "center", alignItems: "center"}}>
                <Ionicons
                    size={26}
                    name={isActive ? "calendar" : "calendar-outline"}
                    color={isActive ? theme.colors.blue : theme.text.secondaryLabel}
                />
            </View>
            
        </TouchableOpacity>
    )
}