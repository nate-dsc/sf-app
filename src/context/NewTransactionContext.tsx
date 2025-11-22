import { useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { type TransactionType } from "@/types/Transactions"
import { formatAsInstallmentPurchase, formatAsRecurringTransaction, formatAsTransaction } from "@/utils/NewTransactionUtils"
import { createContext, ReactNode, useContext, useMemo, useState } from "react"

export type NewTransaction = {
    type?: TransactionType,
    value?: number,
    description?: string,
    date?: Date,
    category?: number,
    rrule?: string,
    cardId?: number,
    installmentsCount?: number,
}

type NewTransactionContextType = {
    newTransaction: NewTransaction,
    setNewTransaction: (newTransaction: NewTransaction) => void,
    updateNewTransaction: (updates: Partial<NewTransaction>) => void
    saveAsTransaction: () => Promise<void>
    isValidAsTransaction: boolean
    saveAsInstallmentPurchase: () => Promise<void>
    isValidAsInstallmentPurchase: boolean
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
    } = useTransactionDatabase();

    const loadSummaryData = useSummaryStore((state) => state.loadData);
    const triggerRefresh = useSummaryStore.getState().triggerRefresh

    const updateNewTransaction = (updates: Partial<NewTransaction>) => {
        setNewTransaction(prevTransaction => ({
            ...prevTransaction,
            ...updates
        }))
    }

    const isValidAsTransaction = useMemo(() => {
        const { type, value, date, category, cardId } = newTransaction

        if (!(type && value && value > 0 && date && category)) {
            return false
        }

        if (cardId) {
            //testar se tem limite
        }

        return true
    }, [newTransaction])

    const isValidAsInstallmentPurchase = useMemo(() => {
        const { value, installmentsCount, date, category, rrule, cardId } = newTransaction

        if (!(value && value > 0 && installmentsCount && date && category && rrule)) {
            return false
        }

        if (cardId) {
            //testar se tem limite
        }

        return true
    }, [newTransaction])

    const saveAsTransaction = async () => {
        if(!isValidAsTransaction) {
            throw new Error("[New Transaction Context] Data is not valid as a transaction")
        }

        const usesCreditCard = !!newTransaction.cardId
        const isRecurring = !!newTransaction.rrule

        if(isRecurring) {
            try {
                const recurringTransaction = formatAsRecurringTransaction(newTransaction)

                if(usesCreditCard) {
                    await createRecurringTransactionWithCard(recurringTransaction)
                } else {
                    await createRecurringTransaction(recurringTransaction)
                }
            } catch(err) {
                console.error("[New Transaction Context] Could not save recurring transaction", err)
                throw err
            }
        } else {
            try {
                const transaction = formatAsTransaction(newTransaction)

                if(usesCreditCard) {
                    await createTransactionWithCard(transaction)
                } else {
                    await createTransaction(transaction)
                }
            } catch(err) {
                console.error("[New Transaction Context] Could not save transaction", err)
                throw err
            }
        }
        
        console.log("[New Transaction Context] Transaction successfully saved")
    }

    const saveAsInstallmentPurchase = async () => {
        if(!isValidAsInstallmentPurchase) {
            throw new Error("[New Transaction Context] Data is not valid as an installment purchase")
        }

        const installmentPurchase = formatAsInstallmentPurchase(newTransaction)
        
        try {

            await createInstallmentPurchase(installmentPurchase)
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
            newTransaction,
            setNewTransaction,
            updateNewTransaction,
            saveAsTransaction,
            isValidAsTransaction,
            saveAsInstallmentPurchase,
            isValidAsInstallmentPurchase,
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