import { RecurringTransaction } from "./Transactions"

export type CCard = {
    id: number,
    name: string,
    maxLimit: number,
    limitUsed: number,
    color: number,
    closingDay: number,
    dueDay: number,
    ignoreWeekends: boolean
}

export type CCardDB = {
    id: number
    name: string
    color: number
    max_limit: number
    limit_used: number
    closing_day: number
    due_day: number
    ignore_weekends: number
}

export type NewCard = {
    name: string,
    color: number,
    maxLimit: number,
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
}

export type InstallmentPurchase = {
    transaction: RecurringTransaction,
    installmentCounts: number,
    purchaseDay: number,
}