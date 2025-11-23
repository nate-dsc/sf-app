import { Ionicons } from "@expo/vector-icons"

export type SeparatorTypes = "none" | "opaque" | "translucent" | "vibrant"

export type GroupedComponentsProps = {
    separator: "opaque" | "translucent" | "vibrant" | "none",
}

export type SCOption<T> = {
  label: string,
  value: T
}

export type IconName = React.ComponentProps<typeof Ionicons>["name"]

export type MSListItem<T> = {
    id: string,
    label: string,
    value: T,
    iconName?: IconName;
}

export type GSListItem<T> = {
    id: string,
    label: string,
    value: T,
    iconName?: IconName;
}

export type SSListItem<T> = {
    id: string,
    label: string;
    value: T;
    iconName?: IconName;
};

export type BudgetMonthlyPerformanceDisplay = {
    monthStr: string,
    budgetStr: string,
    spentStr: string,
    differenceStr: string,
}