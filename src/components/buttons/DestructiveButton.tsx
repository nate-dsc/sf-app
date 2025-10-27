import { useStyle } from "@/context/StyleContext";
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
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
                paddingVertical: 13,
                backgroundColor: backgroundColor
            }}
        >
            <Text
                style={{
                    lineHeight: 22,
                    fontSize: 17,
                    fontWeight: "500",
                    color: labelColor
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}