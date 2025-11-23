import GSelectionList from "@/components/grouped-list-components/GroupedSelectionList"
import { useNewTransaction } from "@/context/NewTransactionContext"
import { useStyle } from "@/context/StyleContext"
import { GSListItem } from "@/types/Components"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function CategoryPicker() {

    const {layout} = useStyle()
    const paddingTop = useHeaderHeight() + 10
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const { t } = useTranslation()
    const { newTransaction, updateNewTransaction } = useNewTransaction()

    const type = newTransaction.type
    const selectedCategory = newTransaction.category?.toString()

    const [selected, setSelected] = useState<string | undefined>(selectedCategory);
    
    const expenseList: GSListItem<number>[] = [
        { id: "1", label: t("categories.expenses.home"), value: 1, iconName: "home" },
        { id: "2", label: t("categories.expenses.eating"), value: 2, iconName: "restaurant" },
        { id: "3", label: t("categories.expenses.groceries"), value: 3, iconName: "cart" },
        { id: "4", label: t("categories.expenses.transport"), value: 4, iconName: "car" },
        { id: "5", label: t("categories.expenses.services"), value: 5, iconName: "construct" },
        { id: "6", label: t("categories.expenses.leisure"), value: 6, iconName: "ticket" },
        { id: "7", label: t("categories.expenses.education"), value: 7, iconName: "school" },
        { id: "8", label: t("categories.expenses.shopping"), value: 8, iconName: "bag-handle" },
        { id: "9", label: t("categories.expenses.investment"), value: 9, iconName: "trending-up" },
        { id: "10", label: t("categories.expenses.health"), value: 10, iconName: "fitness" },
        { id: "11", label: t("categories.expenses.emergency"), value: 11, iconName: "medical" },
        { id: "12", label: t("categories.expenses.traveling"), value: 12, iconName: "airplane" },
        { id: "13", label: t("categories.expenses.pet"), value: 13, iconName: "paw" },
        { id: "14", label: t("categories.expenses.gaming"), value: 14, iconName: "game-controller" },
        { id: "15", label: t("categories.expenses.gambling"), value: 16, iconName: "dice" },
        { id: "16", label: t("categories.expenses.other"), value: 17, iconName: "ellipsis-horizontal" }
    ];

    const incomeList: GSListItem<number>[] = [
        { id: "21", label: t("categories.income.salary"), value: 21, iconName: "cash" },
        { id: "22", label: t("categories.income.freelance"), value: 22, iconName: "hammer" },
        { id: "23", label: t("categories.income.oncall"), value: 23, iconName: "id-card" },
        { id: "24", label: t("categories.income.overtime"), value: 24, iconName: "time" },
        { id: "25", label: t("categories.income.perdiem"), value: 25, iconName: "today" },
        { id: "26", label: t("categories.income.sales"), value: 26, iconName: "pricetag" },
        { id: "27", label: t("categories.income.roi"), value: 27, iconName: "trending-up" },
        { id: "28", label: t("categories.income.gambling"), value: 28, iconName: "dice" },
        { id: "29", label: t("categories.income.other"), value: 29, iconName: "ellipsis-horizontal" }
    ];
    
    return(
        <ScrollView
            contentContainerStyle={{
                paddingTop: useHeaderHeight() + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: 100
            }}
            showsVerticalScrollIndicator={false}
        >
            <GSelectionList
                items={type === "in" ? incomeList : expenseList}
                singleSelect
                selectedIds={selected ? [selected] : undefined}
                onSelect={(id, label) => {
                    updateNewTransaction({category: Number(id)})
                    router.back()
                }}
            />
        </ScrollView>
    )
}
