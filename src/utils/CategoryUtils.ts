import { Ionicons } from "@expo/vector-icons"

import type { TransactionType, TransactionTypeFilter } from "@/types/Transactions"

type IoniconName = React.ComponentProps<typeof Ionicons>["name"]

export type CategoryDetail = {
    id: number
    translationKey: string
    iconName: IoniconName
    color: string
    type: TransactionType
}

const CATEGORY_DETAILS: CategoryDetail[] = [
    { id: 1, translationKey: "categories.expenses.home", iconName: "home", color: "#0EA5E9", type: "out" },
    { id: 2, translationKey: "categories.expenses.eating", iconName: "restaurant", color: "#FB7185", type: "out" },
    { id: 3, translationKey: "categories.expenses.groceries", iconName: "cart", color: "#F97316", type: "out" },
    { id: 4, translationKey: "categories.expenses.transport", iconName: "car", color: "#10B981", type: "out" },
    { id: 5, translationKey: "categories.expenses.services", iconName: "construct", color: "#8B5CF6", type: "out" },
    { id: 6, translationKey: "categories.expenses.leisure", iconName: "ticket", color: "#F59E0B", type: "out" },
    { id: 7, translationKey: "categories.expenses.education", iconName: "school", color: "#22D3EE", type: "out" },
    { id: 8, translationKey: "categories.expenses.shopping", iconName: "bag-handle", color: "#EC4899", type: "out" },
    { id: 9, translationKey: "categories.expenses.investment", iconName: "trending-up", color: "#22C55E", type: "out" },
    { id: 10, translationKey: "categories.expenses.health", iconName: "fitness", color: "#EF4444", type: "out" },
    { id: 11, translationKey: "categories.expenses.emergency", iconName: "medical", color: "#FACC15", type: "out" },
    { id: 12, translationKey: "categories.expenses.traveling", iconName: "airplane", color: "#38BDF8", type: "out" },
    { id: 13, translationKey: "categories.expenses.pet", iconName: "paw", color: "#D946EF", type: "out" },
    { id: 14, translationKey: "categories.expenses.gaming", iconName: "game-controller", color: "#4ADE80", type: "out" },
    { id: 15, translationKey: "categories.expenses.gambling", iconName: "dice", color: "#FB923C", type: "out" },
    { id: 16, translationKey: "categories.expenses.other", iconName: "ellipsis-horizontal", color: "#94A3B8", type: "out" },
    { id: 21, translationKey: "categories.income.salary", iconName: "cash", color: "#22C55E", type: "in" },
    { id: 22, translationKey: "categories.income.freelance", iconName: "hammer", color: "#14B8A6", type: "in" },
    { id: 23, translationKey: "categories.income.oncall", iconName: "id-card", color: "#6366F1", type: "in" },
    { id: 24, translationKey: "categories.income.overtime", iconName: "time", color: "#E879F9", type: "in" },
    { id: 25, translationKey: "categories.income.perdiem", iconName: "today", color: "#F97316", type: "in" },
    { id: 26, translationKey: "categories.income.sales", iconName: "pricetag", color: "#0EA5E9", type: "in" },
    { id: 27, translationKey: "categories.income.roi", iconName: "trending-up", color: "#FBBF24", type: "in" },
    { id: 28, translationKey: "categories.income.gambling", iconName: "dice", color: "#A855F7", type: "in" },
    { id: 29, translationKey: "categories.income.other", iconName: "ellipsis-horizontal", color: "#94A3B8", type: "in" },
]

const CATEGORY_DETAIL_MAP = new Map<number, CategoryDetail>(
    CATEGORY_DETAILS.map((category) => [category.id, category]),
)

const CATEGORY_FALLBACK: Record<TransactionType, CategoryDetail> = {
    in: CATEGORY_DETAIL_MAP.get(29)!,
    out: CATEGORY_DETAIL_MAP.get(16)!,
}

export function findCategoryByID(id: string | number, fallbackType: TransactionType = "out"): CategoryDetail {
    const category = CATEGORY_DETAIL_MAP.get(Number(id))

    return category ?? CATEGORY_FALLBACK[fallbackType]
}

export function getCategoriesByType(type: TransactionTypeFilter = "all"): CategoryDetail[] {
    if (type === "all") {
        return CATEGORY_DETAILS
    }

    return CATEGORY_DETAILS.filter((category) => category.type === type)
}

export function getAllCategories(): CategoryDetail[] {
    return CATEGORY_DETAILS
}
