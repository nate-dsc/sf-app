import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Switch, SwitchProps, Text, View } from "react-native"
import { MIStyles } from "./MenuItemStyles"

type CSwitchProps = SwitchProps & {
    text: string
}

export default function CSwitch({text, ...rest}: CSwitchProps) {

    const theme = useTheme()
    const menuStyles = MIStyles(theme)

    return(
        <View style={menuStyles.switch}>
            <View style={menuStyles.textContainer}>
                <Text
                    style={[menuStyles.text, FontStyles.body]}
                >{text}</Text>
            </View>
            <View style={menuStyles.switchContainer}>
                <Switch
                    
                />
            </View>
        </View>
    )

}