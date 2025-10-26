
import { useStyle } from "@/context/StyleContext"
import { GroupedComponentsProps } from "@/types/components"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { useTranslation } from "react-i18next"
import { Text, TouchableWithoutFeedback, View } from "react-native"

type GPopupProps = GroupedComponentsProps & {
    label: string,
    displayValue?: string,
    onPress: () => void
}

export default function GPopup({separator, label, displayValue, onPress}: GPopupProps) {

    const {theme} = useStyle()
    const {t} = useTranslation()

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
                
                <TouchableWithoutFeedback
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 8
                    }}
                    onPress={onPress}
                >
                    {displayValue ? (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: 8
                            }}
                        >
                            <Text 
                                style={{
                                    lineHeight: 22,
                                    fontSize: 17,
                                    color: theme.text.label
                                }}
                            >
                                {displayValue}
                            </Text>
                            <Ionicons name="chevron-expand" size={18} color={theme.text.label}/>
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: 8
                            }}
                        >
                            <Text 
                                style={{
                                    lineHeight: 22,
                                    fontSize: 17,
                                    color: theme.text.secondaryLabel
                                }}
                            >
                                {displayValue || t("modalAdd.select")}
                            </Text>
                            <Ionicons name="chevron-expand" size={18} color={theme.text.secondaryLabel}/>
                        </View>
                    )}
                </TouchableWithoutFeedback>
            </View>
            <View style={{height: 1, backgroundColor: separatorTypes.find(item => item.separator === separator)?.color || "transparent"}}/>

        </View>
    )
}