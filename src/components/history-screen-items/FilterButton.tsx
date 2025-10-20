import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type FilterButtonProps = TouchableOpacityProps & {
    isActive: boolean
}

export default function FilterButton({isActive, ...rest}: FilterButtonProps) {

    const {theme} = useTheme()

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
            <View style={{position: "absolute", top: 13, left: 11, right: 12}}>
                <Ionicons size={26} name={isActive ? "funnel" : "funnel-outline"} color={isActive ? theme.colors.blue : theme.text.label}/>
            </View>
            
        </TouchableOpacity>
    )
}