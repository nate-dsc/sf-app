
import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE } from "@/styles/Fonts"
import { GroupedComponentsProps } from "@/types/components"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { useTranslation } from "react-i18next"
import { Text, TouchableWithoutFeedback, View } from "react-native"

type GPopupProps = GroupedComponentsProps & {
    label: string,
    displayValue?: string,
    onPress: () => void,
    labelFlex?: number,
    fieldFlex?: number
}

export default function GPopup({separator, label, displayValue, onPress, labelFlex = 1, fieldFlex = 1}: GPopupProps) {

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
                                    fontSize: FONT_SIZE.BODY,
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
                                    fontSize: FONT_SIZE.BODY,
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