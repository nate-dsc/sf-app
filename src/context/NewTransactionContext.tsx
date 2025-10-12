import { Transaction, TransactionRecurring, useTransactionDatabase } from "@/database/useTransactionDatabase"
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

    const database = useTransactionDatabase()

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
            value: newTransaction.value!,
            description: newTransaction.description || "",
            type: newTransaction.flowType!,
            category: newTransaction.category?.id!,
            date: newTransaction.date?.toISOString()!,
        }
    }

    const getTransactionRecurringForDB = (): TransactionRecurring => {
        if (!isValid) {
            throw new Error("Tentativa de criar transação recorrente com dados inválidos.");
        }
        return {
            id: 0,
            value: newTransaction.value!,
            description: newTransaction.description || "",
            type: newTransaction.flowType!,
            category: newTransaction.category?.id!,
            date_start: newTransaction.date?.toISOString()!,
            rrule: newTransaction.rrule!
        }
    }

    const saveTransaction = async () => {
        if(newTransaction.rrule) {
            try {
                const transactionData = getTransactionRecurringForDB();
                await database.createTransactionRecurring(transactionData);
                console.log("Transação recorrente salva com sucesso!");
                // Opcional: você pode limpar o formulário aqui
                // setNewTransaction({});
            } catch (error) {
                console.error("Erro ao salvar transação recorrente:", error);
                // Aqui você pode mostrar um alerta para o usuário
                throw error; // Re-lança o erro para o chamador, se necessário
            }
        } else {
            try {
                const transactionData = getTransactionForDB();
                await database.createTransaction(transactionData);
                console.log("Transação única salva com sucesso!");
                // Opcional: você pode limpar o formulário aqui
                // setNewTransaction({});
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