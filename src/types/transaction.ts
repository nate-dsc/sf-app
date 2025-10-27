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

export type BudgetPeriod = "weekly" | "monthly" | "quarterly" | "yearly" | "custom"

export type Budget = {
    id: number,
    name: string,
    categoryId: number | null,
    period: BudgetPeriod,
    amount: number,
    startDate: string,
    endDate: string | null,
    rollover: boolean,
    createdAt: string,
}

export type BudgetInput = {
    name: string,
    category_id?: number | null,
    period: BudgetPeriod,
    amount: number,
    start_date: string,
    end_date?: string | null,
    rollover: boolean,
}

export type BudgetOverview = {
    id: number,
    name: string,
    categoryId: number | null,
    period: BudgetPeriod,
    amount: number,
    spent: number,
    startDate: string,
    endDate: string | null,
    rollover: boolean,
    createdAt: string,
    progress: number,
}

export type BudgetAllocation = {
    id: number,
    budgetId: number,
    transactionId: number | null,
    amount: number,
    allocatedAt: string,
    notes: string | null,
}

export type BudgetAllocationInput = {
    budget_id: number,
    transaction_id?: number | null,
    amount: number,
    allocated_at?: string,
    notes?: string | null,
}

export type Summary = {
    inflowCurrentMonth: number,
    outflowCurrentMonth: number,
    lastTransaction: Transaction | null,
    budgets: BudgetOverview[],
}
