import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const {t} = useTranslation()

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

type Category = {
    id: string,
    label: string,
    iconName: IoniconName
}

const categoryList: Category[] = [
    { id: "0", label: "undefined", iconName: "help-circle-outline"},
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
    { id: "15", label: t("categories.expenses.gambling"), iconName: "dice" },
    { id: "16", label: t("categories.expenses.other"), iconName: "ellipsis-horizontal" },
    { id: "21", label: t("categories.income.salary"), iconName: "cash" },
    { id: "22", label: t("categories.income.freelance"), iconName: "hammer" },
    { id: "23", label: t("categories.income.oncall"), iconName: "id-card" },
    { id: "24", label: t("categories.income.overtime"), iconName: "time" },
    { id: "25", label: t("categories.income.perdiem"), iconName: "today" },
    { id: "26", label: t("categories.income.sales"), iconName: "pricetag" },
    { id: "27", label: t("categories.income.roi"), iconName: "trending-up" },
    { id: "28", label: t("categories.income.gambling"), iconName: "dice" },
    { id: "29", label: t("categories.income.other"), iconName: "ellipsis-horizontal" }
];

export function findCategoryByID(id: string|number){
    const category = categoryList.find(item => item.id === String(id))
    return category ? category : categoryList[0]
}