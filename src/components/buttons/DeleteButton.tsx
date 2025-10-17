import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from "react-native";
import { FontStyles } from "../styles/FontStyles";

type DeleteButtonProps = TouchableOpacityProps & {
    styles?: ViewStyle
}

export default function DeleteButton({styles, ...rest}: DeleteButtonProps) {

    const {theme} = useTheme()

    return(
        <TouchableOpacity>
            <View style={[{
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
                },
                styles
            ]}>
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