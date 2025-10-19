import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";

export default function FilterButton({...rest}: TouchableOpacityProps) {

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
                <Ionicons size={26} name="funnel-outline" color={theme.text.label}/>
            </View>
            
        </TouchableOpacity>
    )
}