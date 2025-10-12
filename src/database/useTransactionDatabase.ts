import { useSQLiteContext } from "expo-sqlite"

export type Transaction = {
    id: number,
    value: number,
    description: string,
    type: string,
    category: string,
    date: string,
    id_repeating?: number
}

export type TransactionRecurring = {
    id: number,
    value: number,
    description: string,
    type: string,
    category: string,
    date_start: string,
    rrule: string
}

export function useTransactionDatabase() {
    const database = useSQLiteContext()

    async function createTransaction(data: Transaction) {
        const statement = await database.prepareAsync(
            "INSERT INTO transactions (value, description, type, category, date) VALUES ($value, $description, $type, $category, $date)"
        )
        
        try {
            const result = await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $type: data.type,
                $category: data.category,
                $date: data.date
            })

            console.log(result)
            
        } catch (error) {
            throw error
        }
    }

    async function createTransactionRecurring(data: TransactionRecurring) {
        const statement = await database.prepareAsync(
            "INSERT INTO transactions_recurring (value, description, type, category, date_start, RRULE) VALUES ($value, $description, $type, $category, $date_start, $RRULE)"
        )
        
        try {
            const result = await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $type: data.type,
                $category: data.category,
                $date_start: data.date_start,
                $RRULE: data.rrule
            })

            console.log(result)
            
        } catch (error) {
            throw error
        }
    }



    return { createTransaction, createTransactionRecurring }
}