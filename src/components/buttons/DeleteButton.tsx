import { useStyle } from "@/context/StyleContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { FontStyles } from "../styles/FontStyles";

type DeleteButtonProps = TouchableOpacityProps & {
    styles?: ViewStyle
    label?: string
}

export default function DeleteButton({styles, label, ...rest}: DeleteButtonProps) {

    const {theme} = useStyle()
    const { t } = useTranslation()

    return(
        <TouchableOpacity {...rest}>
            <View style={[{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: theme.background.group.secondaryBg,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    borderCurve: "continuous",
                    paddingHorizontal: 15,
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 32 ,
                    shadowOffset: {width: 0, height: 0}
                },
                styles
            ]}>
                <Ionicons size={20} name="trash-outline" color={theme.colors.red}/>
                <Text
                    style={[
                        FontStyles.body,
                        {paddingVertical: 10, color: theme.colors.red}
                    ]}
                >
                    {label ?? t("buttons.delete")}
                </Text>
            </View>
        </TouchableOpacity>
    )
}