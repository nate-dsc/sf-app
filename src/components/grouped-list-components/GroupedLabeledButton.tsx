
import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE } from "@/styles/Fonts"
import { GroupedComponentsProps } from "@/types/Components"
import React, { ReactNode } from "react"
import { Text, TouchableWithoutFeedback, View } from "react-native"
import { AppIcon } from "../AppIcon"

type GroupedLabeledButtonProps = GroupedComponentsProps & {
    label: string,
    icon?: ReactNode,
    onPress: () => void,
    buttonLabel: string,
    buttonIcon?: "chevron-expand" | "chevron-forward" | "external",
    isAccented?: boolean
}

export default function GLabeledButton({separator, label, onPress, buttonLabel, buttonIcon, isAccented = false}: GroupedLabeledButtonProps) {

    const {theme} = useStyle()

    const separatorTypes = [
        {separator: "opaque", color: theme.separator.opaque},
        {separator: "translucent", color: theme.separator.translucent},
        {separator: "vibrant", color: theme.separator.vibrant},
        {separator: "translucent", color: "transparent"}
    ]

    const ButtonIcon = () => {
        if (buttonIcon === "chevron-expand") {
            return (
                <AppIcon
                    name={"chevron.up.chevron.down"}
                    androidName={"unfold-more"}
                    size={18}
                    tintColor={isAccented ? theme.colors.blue : theme.text.label}                
                />
            )
        }
        if (buttonIcon === "chevron-forward") {
            return (
                <AppIcon
                    name={"chevron.right"}
                    androidName={"chevron-right"}
                    size={18}
                    tintColor={isAccented ? theme.colors.blue : theme.text.label}                
                />
            )
        }
        if (buttonIcon === "external") {
            return (
                <AppIcon
                    name={"arrow.up.right"}
                    androidName={"arrow-outward"}
                    size={18}
                    tintColor={isAccented ? theme.colors.blue : theme.text.label}                
                />
            )
        }
        return null
    }

    return(
        <View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: 51,
                    gap: 8}}
            >
                <View
                    style={{
                        alignItems: "center"
                    }}
                >
                    <Text 
                        style={{
                            fontSize: FONT_SIZE.BODY,
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
                        minHeight: 51,
                        minWidth: 44
                    }}
                    onPress={onPress}
                >
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
                                fontSize: 17,
                                color: isAccented ? theme.colors.blue : theme.text.label
                            }}
                        >
                            {buttonLabel}
                        </Text>
                        {buttonIcon ? (
                            <ButtonIcon/>
                        ) : (null)}
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={{height: 1, backgroundColor: separatorTypes.find(item => item.separator === separator)?.color || "transparent"}}/>

        </View>
    )
}