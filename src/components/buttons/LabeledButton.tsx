import { useStyle } from "@/context/StyleContext";
import { FONT_SIZE, FONT_WEIGHT } from "@/styles/Fonts";
import { Text, TouchableOpacity } from "react-native";

type LabeledButtonProps = {
    label: string,
    onPress: () => void,
    disabled?: boolean,
    tinted?: boolean
}

export default function LabeledButton({label, onPress, disabled = false, tinted = false}: LabeledButtonProps) {

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

                backgroundColor: theme.fill.tertiary
            }}
        >
                <Text
                    style={{
                        fontSize: FONT_SIZE.BODY,
                        fontWeight: FONT_WEIGHT.MEDIUM,
                        color: disabled ? theme.text.tertiaryLabel : tinted ? theme.colors.blue : theme.text.label
                    }}
                >
                    {label}
                </Text>
        </TouchableOpacity>
    )
    
}