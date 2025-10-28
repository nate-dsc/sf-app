import { useStyle } from "@/context/StyleContext"
import { Text, TouchableOpacity, View } from "react-native"

type BottomButtonProps = {
    label: string,
    onPress?: () => void,
    color?: string,
    labelColor?: string,
}

export default function BottomButton({label, onPress, color, labelColor}: BottomButtonProps) {

    const {theme, layout} = useStyle()

    return(
        <TouchableOpacity
            onPress={onPress}
            style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 8,
                marginHorizontal: 18,
                borderRadius: layout.radius.round,
                backgroundColor: color ?? theme.colors.blue
            }}
        >
            <View
                style={{
                    height: 36,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        lineHeight: 22,
                        fontSize: 17,
                        fontWeight: "500",
                        color: labelColor ?? theme.colors.white
                    }}
                >
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    )

}