
import { useStyle } from "@/context/StyleContext"
import { GroupedComponentsProps, IconName } from "@/types/components"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { useTranslation } from "react-i18next"
import { Text, TouchableWithoutFeedback, View } from "react-native"

type GRedirProps = GroupedComponentsProps & {
    label: string,
    icon?: IconName,
    onPress: () => void,
    overrideChevron?: "default" | "none" | "checkmark" 
}

export default function GRedir({separator, label, icon, onPress, overrideChevron = "default"}: GRedirProps) {

    const {theme, layout} = useStyle()
    const {t} = useTranslation()

    const separatorTypes = [
        {separator: "opaque", color: theme.separator.opaque},
        {separator: "translucent", color: theme.separator.translucent},
        {separator: "vibrant", color: theme.separator.vibrant},
        {separator: "translucent", color: "transparent"}
    ]

    const RightIcon = () => {
        if (overrideChevron === "none") return null
        if (overrideChevron === "checkmark")
            return (
                <Ionicons
                    name="checkmark"
                    size={20}
                    color={theme.colors.blue}
                />
            )
        return (
            <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.text.secondaryLabel}
            />
        )
    }

    return(
        <View>
            <TouchableWithoutFeedback onPress={onPress} >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8
                    }}
                >
                    <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 8}}>
                        {icon ?
                        <View
                            style={{
                                width: 32,
                                height: 50,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Ionicons name={icon} color={theme.text.label} size={layout.icons.md} />
                        </View>
                        : null}

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
                    </View>
                    
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 8
                        }}
                    >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    gap: 8
                                }}
                            >
                                <RightIcon />
                            </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <View
                style={{
                    height: 1,
                    backgroundColor: separatorTypes.find(item => item.separator === separator)?.color || "transparent",
                    marginLeft: icon ? 40 : 0
                }}
            />
        </View>
    )
}