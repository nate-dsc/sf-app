import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE } from "@/styles/Fonts"
import React from "react"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"
import { AppIcon } from "../AppIcon"
import GroupedGenericComponent, { GroupedGenericComponentProps } from "./generic/GroupedGenericComponent"

type GPopupProps = GroupedGenericComponentProps & {
    displayValue?: string,
}

export default function GPopup({displayValue, ...rest}: GPopupProps) {

    const {theme} = useStyle()
    const {t} = useTranslation()

    return(
        <GroupedGenericComponent
            trailingItem={
                displayValue ? (
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
                            {displayValue}
                        </Text>
                    </View>
                ) : ( 
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
                                color: theme.text.secondaryLabel
                            }}
                        >
                            {displayValue || t("modalAdd.select")}
                        </Text>
                    </View>
                )
            }
            trailingIcon={
                <AppIcon
                    name={"chevron.up.chevron.down"}
                    androidName={"unfold-more"}
                    size={18}
                    tintColor={theme.text.secondaryLabel}
                />
            }
            {...rest}
        />
    )
}