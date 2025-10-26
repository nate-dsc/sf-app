
import { useStyle } from "@/context/StyleContext"
import i18n from "@/i18n"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import React from "react"
import { Text, View } from "react-native"

export type GroupedComponentsProps = {
    separator: "opaque" | "translucent" | "vibrant" | "none",
}

type GDateInputProps = GroupedComponentsProps & {
    label: string,
    value: Date,
    onDateChange: (value: Date) => void
}

export default function GDateInput({separator, label, value, onDateChange}: GDateInputProps) {

    const {theme} = useStyle()

    const separatorTypes = [
        {separator: "opaque", color: theme.separator.opaque},
        {separator: "translucent", color: theme.separator.translucent},
        {separator: "vibrant", color: theme.separator.vibrant},
        {separator: "translucent", color: "transparent"}
    ]

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // O 'selectedDate' pode ser undefined (ex: no Android ao cancelar)
        // Então, só chamamos a função do pai se uma data for realmente selecionada.
        if (selectedDate) {
            onDateChange(selectedDate);
        }
    };

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
                
                <DateTimePicker
                    value={value}
                    themeVariant={theme.themeName === 'light' ? 'light' : 'dark'}
                    locale={i18n.language}
                    onChange={handleDateChange}
                    display={"compact"}
                />
            </View>
            <View style={{height: 1, backgroundColor: separatorTypes.find(item => item.separator === separator)?.color || "transparent"}}/>

        </View>
    )
}