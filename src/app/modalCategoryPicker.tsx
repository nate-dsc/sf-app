import CategoryList, { Category } from "@/components/menu-items/ListPicker"
import { useNewTransaction } from "@/context/NewTransactionContext"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function CategoryPicker() {

    const paddingTop = useHeaderHeight() + 10
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const { t } = useTranslation()
    const { newTransaction, updateNewTransaction } = useNewTransaction()
    
    const type = newTransaction.flowType
    const selectedCategory = newTransaction.category?.id

    const [selected, setSelected] = useState<string | undefined>(selectedCategory);
    
    const expenseList: Category[] = [
        { id: "1", title: t("categories.expenses.home"), iconName: "home" },
        { id: "2", title: t("categories.expenses.eating"), iconName: "restaurant" },
        { id: "3", title: t("categories.expenses.groceries"), iconName: "cart" },
        { id: "4", title: t("categories.expenses.transport"), iconName: "car" },
        { id: "5", title: t("categories.expenses.services"), iconName: "construct" },
        { id: "6", title: t("categories.expenses.leisure"), iconName: "ticket" },
        { id: "7", title: t("categories.expenses.education"), iconName: "school" },
        { id: "8", title: t("categories.expenses.shopping"), iconName: "bag-handle" },
        { id: "9", title: t("categories.expenses.investment"), iconName: "trending-up" },
        { id: "10", title: t("categories.expenses.health"), iconName: "fitness" },
        { id: "11", title: t("categories.expenses.emergency"), iconName: "medical" },
        { id: "12", title: t("categories.expenses.traveling"), iconName: "airplane" },
        { id: "13", title: t("categories.expenses.pet"), iconName: "paw" },
        { id: "14", title: t("categories.expenses.gaming"), iconName: "game-controller" },
        { id: "15", title: t("categories.expenses.gambling"), iconName: "dice" },
        { id: "16", title: t("categories.expenses.other"), iconName: "ellipsis-horizontal" }
    ];

    const incomeList: Category[] = [
        { id: "21", title: t("categories.income.salary"), iconName: "cash" },
        { id: "22", title: t("categories.income.freelance"), iconName: "hammer" },
        { id: "23", title: t("categories.income.oncall"), iconName: "id-card" },
        { id: "24", title: t("categories.income.overtime"), iconName: "time" },
        { id: "25", title: t("categories.income.perdiem"), iconName: "today" },
        { id: "26", title: t("categories.income.sales"), iconName: "pricetag" },
        { id: "27", title: t("categories.income.roi"), iconName: "trending-up" },
        { id: "28", title: t("categories.income.gambling"), iconName: "dice" },
        { id: "29", title: t("categories.income.other"), iconName: "ellipsis-horizontal" }
    ];
    
    return(
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop}, {paddingHorizontal: 20, paddingBottom: insets.bottom}, {width: 320}]}>
            <CategoryList
                categories={type === "inflow" ? incomeList : expenseList}
                selectedId={selected}
                onSelect={(id, title) => {
                    updateNewTransaction({category: {id, title}})
                    router.back()
                }}
            />
        </ScrollView>
    )
}
