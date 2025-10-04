import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { Text, TouchableOpacity, View } from "react-native"
import { MIStyles } from "./MenuItemStyles"

type SRedirProps = {
    text: string,
    selectText?: string,
    selected?: string,
    onPress: () => void
}

export default function SRedir({text, selectText, selected, onPress}: SRedirProps) {

    const {t} = useTranslation()

    const theme = useTheme()
    const menuStyles = MIStyles(theme.theme)

    return(
        <TouchableOpacity
            onPress={onPress}
            style={menuStyles.redir}
        >
            <View style={menuStyles.textChevronContainer}>
                <View style={{flex: 1}}>
                    <Text
                        style={[menuStyles.text, FontStyles.body]}
                    >{text}</Text>
                </View>
                {selected ? (
                    <View style={{flexDirection: "row"}}>
                    <Text
                        style={[menuStyles.text, FontStyles.body]}
                    >{selected}</Text>
                    <Ionicons name="chevron-expand" size={20} color={menuStyles.icon.color}/>
                    </View>
                ) : (
                    <View style={{flexDirection: "row"}}>
                        <Text
                            style={[menuStyles.textUnfocused, FontStyles.body]}
                        >{selectText ? selectText : t("modalAdd.select")}</Text>
                        <Ionicons name="chevron-expand" size={20} color={menuStyles.iconUnfocused.color}/>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )

    /* return(
        <View style={[{flexDirection: "row", alignItems: "baseline"}, inputStyles.smallInputField]}>
            <Text
                style={[{flex: 2}, FontStyles.body]}
            >
                Description
            </Text>
            <Pressable style={{flex: 3, alignItems: "flex-end"}} onPress={rest.onPress}>
                <Text
                    style={[FontStyles.body]}
                >
                    Select
                </Text>
            </Pressable>

        </View> 
    ) */
}