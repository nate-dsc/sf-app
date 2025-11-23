import { useStyle } from "@/context/StyleContext"
import { Platform, Text, TextInput, TextInputProps, View } from "react-native"

import { FONT_SIZE } from "@/styles/Fonts"
import DoneACView from "../DoneACView"
import { GroupedComponentsProps } from "./GroupedValueInput"

type GTextInputProps = GroupedComponentsProps & TextInputProps & {
    label: string,
    acViewKey: string,
    labelFlex?: number,
    fieldFlex?: number
}

export default function GTextInput({separator, label, acViewKey, labelFlex = 1, fieldFlex = 3, ...rest}: GTextInputProps) {

    const {theme} = useStyle()

    const separatorTypes = [
        {separator: "opaque", color: theme.separator.opaque},
        {separator: "translucent", color: theme.separator.translucent},
        {separator: "vibrant", color: theme.separator.vibrant},
        {separator: "translucent", color: "transparent"}
    ]
    
    return(
        <View
            style={{
                paddingHorizontal: 16
            }}
        >
            <View 
                style={{
                    flexDirection: "row",
                    minHeight: 51,
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8
                }}
            >
                <Text 
                    style={{
                        flex: labelFlex,
                        fontSize: FONT_SIZE.BODY,
                        color: theme.text.label
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {label}
                </Text>
                <TextInput 
                    style={{
                        flex: fieldFlex,
                        fontSize: FONT_SIZE.BODY,
                        color: theme.text.label
                    }}
                    placeholderTextColor={theme.text.secondaryLabel}
                    inputAccessoryViewID={acViewKey}
                    inputMode="text"
                    placeholder="None"
                    textAlign="right"
                    {...rest}
                />
            </View>
            <View style={{height: 1, backgroundColor: separatorTypes.find(item => item.separator === separator)?.color || "transparent"}}/>

            {Platform.OS === 'ios' && (
                <DoneACView acKey={acViewKey} />
            )}
        </View>
    )
}