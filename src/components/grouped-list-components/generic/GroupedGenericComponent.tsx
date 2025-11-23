
import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE } from "@/styles/Fonts"
import { SeparatorTypes } from "@/types/components"
import React, { ReactNode } from "react"
import { Text, TouchableHighlight, View } from "react-native"

export type GroupedGenericComponentProps = {
    leadingIcon?: ReactNode,
    leadingLabel?: string,
    onPress: () => void,
    disabled?: boolean,
    trailingLabel?: string,
    trailingItem?: ReactNode,
    trailingIcon?: ReactNode,
    separator: SeparatorTypes
}

export default function GroupedGenericComponent({leadingIcon, leadingLabel, onPress, disabled, trailingLabel, trailingItem, trailingIcon, separator}: GroupedGenericComponentProps) {

    const {theme} = useStyle()

    const separatorTypes = [
        {separator: "opaque", color: theme.separator.opaque},
        {separator: "translucent", color: theme.separator.translucent},
        {separator: "vibrant", color: theme.separator.vibrant},
        {separator: "none", color: "transparent"}
    ]

    return(
        <View>
            <TouchableHighlight
                activeOpacity={0.9}
                underlayColor={theme.fill.tertiary}
                disabled={disabled}
                onPress={onPress}
            >
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 8,
                            paddingLeft: leadingIcon ? 0 : 16,
                            paddingRight: 16
                        }}
                    >
                        {/* LEADING VIEW */}
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                minHeight: 51,
                                overflow: "hidden"
                            }}
                        >
                            {leadingIcon ?
                            <View
                                style={{
                                    width: 56,
                                    height: 51,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    overflow: "hidden"
                                }}
                            >
                                {leadingIcon}
                            </View>
                            : null}
                            {leadingLabel ?
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    minHeight: 51,
                                    paddingVertical: 8
                                }}
                            >
                                <Text 
                                    style={{
                                        fontSize: FONT_SIZE.BODY,
                                        color: theme.text.label,
                                    }}
                                >
                                    {leadingLabel}
                                </Text>
                            </View>
                            : null}
                        </View>
                        {/* TRAILING VIEW */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: 8,
                                flexShrink: 0
                            }}
                        >
                            {trailingLabel ?
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    minHeight: 51,
                                    maxWidth: 100,
                                }}
                            >
                                <Text 
                                    style={{
                                        textAlign: "right",
                                        fontSize: FONT_SIZE.BODY,
                                        color: theme.text.label
                                    }}
                                >
                                    {trailingLabel}
                                </Text>
                            </View>
                            : null}
                            {trailingItem ?
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {trailingItem}
                            </View>
                            : null}
                            {trailingIcon ?
                            <View
                                style={{
                                    height: 51,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                {trailingIcon}
                            </View>
                            : null}
                        </View>
                    </View>
                    <View
                        style={{
                            height: 1,
                            backgroundColor: separatorTypes.find(item => item.separator === separator)?.color || "transparent",
                            marginLeft: leadingIcon ? 56 : 16,
                            marginRight: 16
                        }}
                    />
                </View>
            </TouchableHighlight>
        </View>
    )
}