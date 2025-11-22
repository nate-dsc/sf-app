import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useRecurringCreditLimitNotification } from "@/hooks/useRecurringCreditLimitNotification"
import { type RecurringCreditWarning } from "@/stores/useCreditNotificationStore"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { InstallmentPurchase } from "@/types/CreditCards"
import { RecurringTransaction, Transaction, type TransactionType } from "@/types/Transactions"
import {
    computeInitialPurchaseDate,
    formatDateTimeForSQLite,
    InstallmentFormValues,
    validateInstallmentForm,
} from "@/utils/InstallmentUtils"
import { showToast } from "@/utils/toast"
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { RRule } from "rrule"

export type NewTransaction = {
    type?: TransactionType,
    value?: number,
    description?: string,
    date?: Date,
    category?: {
        id: string,
        label: string
    },
    rrule?: string,
    rruleDescription?: string,
    useCreditCard?: boolean,
    cardId?: number,
    installmentsCount?: number,
    purchaseDay?: number,
}

type NewTransactionContextType = {
    newTransaction: NewTransaction,
    setNewTransaction: (newTransaction: NewTransaction) => void,
    updateNewTransaction: (updates: Partial<NewTransaction>) => void
    saveTransaction: () => Promise<void>
    isValid: boolean
    saveInstallmentPurchase: () => Promise<void>
    isInstallmentValid: boolean
    ensureCardLimit: (overrides?: EnsureCardLimitOverrides) => Promise<EnsureCardLimitResult>
    recurringCreditWarning?: RecurringCreditWarning
    clearRecurringCreditWarning: () => void
}

const NewTransactionContext = createContext<NewTransactionContextType | undefined>(undefined)

export type EnsureCardLimitOverrides = {
    cardId?: number
    valueCents?: number
}

export type EnsureCardLimitResult = {
    cardId: number
    cardName?: string | null
    availableLimit: number
    requiredAmount: number
}

export class InsufficientCreditLimitError extends Error {
    cardId: number
    cardName?: string | null
    availableLimit: number
    requiredAmount: number

    constructor({ cardId, cardName, availableLimit, requiredAmount }: EnsureCardLimitResult) {
        super("INSUFFICIENT_CREDIT_LIMIT")
        this.name = "InsufficientCreditLimitError"
        this.cardId = cardId
        this.cardName = cardName ?? undefined
        this.availableLimit = availableLimit
        this.requiredAmount = requiredAmount
    }
}

