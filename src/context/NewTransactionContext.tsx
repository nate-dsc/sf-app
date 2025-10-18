import { Transaction, TransactionRecurring, useTransactionDatabase } from "@/database/useTransactionDatabase"
import { useSummaryStore } from "@/stores/useSummaryStore"
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
    rrule?: string
}

type NewTransactionContextType = {
    newTransaction: NewTransaction,
    setNewTransaction: (newTransaction: NewTransaction) => void,
    updateNewTransaction: (updates: Partial<NewTransaction>) => void
    saveTransaction: () => Promise<void>
    isValid: boolean
}

const NewTransactionContext = createContext<NewTransactionContextType | undefined>(undefined)

export const NewTransactionProvider = ({children}: {children: ReactNode}) => {
    const [newTransaction, setNewTransaction] = useState<NewTransaction>({})

    const { createTransaction, createTransactionRecurring, getSummaryFromDB } = useTransactionDatabase();

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
        const { flowType, value, date, category } = newTransaction;
        return !!(flowType && value && value > 0 && date && category?.id);
    }, [newTransaction]);

    const getTransactionForDB = (): Transaction => {
        if (!isValid) {
            throw new Error("Tentativa de criar transação com dados inválidos.");
        }
        return {
            id: 0,
            value: newTransaction.flowType === "inflow" ? newTransaction.value! : -newTransaction.value!,
            description: newTransaction.description || "",
            category: newTransaction.category?.id!,
            date: newTransaction.date?.toISOString().slice(0, 16)!,
        }
    }

    const getTransactionRecurringForDB = (): TransactionRecurring => {
        if (!isValid && !newTransaction.rrule) {
            throw new Error("Tentativa de criar transação recorrente com dados inválidos.");
        }
        return {
            id: 0,
            value: newTransaction.flowType === "inflow" ? newTransaction.value! : -newTransaction.value!,
            description: newTransaction.description || "",
            category: newTransaction.category?.id!,
            date_start: newTransaction.date?.toISOString().slice(0, 16)!,
            rrule: newTransaction.rrule!,
            date_last_processed: null
        }
    }

    const saveTransaction = async () => {
        if(newTransaction.rrule) {
            try {
                const transactionData = getTransactionRecurringForDB()
                await createTransactionRecurring(transactionData)
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
                await createTransaction(transactionData)
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

    return(
        <NewTransactionContext.Provider value={{
            newTransaction, setNewTransaction, updateNewTransaction, saveTransaction, isValid
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