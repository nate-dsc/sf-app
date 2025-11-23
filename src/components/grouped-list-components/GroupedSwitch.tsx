
import React from "react"
import { Switch } from "react-native"
import GroupedGenericComponentNotTouchable, { GroupedGenericComponentNotTouchableProps } from "./generic/GroupedGenericComponentNotTouchable"

type GSwitchProps = GroupedGenericComponentNotTouchableProps & {
    value: boolean,
    onValueChange: (value: boolean) => void,
    disabled?: boolean
}

export default function GSwitch({value, onValueChange, disabled = false, ...rest}: GSwitchProps) {

    return(
        <GroupedGenericComponentNotTouchable
            trailingItem={
                <Switch
                    style={{alignSelf: "center"}}
                    value={value}
                    onValueChange={onValueChange}
                    disabled={disabled}
                />
            }
            {...rest}
        />
    )
}