import CategoryList, { Category } from "@/components/menu-items/ListPicker"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function CategoryPicker() {

    const { t } = useTranslation()

    const paddingTop = useHeaderHeight() + 10
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [selected, setSelected] = useState<string | null>(null);
    
    const expenseList: Category[] = [
        { id: "1", title: t("categories.expenses.home"), iconName: "home" },
        { id: "2", title: t("categories.expenses.eating"), iconName: "fast-food" },
        { id: "3", title: "Saúde", iconName: "fitness" },
        { id: "4", title: t("categories.expenses.transport"), iconName: "car" },
    ];
    
    return(
            <ScrollView contentContainerStyle={[{paddingTop: paddingTop}, {paddingHorizontal: 20, marginBottom: insets.bottom}]}>
                    <CategoryList
                        categories={expenseList}
                        selectedId={selected}
                        onSelect={(id) => setSelected(id)}
                    />
            </ScrollView>
    )
}
