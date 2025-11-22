import { CCard, InstallmentOccurrence, InstallmentSchedule, InstallmentScheduleWithStatus } from "@/types/Transactions"

export function generateRRULE(purchaseDate: Date, installmentsCount: number) {
    
}

const MAX_DAY = 31
const MIN_DAY = 1

export type InstallmentFormValues = {
    installmentValue?: number | null
    description?: string | null
    categoryId?: string | number | null
    installmentsCount?: number | null
    purchaseDay?: number | null
    cardId?: number | null
}

export type InstallmentValidationErrors = Partial<{
    installmentValue: string
    installmentsCount: string
    description: string
    category: string
    purchaseDay: string
    card: string
}>

export type InstallmentValidationResult = {
    errors: InstallmentValidationErrors
    isValid: boolean
}

export function getAllowedPurchaseDays(closingDay?: number | null): number[] {
    const resolvedClosingDay = typeof closingDay === "number" && closingDay >= MIN_DAY
        ? Math.min(closingDay, MAX_DAY)
        : MAX_DAY

    return Array.from({ length: resolvedClosingDay }, (_, index) => index + MIN_DAY)
}

export function clampPurchaseDay(day: number, closingDay?: number | null) {
    const allowedDays = getAllowedPurchaseDays(closingDay)

    if (allowedDays.length === 0) {
        return day
    }

    const min = allowedDays[0]
    const max = allowedDays[allowedDays.length - 1]

    if (day < min) {
        return min
    }

    if (day > max) {
        return max
    }

    return day
}

export function validateInstallmentForm(values: InstallmentFormValues): InstallmentValidationResult {
    const errors: InstallmentValidationErrors = {}

    const value = typeof values.installmentValue === "number" ? values.installmentValue : null
    if (!value || value <= 0) {
        errors.installmentValue = "installmentModal.validation.valueRequired"
    }

    const installments = typeof values.installmentsCount === "number" ? values.installmentsCount : null
    if (!installments || installments <= 0) {
        errors.installmentsCount = "installmentModal.validation.installmentsRequired"
    }

    const trimmedDescription = values.description?.trim() ?? ""
    if (!trimmedDescription) {
        errors.description = "installmentModal.validation.descriptionRequired"
    }

    if (!values.categoryId) {
        errors.category = "installmentModal.validation.categoryRequired"
    }

    const purchaseDay = typeof values.purchaseDay === "number" ? values.purchaseDay : null
    if (!purchaseDay || purchaseDay < MIN_DAY || purchaseDay > MAX_DAY) {
        errors.purchaseDay = "installmentModal.validation.purchaseDayRequired"
    }

    if (!values.cardId) {
        errors.card = "installmentModal.validation.cardRequired"
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    }
}

export function formatDateTimeForSQLite(date: Date) {
    return date.toISOString().slice(0, 16)
}

function resolvePurchaseDate(base: Date, day: number) {
    const candidate = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0, 0)
    const daysInMonth = new Date(candidate.getFullYear(), candidate.getMonth() + 1, 0).getDate()
    const safeDay = Math.min(Math.max(day, MIN_DAY), daysInMonth)
    candidate.setDate(safeDay)
    candidate.setHours(0, 0, 0, 0)
    return candidate
}

export function computeInitialPurchaseDate(purchaseDay: number, closingDay?: number | null, referenceDate: Date = new Date()) {
    const normalizedReference = new Date(referenceDate.getTime())
    normalizedReference.setHours(0, 0, 0, 0)

    const safeDay = clampPurchaseDay(purchaseDay, closingDay)
    const currentCandidate = resolvePurchaseDate(normalizedReference, safeDay)

    if (currentCandidate.getTime() >= normalizedReference.getTime()) {
        return currentCandidate
    }

    const nextMonth = new Date(normalizedReference.getFullYear(), normalizedReference.getMonth() + 1, 1, 0, 0, 0, 0)
    return resolvePurchaseDate(nextMonth, safeDay)
}

