import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"

type iconName = React.ComponentProps<typeof Ionicons>["name"]

type RedirProps = {
    text: string,
    iconName?: iconName,
    onPress: () => void,
}

export default function Redir({text, iconName, onPress}: RedirProps) {

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
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                width: 50,
                height: 50,
                paddingRight: 8
            }}>
                { iconName ? (<Ionicons name={iconName} size={30} color={theme.text.label}/>) : (null)}
            </View>
            <View style={{paddingVertical: 14, flex: 1}}>
                <Text
                    numberOfLines={1} ellipsizeMode="tail"
                    style={[{color: theme.text.label, textAlign: "left"}, FontStyles.body]}
                >
                    {text}
                </Text>
            </View>
            <View>
                <Ionicons name="chevron-forward" size={18} color={theme.text.secondaryLabel}/>
            </View>
        </TouchableOpacity>
    )

}