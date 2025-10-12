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

export function useTransactionDatabase() {
    const database = useSQLiteContext()

    async function create(data: Transaction) {
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



    return { create }
}