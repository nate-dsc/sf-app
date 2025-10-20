import { TransactionTypeFilter } from "@/context/SearchFiltersContext"
import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"

type IoniconName = React.ComponentProps<typeof Ionicons>["name"]

type Category = {
    id: string
    label: string
    iconName: IoniconName
}

type CategoryPickerCompactProps = {
    type: TransactionTypeFilter,
    onChangeSelected: (selectedIds: number[]) => void,
 
    initialSelected?: number[]
}

export function CategoryPickerCompact({ type, onChangeSelected, initialSelected = [] }: CategoryPickerCompactProps) {
    const { t } = useTranslation()
    const {theme} = useTheme()
    const [selected, setSelected] = useState<number[]>(initialSelected)

    const categoryList: Category[] = [
        { id: "1", label: t("categories.expenses.home"), iconName: "home" },
        { id: "2", label: t("categories.expenses.eating"), iconName: "restaurant" },
        { id: "3", label: t("categories.expenses.groceries"), iconName: "cart" },
        { id: "4", label: t("categories.expenses.transport"), iconName: "car" },
        { id: "5", label: t("categories.expenses.services"), iconName: "construct" },
        { id: "6", label: t("categories.expenses.leisure"), iconName: "ticket" },
        { id: "7", label: t("categories.expenses.education"), iconName: "school" },
        { id: "8", label: t("categories.expenses.shopping"), iconName: "bag-handle" },
        { id: "9", label: t("categories.expenses.investment"), iconName: "trending-up" },
        { id: "10", label: t("categories.expenses.health"), iconName: "fitness" },
        { id: "11", label: t("categories.expenses.emergency"), iconName: "medical" },
        { id: "12", label: t("categories.expenses.traveling"), iconName: "airplane" },
        { id: "13", label: t("categories.expenses.pet"), iconName: "paw" },
        { id: "14", label: t("categories.expenses.gaming"), iconName: "game-controller" },
        { id: "15", label: t("categories.expenses.gamblingExp"), iconName: "dice" },
        { id: "16", label: t("categories.expenses.otherExp"), iconName: "ellipsis-horizontal" },
        { id: "21", label: t("categories.income.salary"), iconName: "cash" },
        { id: "22", label: t("categories.income.freelance"), iconName: "hammer" },
        { id: "23", label: t("categories.income.oncall"), iconName: "id-card" },
        { id: "24", label: t("categories.income.overtime"), iconName: "time" },
        { id: "25", label: t("categories.income.perdiem"), iconName: "today" },
        { id: "26", label: t("categories.income.sales"), iconName: "pricetag" },
        { id: "27", label: t("categories.income.roi"), iconName: "trending-up" },
        { id: "28", label: t("categories.income.gamblingInc"), iconName: "dice" },
        { id: "29", label: t("categories.income.otherInc"), iconName: "ellipsis-horizontal" }
    ];

    const filteredList = useMemo(() => {
        if(type === "outflow") {
            return categoryList.slice(0,15)
        } else if (type === "inflow") {
            return categoryList.slice(16, 24)
        } else {
            return categoryList
        }
    }, [type])

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
                        const idNum = Number(cat.id)
                        const isSelected = selected.includes(idNum)

                    return (
                        <TouchableOpacity
                            key={cat.id}
                            style={{paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, backgroundColor: isSelected ? theme.colors.blue : theme.fill.secondary}}
                            onPress={() => toggleCategory(idNum)}
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