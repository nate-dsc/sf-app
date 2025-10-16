import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
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
                backgroundColor: theme.background.groupSecondaryBg,
                alignSelf: "stretch",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: theme.background.groupTertiaryBg,
                borderCurve: "continuous",
                paddingHorizontal: 12,
                
            }}>
                <Ionicons size={22} name="trash-outline" color={theme.colors.red}/>
                <Text
                    style={[
                        FontStyles.title2,
                        {paddingVertical: 9, color: theme.colors.red}
                    ]}
                >
                    Delete
                </Text>
            </View>
        </TouchableOpacity>
    )
}