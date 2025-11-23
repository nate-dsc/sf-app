import { useStyle } from "@/context/StyleContext";
import { FONT_SIZE, FONT_WEIGHT } from "@/styles/Fonts";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type DestructiveButtonProps = TouchableOpacityProps & {
    label: string,
    onPress: () => void,
    disabled?: boolean,
    background?: "red-fill" | "tinted" | "fill"
}

export default function DestructiveButton({label, onPress, disabled = false, background = "fill"}: DestructiveButtonProps) {

    const {theme} = useStyle()

    let backgroundColor
    let labelColor

    if(disabled) {
        backgroundColor = background === "red-fill" ? theme.buttons.destructive.bgDisabledProminent : background === "tinted" ? theme.buttons.destructive.bgDisabled : theme.fill.tertiary
        labelColor = background === "red-fill" ? theme.buttons.primary.labelDisabled : theme.buttons.destructive.labelDisabled
    } else {
        backgroundColor = background === "red-fill" ? theme.colors.red : background === "tinted" ? theme.buttons.destructive.bgDisabled : theme.fill.tertiary
        labelColor = background === "red-fill" ? theme.colors.white : theme.colors.red
    }

    return(
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
                minHeight: 48,
                paddingHorizontal: 16,
                paddingVertical: 13,

                backgroundColor: backgroundColor
            }}
        >
            <Text
                style={{
                    fontSize: FONT_SIZE.BODY,
                    fontWeight: FONT_WEIGHT.MEDIUM,
                    color: labelColor
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}