import { useStyle } from "@/context/StyleContext";
import { FONT_SIZE, FONT_WEIGHT } from "@/styles/Fonts";
import { Text, TouchableOpacity } from "react-native";

type PrimaryButtonProps = {
    label: string,
    onPress: () => void,
    disabled?: boolean
}

export default function PrimaryButton({label, onPress, disabled = false}: PrimaryButtonProps) {

    const {theme} = useStyle()

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

                backgroundColor: disabled ? theme.buttons.primary.bgDisabled : theme.buttons.primary.bg
            }}
        >
            <Text
                style={{
                    fontSize: FONT_SIZE.BODY,
                    fontWeight: FONT_WEIGHT.MEDIUM,
                    color: disabled ? theme.buttons.primary.labelDisabled : theme.buttons.primary.label
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
    
}