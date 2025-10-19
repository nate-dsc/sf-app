import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, TextInputProps, View } from "react-native";

export default function SearchBar({...rest}: TextInputProps) {

    const {theme} = useTheme()

    return(
        <View style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: theme.fill.tertiary,
            borderRadius: 100, 
            paddingLeft: 11,
            paddingRight: 10,
            borderCurve: "continuous",
            gap: 4,
        }}>
            <Ionicons size={26} name="search-outline" color={theme.text.label}/>
            <TextInput style={{flex: 1, fontSize: 17, lineHeight: 20, fontWeight: "500", paddingVertical: 14}} placeholder="Search" placeholderTextColor={theme.text.placeholder}/>
        </View>
    )
}