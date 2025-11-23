import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE, FONT_WEIGHT } from "@/styles/Fonts"
import { Text, TouchableOpacity, View } from "react-native"

type MainActionButtonProps = {
    label: string,
    onPress?: () => void,
    color?: string,
    labelColor?: string,
}

export default function MainActionButton({label, onPress, color, labelColor}: MainActionButtonProps) {
    const {theme, layout} = useStyle()
    //distance from each side of the screen: 34

    return(
        <TouchableOpacity
            onPress={onPress}
            style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: layout.radius.round,
                minHeight: 52,
                paddingHorizontal: 20,
                paddingVertical: 6,

                backgroundColor: color ?? theme.colors.blue
            }}
        >
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontSize: FONT_SIZE.BODY,
                        fontWeight: FONT_WEIGHT.MEDIUM,
                        color: labelColor ?? theme.colors.white,
                        textAlign: "center"
                    }}
                >
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    )

}