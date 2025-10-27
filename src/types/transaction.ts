export type Flow = "inflow" | "outflow"

export type Transaction = {
    id: number,
    value: number,
    description: string,
    category: number,
    date: string,
    id_recurring?: number | null,
    card_id?: number | null,
    account_id?: number | null,
    payee_id?: number | null,
    flow: Flow,
    notes?: string | null,
    created_at?: string,
    updated_at?: string,
}

export type RecurringTransaction = {
    id: number,
    value: number,
    description: string,
    category: number,
    date_start: string,
    rrule: string,
    date_last_processed: string | null,
    card_id?: number | null,
    account_id?: number | null,
    payee_id?: number | null,
    flow: Flow,
    notes?: string | null,
    is_installment?: number,
}

export type NewCard = {
    name: string,
    color: number,
    limit: number,
    closingDay: number,
    dueDay: number,
    ignoreWeekends: boolean
}

export type CCard = {
    id: number,
    name: string,
    limit: number,
    limitUsed: number,
    color: string,
    closingDay: number,
    dueDay: number,
    ignoreWeekends: boolean
}

export type InstallmentPurchaseInput = {
    description: string,
    category: string,
    installmentValue: number,
    installmentsCount: number,
    purchaseDay: number,
    cardId: number,
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

export type BudgetPeriod = "weekly" | "biweekly" | "monthly"

export type BudgetSnapshot = {
    period: BudgetPeriod,
    amountCents: number,
    spentCents: number,
}

export type MonthlyCategoryAggregate = {
    categoryId: number,
    name: string,
    color: string | null,
    flow: Flow,
    total: number,
}

export type CategoryDistributionFilters = {
    month?: Date,
    flow?: Flow,
}

export type Summary = {
    inflowCurrentMonth: number,
    outflowCurrentMonth: number,
    lastTransaction: Transaction | null,
    budget: BudgetSnapshot | null,
}
