import { Summary } from "@/stores/useSummaryStore"
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
        } finally {
            statement.finalizeAsync()
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
        } finally {
            statement.finalizeAsync()
        }
    }

    async function getTransactionsFromMonth(YMString: string, orderBy: "day" | "id") {
        const orderStr = orderBy === "id" ? "id" : "CAST(strftime('%d', date) AS INTEGER)"
        
        try {
            const query = `SELECT * FROM transactions WHERE strftime('%Y-%m', date) = ${YMString} ORDER BY ${orderStr}`
            
            const response = await database.getAllAsync<Transaction>(query)

            return response
        } catch (error) {
            console.log("Could not find transactions by month")
            throw error
        }
    }

    async function getSummaryFromDB(): Promise<Summary> {
        // Lógica para obter o mês anterior no formato YYYY-MM
        const today = new Date();
        // Leva a data para o primeiro dia do mês atual e depois subtrai 1 dia para ir para o último dia do mês anterior
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const currentMonthStr = `${year}-${month}`;

        try {
            // Query para somar todas as transações positivas (entradas) do mês anterior
            const inflowResult = await database.getFirstAsync<{ total: number }>(
                "SELECT SUM(value) as total FROM transactions WHERE value > 0 AND strftime('%Y-%m', date) = ?",
                [currentMonthStr]
            );

            // Query para somar todas as transações negativas (saídas) do mês anterior
            const outflowResult = await database.getFirstAsync<{ total: number }>(
                "SELECT SUM(value) as total FROM transactions WHERE value < 0 AND strftime('%Y-%m', date) = ?",
                [currentMonthStr]
            );
            
            // Query para buscar a transação mais recente
            const lastTransactionResult = await database.getFirstAsync<Transaction>(
                "SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT 1"
            );

            const summaryData: Summary = {
                // Usa ?? 0 para garantir que o valor seja um número caso não haja transações
                inflowCurrentMonth: inflowResult?.total ?? 0,
                // Multiplica por -1 para tornar o valor positivo
                outflowCurrentMonth: (outflowResult?.total ?? 0) * -1,
                lastTransaction: lastTransactionResult || null, // Garante que seja null se não houver transação
            };
            
            return summaryData;

        } catch (error) {
            console.error("Falha ao buscar dados do sumário:", error);
            throw error;
        }
    }



    return { createTransaction, createTransactionRecurring, getTransactionsFromMonth, getSummaryFromDB }
}