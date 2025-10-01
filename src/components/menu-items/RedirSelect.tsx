import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"
import { MIStyles } from "./MenuItemStyles"

type SRedirProps = {
    text: string,
    selected?: string,
    onPress: () => void
}

export default function SRedir({text, selected, onPress}: SRedirProps) {

    const theme = useTheme()
    const menuStyles = MIStyles(theme)

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
                            style={[menuStyles.unfocusedText, FontStyles.body]}
                        >Select</Text>
                        <Ionicons name="chevron-expand" size={20} color={menuStyles.unfocusedIcon.color}/>
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