export const NewTransactionProvider = ({children}: {children: ReactNode}) => {
    const [newTransaction, setNewTransaction] = useState<NewTransaction>({})
    const { t } = useTranslation()

    const {
        createTransaction,
        createRecurringTransaction,
        createTransactionWithCard,
        createRecurringTransactionWithCard,
        createInstallmentPurchase,
        getSummaryFromDB,
        getCard
    } = useTransactionDatabase();

    const { warning: recurringCreditWarning, clearNotification: clearRecurringCreditWarning } = useRecurringCreditLimitNotification()

    // 2. Acesso à ação de recarregar dados do store do sumário
    const loadSummaryData = useSummaryStore((state) => state.loadData);
    const triggerRefresh = useSummaryStore.getState().triggerRefresh

    const updateNewTransaction = (updates: Partial<NewTransaction>) => {
        setNewTransaction(prevTransaction => ({
            ...prevTransaction,
            ...updates
        }))
    }

    const isValid = useMemo(() => {
        const { type, value, date, category, useCreditCard, cardId } = newTransaction;

        if (!(type && value && value > 0 && date && category?.id)) {
            return false
        }

        if (useCreditCard) {
            return !!cardId
        }

        return true
    }, [newTransaction]);

    const installmentValidation = useMemo(() => {
        const values: InstallmentFormValues = {
            installmentValue: newTransaction.value,
            description: newTransaction.description,
            categoryId: newTransaction.category?.id ?? null,
            installmentsCount: newTransaction.installmentsCount,
            purchaseDay: newTransaction.purchaseDay,
            cardId: newTransaction.cardId,
        }

        return validateInstallmentForm(values)
    }, [newTransaction.cardId, newTransaction.category?.id, newTransaction.description, newTransaction.installmentsCount, newTransaction.purchaseDay, newTransaction.value])

    const isInstallmentValid = installmentValidation.isValid

    const getTransactionForDB = (): Transaction => {
        if (!isValid) {
            throw new Error("Tentativa de criar transação com dados inválidos.");
        }
        const categoryId = Number(newTransaction.category?.id)

        return {
            id: 0,
            value: newTransaction.type === "in" ? newTransaction.value! : -newTransaction.value!,
            description: newTransaction.description || "",
            category: Number.isNaN(categoryId) ? 0 : categoryId,
            date: newTransaction.date?.toISOString().slice(0, 16)!,
            card_id: newTransaction.useCreditCard ? newTransaction.cardId ?? null : null,
            type: newTransaction.type ?? "out",
        }
    }

    const getTransactionRecurringForDB = (): RecurringTransaction => {
        if (!isValid && !newTransaction.rrule) {
            throw new Error("Tentativa de criar transação recorrente com dados inválidos.");
        }
        const categoryId = Number(newTransaction.category?.id)

        return {
            id: 0,
            value: newTransaction.type === "in" ? newTransaction.value! : -newTransaction.value!,
            description: newTransaction.description || "",
            category: Number.isNaN(categoryId) ? 0 : categoryId,
            date_start: newTransaction.date?.toISOString().slice(0, 16)!,
            rrule: newTransaction.rrule!,
            date_last_processed: null,
            card_id: newTransaction.useCreditCard ? newTransaction.cardId ?? null : null,
            type: newTransaction.type ?? "out",
        }
    }

    const ensureCardLimit = useCallback(async (overrides?: EnsureCardLimitOverrides): Promise<EnsureCardLimitResult> => {
        const cardId = overrides?.cardId ?? newTransaction.cardId
        const valueCents = overrides?.valueCents ?? newTransaction.value

        if (!cardId || !valueCents || valueCents <= 0) {
            throw new Error("Tentativa de usar cartão sem cartão selecionado ou valor definido.")
        }

        const card = await getCard(cardId)

        if (!card) {
            throw new Error("CARD_NOT_FOUND")
        }

        const availableLimit = card.maxLimit - card.limitUsed
        const requiredAmount = Math.abs(valueCents)

        if (requiredAmount > availableLimit) {
            throw new InsufficientCreditLimitError({
                cardId,
                cardName: card.name,
                availableLimit,
                requiredAmount,
            })
        }

        return {
            cardId,
            cardName: card.name,
            availableLimit,
            requiredAmount,
        }
    }, [getCard, newTransaction.cardId, newTransaction.value])

    const saveTransaction = async () => {
        const shouldUseCreditCard = !!newTransaction.useCreditCard && !!newTransaction.cardId

        if(newTransaction.rrule) {
            try {
                const transactionData = getTransactionRecurringForDB()
                if (shouldUseCreditCard) {
                    await ensureCardLimit()
                    await createRecurringTransactionWithCard(transactionData, newTransaction.cardId!)
                } else {
                    await createRecurringTransaction(transactionData)
                }
                await loadSummaryData({ getSummaryFromDB })
                triggerRefresh()
                console.log("Transação recorrente salva com sucesso!")
                setNewTransaction({})
            } catch (error) {
                console.error("Erro ao salvar transação recorrente:", error)
                throw error
            }
        } else {
            try {
                const transactionData = getTransactionForDB();
                if (shouldUseCreditCard) {
                    await ensureCardLimit()
                    await createTransactionWithCard(transactionData, newTransaction.cardId!)
                } else {
                    await createTransaction(transactionData)
                }
                await loadSummaryData({ getSummaryFromDB })
                triggerRefresh()
                console.log("Transação única salva com sucesso!")
                setNewTransaction({})
            } catch (error) {
                console.error("Erro ao salvar transação única:", error);
                // Aqui você pode mostrar um alerta para o usuário
                throw error; // Re-lança o erro para o chamador, se necessário
            }
        }
    }

    const saveInstallmentPurchase = async () => {
        const { value, description, category, installmentsCount, purchaseDay, cardId } = newTransaction

        const validationValues: InstallmentFormValues = {
            installmentValue: value,
            description,
            categoryId: category?.id ?? null,
            installmentsCount,
            purchaseDay,
            cardId,
        }

        const validation = validateInstallmentForm(validationValues)

        if (!validation.isValid || !cardId || !value || !installmentsCount || !purchaseDay || !category?.id) {
            showToast(t("installmentModal.toastFailure", { defaultValue: "Não foi possível salvar a compra parcelada." }), "error")
            throw new Error("Tentativa de criar compra parcelada com dados inválidos.")
        }

        try {
            const card = await getCard(cardId)

            if (!card) {
                throw new Error("CARD_NOT_FOUND")
            }

            const trimmedDescription = description?.trim() ?? ""
            const installmentsRule = new RRule({
                freq: RRule.MONTHLY,
                dtstart: computeInitialPurchaseDate(purchaseDay, card.closingDay),
                count: installmentsCount,
            })

            const transaction: RecurringTransaction = {
                id: 0,
                value: -Math.abs(value),
                description: trimmedDescription,
                category: Number(category.id),
                date_start: formatDateTimeForSQLite(installmentsRule.options.dtstart as Date),
                rrule: installmentsRule.toString(),
                date_last_processed: null,
                card_id: cardId,
                type: "out",
                is_installment: 1,
            }

            const installmentPurchase: InstallmentPurchase = {
                transaction,
                installmentCounts: installmentsCount,
                purchaseDay,
            }

            await createInstallmentPurchase(installmentPurchase)

            await loadSummaryData({ getSummaryFromDB })
            triggerRefresh()
            setNewTransaction({})
            showToast(t("installmentModal.toastSuccess", { defaultValue: "Compra parcelada salva com sucesso!" }), "success")
        } catch (error) {
            console.error("Erro ao salvar compra parcelada:", error)
            showToast(t("installmentModal.toastFailure", { defaultValue: "Não foi possível salvar a compra parcelada." }), "error")
            throw error
        }
    }

    return(
        <NewTransactionContext.Provider value={{
            newTransaction,
            setNewTransaction,
            updateNewTransaction,
            saveTransaction,
            isValid,
            saveInstallmentPurchase,
            isInstallmentValid,
            ensureCardLimit,
            recurringCreditWarning,
            clearRecurringCreditWarning,
        }}>
            {children}
        </NewTransactionContext.Provider>
    )
}

export const useNewTransaction = () => {
    const context = useContext(NewTransactionContext)
    if (context === undefined) {
        throw new Error("useNewTransaction must be used within a NewTransactionProvider")
    }

    return context
}