import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { RecurringTransaction, Transaction } from "@/types/transaction"
import { createContext, ReactNode, useContext, useMemo, useState } from "react"

type NewTransaction = {
    flowType?: "inflow" | "outflow",
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
}

const NewTransactionContext = createContext<NewTransactionContextType | undefined>(undefined)

export const NewTransactionProvider = ({children}: {children: ReactNode}) => {
    const [newTransaction, setNewTransaction] = useState<NewTransaction>({})

    const {
        createTransaction,
        createRecurringTransaction,
        createTransactionWithCard,
        createRecurringTransactionWithCard,
        createInstallmentPurchase,
        getSummaryFromDB,
        getCard
    } = useTransactionDatabase();

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
        const { flowType, value, date, category, useCreditCard, cardId } = newTransaction;

        if (!(flowType && value && value > 0 && date && category?.id)) {
            return false
        }

        if (useCreditCard) {
            return !!cardId
        }

        return true
    }, [newTransaction]);

    const isInstallmentValid = useMemo(() => {
        const { value, description, category, installmentsCount, purchaseDay, cardId } = newTransaction

        if (!(value && value > 0)) {
            return false
        }

        if (!(installmentsCount && installmentsCount > 0)) {
            return false
        }

        if (!description || description.trim().length === 0) {
            return false
        }

        if (!category?.id) {
            return false
        }

        if (!(purchaseDay && purchaseDay >= 1 && purchaseDay <= 31)) {
            return false
        }

        if (!cardId) {
            return false
        }

        return true
    }, [newTransaction])

    const getTransactionForDB = (): Transaction => {
        if (!isValid) {
            throw new Error("Tentativa de criar transação com dados inválidos.");
        }
        const categoryId = Number(newTransaction.category?.id)

        return {
            id: 0,
            value: newTransaction.flowType === "inflow" ? newTransaction.value! : -newTransaction.value!,
            description: newTransaction.description || "",
            category: Number.isNaN(categoryId) ? 0 : categoryId,
            date: newTransaction.date?.toISOString().slice(0, 16)!,
            card_id: newTransaction.useCreditCard ? newTransaction.cardId ?? null : null,
            flow: newTransaction.flowType === "inflow" ? "inflow" : "outflow",
        }
    }

    const getTransactionRecurringForDB = (): RecurringTransaction => {
        if (!isValid && !newTransaction.rrule) {
            throw new Error("Tentativa de criar transação recorrente com dados inválidos.");
        }
        const categoryId = Number(newTransaction.category?.id)

        return {
            id: 0,
            value: newTransaction.flowType === "inflow" ? newTransaction.value! : -newTransaction.value!,
            description: newTransaction.description || "",
            category: Number.isNaN(categoryId) ? 0 : categoryId,
            date_start: newTransaction.date?.toISOString().slice(0, 16)!,
            rrule: newTransaction.rrule!,
            date_last_processed: null,
            card_id: newTransaction.useCreditCard ? newTransaction.cardId ?? null : null,
            flow: newTransaction.flowType === "inflow" ? "inflow" : "outflow",
        }
    }

    const saveTransaction = async () => {
        const shouldUseCreditCard = !!newTransaction.useCreditCard && !!newTransaction.cardId

        const ensureCardLimit = async () => {
            if (!newTransaction.cardId || !newTransaction.value) {
                throw new Error("Tentativa de usar cartão sem cartão selecionado ou valor definido.")
            }

            const card = await getCard(newTransaction.cardId)

            if (!card) {
                throw new Error("CARD_NOT_FOUND")
            }

            const availableLimit = card.limit - card.limitUsed
            const purchaseValue = newTransaction.value

            if (purchaseValue > availableLimit) {
                throw new Error("INSUFFICIENT_CREDIT_LIMIT")
            }
        }

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
        if (!isInstallmentValid) {
            throw new Error("Tentativa de criar compra parcelada com dados inválidos.")
        }

        const { value, description, category, installmentsCount, purchaseDay, cardId } = newTransaction

        if (!cardId || !value || !installmentsCount || !purchaseDay || !category?.id) {
            throw new Error("Tentativa de criar compra parcelada com dados inválidos.")
        }

        try {
            const card = await getCard(cardId)

            if (!card) {
                throw new Error("CARD_NOT_FOUND")
            }

            const totalValue = value * installmentsCount
            const availableLimit = card.limit - card.limitUsed

            if (totalValue > availableLimit) {
                throw new Error("INSUFFICIENT_CREDIT_LIMIT")
            }

            await createInstallmentPurchase({
                description: description?.trim() ?? "",
                category: category.id,
                installmentValue: value,
                installmentsCount,
                purchaseDay,
                cardId,
            })

            await loadSummaryData({ getSummaryFromDB })
            triggerRefresh()
            setNewTransaction({})
        } catch (error) {
            console.error("Erro ao salvar compra parcelada:", error)
            throw error
        }
    }

    return(
        <NewTransactionContext.Provider value={{
            newTransaction, setNewTransaction, updateNewTransaction, saveTransaction, isValid, saveInstallmentPurchase, isInstallmentValid
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