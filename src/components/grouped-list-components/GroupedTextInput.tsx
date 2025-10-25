import { useStyle } from "@/context/StyleContext"
import { Platform, Text, TextInput, TextInputProps, View } from "react-native"

import DoneACView from "../DoneACView"
import { GroupedComponentsProps } from "./GroupedValueInput"

type GTextInputProps = GroupedComponentsProps & TextInputProps & {
    label: string,
    acViewKey: string,
}

export default function GTextInput({separator, label, acViewKey, ...rest}: GTextInputProps) {

    const {theme, layout} = useStyle()

    const separatorTypes = [
        {separator: "opaque", color: theme.separator.opaque},
        {separator: "translucent", color: theme.separator.translucent},
        {separator: "vibrant", color: theme.separator.vibrant},
        {separator: "translucent", color: "transparent"}
    ]
    
    return(
        <View>
            <View 
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: layout.grouped.pdText.top,
                    paddingBottom: layout.grouped.pdText.bottom,
                    gap: layout.grouped.gap
                    }}
            >
                <Text 
                    style={{
                        flex: 1,
                        lineHeight: layout.grouped.text.lh,
                        fontSize: layout.grouped.text.fs,
                        color: theme.text.label
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {label}
                </Text>
                <TextInput 
                    style={{
                        flex: 3,
                        lineHeight: layout.grouped.text.lh,
                        fontSize: layout.grouped.text.fs,
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