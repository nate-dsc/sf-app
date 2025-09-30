import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"
import { MIStyles } from "./MenuItemStyles"

type iconName = React.ComponentProps<typeof Ionicons>["name"]

type RedirProps = {
    text: string,
    iconName: iconName,
    onPress: () => void,
}

export default function Redir({text, iconName, onPress}: RedirProps) {

    const theme = useTheme()
    const menuStyles = MIStyles(theme)

    return(
        <TouchableOpacity
            onPress={onPress}
            style={menuStyles.redir}
        >
            <View style={menuStyles.leftContainer}>
                <Ionicons name={iconName} size={35} color={menuStyles.icon.color}/>
            </View>
            <View style={menuStyles.textChevronContainer}>
                <View style={{flex: 1}}>
                    <Text
                        style={[menuStyles.text, FontStyles.body]}
                    >{text}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={menuStyles.icon.color}/>
            </View>
        </TouchableOpacity>
    )

}