import { useStyle } from "@/context/StyleContext"
import { TransactionTypeFilter } from "@/types/transaction"
import { getCategoriesByType } from "@/utils/CategoryUtils"
import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

type CategoryPickerCompactProps = {
    type: TransactionTypeFilter,
    onChangeSelected: (selectedIds: number[]) => void,
 
    initialSelected?: number[]
}

export function CategoryPickerCompact({ type, onChangeSelected, initialSelected = [] }: CategoryPickerCompactProps) {
    const { t } = useTranslation()
    const {theme} = useStyle()
    const [selected, setSelected] = useState<number[]>(initialSelected)

    const filteredList = useMemo(
        () => getCategoriesByType(type).map((category) => ({
            ...category,
            label: t(category.translationKey),
        })),
        [t, type],
    )

    const rows = useMemo(() => {
        const total = filteredList.length
        const perRow = Math.floor(total / 3)
        const remainder = total % 3

        const row1 = filteredList.slice(0, perRow + (remainder > 0 ? 1 : 0))
        const row2 = filteredList.slice(
        row1.length,
        row1.length + perRow + (remainder > 1 ? 1 : 0)
        )
        const row3 = filteredList.slice(row1.length + row2.length)

        return [row1, row2, row3]
    }, [filteredList])


    const toggleCategory = (id: number) => {
        setSelected(prev => {
        const newSelected = prev.includes(id)
            ? prev.filter(x => x !== id)
            : [...prev, id]
        onChangeSelected(newSelected)
        return newSelected
        })
    }

    return (
        <View style={{}}>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{}}
        >
            <View style={{gap: 12, backgroundColor: theme.background.group.secondaryBg}}>
            {rows.map((row, rowIndex) => (
                <View style={{flexDirection: "row", gap: 6}} key={rowIndex.toString()}>
                    {row.map(cat => {
                        const isSelected = selected.includes(cat.id)

                    return (
                        <TouchableOpacity
                            key={cat.id}
                            style={{paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: isSelected ? theme.colors.blue : theme.fill.secondary}}
                            onPress={() => toggleCategory(cat.id)}
                            activeOpacity={0.8}
                        >
                        {/* <Ionicons
                            name={cat.iconName}
                            size={22}
                            color={isSelected ? "#fff" : "#444"}
                        /> */}
                        <Text style={{lineHeight: 22, fontSize: 17, color: isSelected ? theme.colors.white : theme.text.label}}>
                            {cat.label}
                        </Text>
                        </TouchableOpacity>
                    )

                    })}
                </View>
            ))}
            </View>
        </ScrollView>
        </View>
    )
}