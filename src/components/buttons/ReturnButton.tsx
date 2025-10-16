import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { FontStyles } from "../styles/FontStyles";
import { useTheme } from "@/context/ThemeContext";

type ReturnButtonProps = TouchableOpacityProps & {
    bgPriority: 1 | 2 | 3
}

export default function ReturnButton({bgPriority, ...rest}: ReturnButtonProps) {

    const {theme} = useTheme()
    //const background = [theme.background.groupBg, theme.background.groupSecondaryBg, theme.background.groupTertiaryBg][bgPriority -1]
    const background = theme.background.groupSecondaryBg
    //const border = [theme.background.groupTertiaryBg, theme.background.groupBg, theme.background.groupSecondaryBg][bgPriority-1]
    const border = theme.background.groupTertiaryBg

    return(
        <TouchableOpacity {...rest}>
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 6,
                backgroundColor: background,
                alignSelf: "stretch",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: border,
                borderCurve: "continuous",
                paddingHorizontal: 12,
                
            }}>
                <Ionicons size={22} name="arrow-back" color={theme.text.secondaryLabel}/>
                <Text
                    style={[
                        FontStyles.title2,
                        {paddingVertical: 9, color: theme.text.secondaryLabel}
                    ]}
                >
                    Return
                </Text>
            </View>
        </TouchableOpacity>
    )
}