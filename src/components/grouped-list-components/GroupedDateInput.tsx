
import GroupedGenericComponentNotTouchable, { GroupedGenericComponentNotTouchableProps } from "@/components/grouped-list-components/generic/GroupedGenericComponentNotTouchable"
import { useStyle } from "@/context/StyleContext"
import i18n from "@/i18n"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import React from "react"

type GDateInputProps = GroupedGenericComponentNotTouchableProps & {
    value: Date,
    onDateChange: (value: Date) => void
}

export default function GDateInput({value, onDateChange, ...rest}: GDateInputProps) {

    const {theme} = useStyle()

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // O 'selectedDate' pode ser undefined (ex: no Android ao cancelar)
        // Então, só chamamos a função do pai se uma data for realmente selecionada.
        if (selectedDate) {
            onDateChange(selectedDate);
        }
    };

    return(
        <GroupedGenericComponentNotTouchable
            trailingItem={
                <DateTimePicker
                    value={value}
                    themeVariant={theme.themeName === 'light' ? 'light' : 'dark'}
                    locale={i18n.language}
                    onChange={handleDateChange}
                    display={"compact"}
                />
            }
            {...rest}
        />
    )
}