import { useSQLiteContext } from "expo-sqlite"

export type Transaction = {
    id: number,
    value: number,
    description: string,
    category: string,
    date: string,
    id_repeating?: number
}

export type TransactionRecurring = {
    id: number,
    value: number,
    description: string,
    category: string,
    date_start: string,
    rrule: string
}

export function useTransactionDatabase() {
    const database = useSQLiteContext()

    async function createTransaction(data: Transaction) {
        const statement = await database.prepareAsync(
            "INSERT INTO transactions (value, description, category, date) VALUES ($value, $description, $category, $date)"
        )
        
        try {
            const result = await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $category: data.category,
                $date: data.date
            })

            console.log(`Transação única inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData: ${data.date}`)
            
        } catch (error) {
            throw error
        }
    }

    async function createTransactionRecurring(data: TransactionRecurring) {
        const statement = await database.prepareAsync(
            "INSERT INTO transactions_recurring (value, description, category, date_start, RRULE) VALUES ($value, $description, $category, $date_start, $RRULE)"
        )
        
        try {
            const result = await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $category: data.category,
                $date_start: data.date_start,
                $RRULE: data.rrule
            })

            console.log(`Transação recorrente inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData início: ${data.date_start}\nRRULE: ${data.rrule}`)
            
        } catch (error) {
            throw error
        }
    }



    return { createTransaction, createTransactionRecurring }
}