function calculateDueDate(purchaseDate: Date, dueDay: number, ignoreWeekends: boolean) {
    const purchaseDay = purchaseDate.getDate()
    let dueYear = purchaseDate.getFullYear()
    let dueMonth = purchaseDate.getMonth()

    const safeDueDay = Math.min(Math.max(dueDay || purchaseDay, MIN_DAY), MAX_DAY)
    const daysInCurrentMonth = new Date(dueYear, dueMonth + 1, 0).getDate()
    const dueDayThisMonth = Math.min(safeDueDay, daysInCurrentMonth)

    let dueDate: Date

    if (dueDayThisMonth >= purchaseDay) {
        dueDate = new Date(dueYear, dueMonth, dueDayThisMonth, 0, 0, 0, 0)
    } else {
        dueMonth += 1
        if (dueMonth > 11) {
            dueMonth = 0
            dueYear += 1
        }

        const daysInNextMonth = new Date(dueYear, dueMonth + 1, 0).getDate()
        const adjustedDueDay = Math.min(safeDueDay, daysInNextMonth)
        dueDate = new Date(dueYear, dueMonth, adjustedDueDay, 0, 0, 0, 0)
    }

    if (!ignoreWeekends) {
        return dueDate
    }

    const dayOfWeek = dueDate.getDay()

    if (dayOfWeek === 0) {
        dueDate.setDate(dueDate.getDate() + 1)
    } else if (dayOfWeek === 6) {
        dueDate.setDate(dueDate.getDate() + 2)
    }

    dueDate.setHours(0, 0, 0, 0)
    return dueDate
}

export function generateInstallmentOccurrences({
    firstPurchaseDate,
    installmentsCount,
    purchaseDay,
    dueDay,
    ignoreWeekends,
    installmentValue,
}: {
    firstPurchaseDate: Date
    installmentsCount: number
    purchaseDay: number
    dueDay: number
    ignoreWeekends: boolean
    installmentValue: number
}): InstallmentOccurrence[] {
    const occurrences: InstallmentOccurrence[] = []
    const total = Math.max(installmentsCount, 0)

    let currentPurchase = new Date(firstPurchaseDate.getTime())
    currentPurchase.setHours(0, 0, 0, 0)

    const safePurchaseDay = Math.min(Math.max(purchaseDay, MIN_DAY), MAX_DAY)

    for (let index = 0; index < total; index += 1) {
        const dueDate = calculateDueDate(currentPurchase, dueDay, ignoreWeekends)

        occurrences.push({
            sequence: index + 1,
            purchaseDate: formatDateTimeForSQLite(currentPurchase),
            dueDate: formatDateTimeForSQLite(dueDate),
            amount: installmentValue,
        })

        const nextMonth = new Date(currentPurchase.getFullYear(), currentPurchase.getMonth() + 1, 1)
        currentPurchase = resolvePurchaseDate(nextMonth, safePurchaseDay)
    }

    return occurrences
}

export function buildInstallmentSchedule({
    blueprintId,
    cardId,
    description,
    categoryId,
    installmentValue,
    installmentsCount,
    purchaseDay,
    dueDay,
    ignoreWeekends,
    firstPurchaseDate,
}: {
    blueprintId: number
    cardId: number
    description: string
    categoryId: number
    installmentValue: number
    installmentsCount: number
    purchaseDay: number
    dueDay: number
    ignoreWeekends: boolean
    firstPurchaseDate: Date
}): InstallmentSchedule {
    const occurrences = generateInstallmentOccurrences({
        firstPurchaseDate,
        installmentsCount,
        purchaseDay,
        dueDay,
        ignoreWeekends,
        installmentValue,
    })

    return {
        id: blueprintId,
        cardId,
        description,
        categoryId,
        installmentValue,
        installmentsCount,
        purchaseDay,
        occurrences,
    }
}

export function mergeScheduleWithRealized({
    schedule,
    realizedDates,
    categoryName,
}: {
    schedule: InstallmentSchedule
    realizedDates: Set<string>
    categoryName: string | null
}): InstallmentScheduleWithStatus {
    let realizedCount = 0
    let nextDueDate: string | null = null

    const occurrencesWithStatus = schedule.occurrences.map((occurrence) => {
        const status = realizedDates.has(occurrence.dueDate) ? "posted" : "pending"

        if (status === "posted") {
            realizedCount += 1
        } else if (!nextDueDate) {
            nextDueDate = occurrence.dueDate
        }

        return {
            ...occurrence,
            status,
        }
    })

    return {
        ...schedule,
        categoryName,
        occurrences: occurrencesWithStatus,
        realizedCount,
        remainingCount: schedule.installmentsCount - realizedCount,
        nextDueDate,
    }
}

export function derivePurchaseDayForCard(card: CCard | null, fallback?: number) {
    if (!card) {
        return fallback
    }

    const allowed = getAllowedPurchaseDays(card.closingDay)
    if (allowed.length === 0) {
        return fallback
    }

    const today = new Date()
    const todayDay = today.getDate()
    const clampedToday = clampPurchaseDay(todayDay, card.closingDay)

    if (allowed.includes(clampedToday)) {
        return clampedToday
    }

    return allowed[allowed.length - 1]
}

export function normalizePurchaseDay(purchaseDay: number | undefined, card: CCard | null) {
    if (typeof purchaseDay !== "number" || !card) {
        return purchaseDay
    }

    return clampPurchaseDay(purchaseDay, card.closingDay)
}

