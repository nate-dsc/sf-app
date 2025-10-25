export type Flow = "inflow" | "outflow"

export type Transaction = {
    id: number,
    value: number,
    description: string,
    category: string,
    date: string,
    id_recurring?: number
}

export type RecurringTransaction = {
    id: number,
    value: number,
    description: string,
    category: string,
    date_start: string,
    rrule: string,
    date_last_processed: string | null
}

export type CCard = {
    id: number,
    name: string,
    color: string,
    closingDay: number,
    dueDay: number,
    ignoreWeekends: boolean
}

export type TransactionTypeFilter = "inflow" | "outflow" | "all"

export type FilterSortBy = "date" | "value"

export type FilterOrderBy = "asc" | "desc"

export type SearchFilters = {
    textSearch?: string,
    category?: number[],
    minValue?: number,
    maxValue?: number,
    dateFilterActive?: boolean,
    initialDate?: Date,
    finalDate?: Date,
    sortBy?: FilterSortBy,
    orderBy?: FilterOrderBy,
    type?: TransactionTypeFilter
}

export type Summary = {
    inflowCurrentMonth: number,
    outflowCurrentMonth: number,
    lastTransaction: Transaction | null
}
