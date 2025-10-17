import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { Text, TouchableOpacity, View } from "react-native"

type SRedirProps = {
    text: string,
    selectText?: string,
    onPress: () => void
}

export default function SRedir({text, selectText, onPress}: SRedirProps) {

    const {t} = useTranslation()

    const {theme} = useTheme()

    return(
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: theme.background.groupSecondaryBg,
                borderColor: theme.background.groupSecondaryBg,
                borderWidth: 1,
                borderCurve: "continuous",
                paddingHorizontal: 16,
                borderRadius: 26
            }}
        >
            <View style={{paddingVertical: 14, flex: 1}}>
                <Text
                    numberOfLines={1} ellipsizeMode="tail"
                    style={[{color: theme.text.label, textAlign: "left"}, FontStyles.body]}
                >
                    {text}
                </Text>
            </View>
            {selectText ? (
                <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                    <Text style={[{color: theme.text.label}, FontStyles.body]}>
                        {selectText}
                    </Text>
                    <Ionicons name="chevron-expand" size={18} color={theme.text.label}/>
                </View>
            ) : (
                <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                    <Text style={[{color: theme.text.secondaryLabel}, FontStyles.body]}>
                        {selectText || t("modalAdd.select")}
                    </Text>
                    <Ionicons name="chevron-expand" size={18} color={theme.text.secondaryLabel}/>
                </View>
            )}
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