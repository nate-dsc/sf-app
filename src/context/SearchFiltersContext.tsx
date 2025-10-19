export type TransactionTypeFilter = "inflow" | "outflow" | "all"

export type TransactionFilterOptions = {
    description?: string,
    category?: string,
    type?: TransactionTypeFilter
}