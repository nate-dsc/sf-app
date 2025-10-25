
import { useStyle } from "@/context/StyleContext"
import { GroupedComponentsProps } from "@/types/components"
import React from "react"
import { Switch, Text, View } from "react-native"

type GSwitchProps = GroupedComponentsProps & {
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void
}

export default function GSwitch({separator, label, value, onValueChange}: GSwitchProps) {

    const {theme} = useStyle()

    const separatorTypes = [
        {separator: "opaque", color: theme.separator.opaque},
        {separator: "translucent", color: theme.separator.translucent},
        {separator: "vibrant", color: theme.separator.vibrant},
        {separator: "translucent", color: "transparent"}
    ]

    return(
        <View>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8}}>
                <View style={{paddingTop: 15, paddingBottom: 14}}>
                    <Text 
                        style={{
                            lineHeight: 22,
                            fontSize: 17,
                            color: theme.text.label
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {label}
                    </Text>
                </View>
                
                <Switch value={value} onValueChange={onValueChange} />
            </View>
            <View style={{height: 1, backgroundColor: separatorTypes.find(item => item.separator === separator)?.color || "transparent"}}/>

        </View>
    )
}