import { Ionicons } from "@expo/vector-icons";
import { ButtonProps, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { FontStyles } from "../styles/FontStyles";
import { useTheme } from "@/context/ThemeContext";

export default function DeleteButton({...rest}: TouchableOpacityProps) {

    const {theme} = useTheme()

    return(
        <TouchableOpacity>
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                backgroundColor: "#FF4245",
                alignSelf: "stretch",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "white",
                borderCurve: "continuous",
                paddingHorizontal: 12,
                paddingTop: 10,
                paddingBottom: 9
                
            }}>
                <Ionicons size={25} name="trash-outline" color={theme.menuItem.textOverTint}/>
                <Text
                    style={[
                        FontStyles.numTitle3,
                        {color: theme.menuItem.textOverTint}
                    ]}
                >
                    Delete
                </Text>
            </View>
        </TouchableOpacity>
    )
}