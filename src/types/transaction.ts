export type TransactionType = "in" | "out"

export type Transaction = {
    id: number,
    value: number,
    description: string,
    category: number,
    date: string,
    id_recurring?: number | null,
    card_id?: number | null,
    type: TransactionType,
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
    type: TransactionType,
    is_installment?: number,
}

export type NewCard = {
    name: string,
    color: number,
    maxLimit: number,
    closingDay: number,
    dueDay: number,
    ignoreWeekends: boolean
}

export type CCard = {
    id: number,
    name: string,
    maxLimit: number,
    limitUsed: number,
    color: string,
    closingDay: number,
    dueDay: number,
    ignoreWeekends: boolean
}

export type UpdateCardInput = {
    name?: string,
    color?: number,
    maxLimit?: number,
    limitUsed?: number,
    closingDay?: number,
    dueDay?: number,
    ignoreWeekends?: boolean,
    issuer?: string,
    lastFour?: string,
}

export type CardStatementCycleSummary = {
    cardId: number,
    cardName: string,
    color: string,
    colorId: number | null,
    closingDay: number,
    dueDay: number,
    cycleStart: string,
    cycleEnd: string,
    dueDate: string,
    referenceMonth: string,
    maxLimit: number,
    limitUsed: number,
    availableCredit: number,
    realizedTotal: number,
    projectedRecurringTotal: number,
    projectedInstallmentTotal: number,
    projectedTotal: number,
    transactionsCount: number,
}

export type CardStatementHistoryOptions = {
    months?: number,
    referenceDate?: Date,
}

export type InstallmentPurchaseInput = {
    description: string,
    category: string,
    installmentValue: number,
    installmentsCount: number,
    purchaseDay: number,
    cardId: number,
}

export type InstallmentOccurrence = {
    sequence: number
    purchaseDate: string
    dueDate: string
    amount: number
}

export type InstallmentSchedule = {
    id: number
    cardId: number
    description: string
    categoryId: number
    installmentValue: number
    installmentsCount: number
    purchaseDay: number
    occurrences: InstallmentOccurrence[]
}

export type InstallmentScheduleWithStatus = InstallmentSchedule & {
    categoryName: string | null
    realizedCount: number
    remainingCount: number
    nextDueDate: string | null
    occurrences: (InstallmentOccurrence & { status: "posted" | "pending" })[]
}

export type TransactionTypeFilter = "in" | "out" | "all"

export type FilterSortBy = "date" | "value"

export type FilterOrderBy = "asc" | "desc"

export type CardPurchaseTypeFilter = "all" | "installments" | "recurring" | "single"

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
    type?: TransactionTypeFilter,
    cardId?: number,
    cardChargeType?: Exclude<CardPurchaseTypeFilter, "all">
}

export type BudgetPeriod = "weekly" | "biweekly" | "monthly"

export type BudgetSnapshot = {
    period: BudgetPeriod,
    amountCents: number,
    spentCents: number,
}

export type BudgetMonthlyPerformance = {
    monthKey: string,
    budgetCents: number,
    spentCents: number,
    differenceCents: number,
}

export type MonthlyCategoryAggregate = {
    categoryId: number,
    name: string,
    color: string,
    type: TransactionType,
    total: number,
}

export type CategoryDistributionFilters = {
    month?: Date,
    type?: TransactionType,
}

export type Summary = {
    inflowCurrentMonth: number,
    outflowCurrentMonth: number,
    lastTransaction: Transaction | null,
    budget: BudgetSnapshot | null,
}
