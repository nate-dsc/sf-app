/* import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { Switch, SwitchProps, Text, View } from "react-native"
import { MIStyles } from "./MenuItemStyles"

type CSwitchProps = SwitchProps & {
    text: string
}

export default function CSwitch({text, ...rest}: CSwitchProps) {

    const theme = useStyle()
    const menuStyles = MIStyles(theme.theme)

    return(
        <View style={menuStyles.switch}>
            <View style={menuStyles.textContainer}>
                <Text
                    style={[menuStyles.text, FontStyles.body]}
                >{text}</Text>
            </View>
            <View style={menuStyles.switchContainer}>
                <Switch
                    value={rest.value}
                    onChange={rest.onChange}
                    onValueChange={rest.onValueChange}
                    disabled={rest.disabled}
                />
            </View>
        </View>
    )

} */