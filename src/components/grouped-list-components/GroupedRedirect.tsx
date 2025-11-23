import { useStyle } from "@/context/StyleContext"
import React from "react"
import { AppIcon } from "../AppIcon"
import GroupedGenericComponent, { GroupedGenericComponentProps } from "./generic/GroupedGenericComponent"

type GRedirProps = GroupedGenericComponentProps & {
    overrideChevron?: "default" | "none" | "checkmark" 
}

export default function GRedir({overrideChevron = "default", ...rest}: GRedirProps) {

    const {theme} = useStyle()

    const RightIcon = () => {
        if (overrideChevron === "none") return null
        if (overrideChevron === "checkmark")
            return (
                <AppIcon
                    name={"checkmark"}
                    androidName={"check"}
                    size={20}
                    tintColor={theme.colors.blue}
                />
            )
        return (
            <AppIcon
                name={"chevron.forward"}
                androidName={"chevron-right"}
                size={18}
                tintColor={theme.text.secondaryLabel}
            />
        )
    }

    return(
        <GroupedGenericComponent
            {...rest}
            trailingIcon={
                <RightIcon />
            }
        />
    )
}