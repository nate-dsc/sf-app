import { Summary, useSummaryStore } from "@/stores/useSummaryStore"
import { useSQLiteContext } from "expo-sqlite"
import { RRule } from "rrule"

export type Transaction = {
    id: number,
    value: number,
    description: string,
    category: string,
    date: string,
    id_recurring?: number
}

export type TransactionRecurring = {
    id: number,
    value: number,
    description: string,
    category: string,
    date_start: string,
    rrule: string,
    date_last_processed: string | null
}

export type TransactionTypeFilter = "inflow" | "outflow" | "all"

export type TransactionFilterOptions = {
    category?: string,
    type?: TransactionTypeFilter
}

export function useTransactionDatabase() {
    const {triggerRefresh} = useSummaryStore()
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
            "INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed) VALUES ($value, $description, $category, $date_start, $rrule, $date_last_processed)"
        )
        
        try {
            const result = await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $category: data.category,
                $date_start: data.date_start,
                $rrule: data.rrule,
                $date_last_processed: null
            })

            console.log(`Transação recorrente inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData início: ${data.date_start}\nRRULE: ${data.rrule}`)
            
        } catch (error) {
            throw error
        } finally {
            statement.finalizeAsync()
        }
    }

    async function deleteTransaction(id: number) {
        try {
            await database.runAsync("DELETE FROM transactions WHERE id = ?", [id])
        } catch (error) {
            console.error("Could not delete transaction", error)
            throw error
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

    async function getPaginatedFilteredTransactions(page: number, pageSize: number, filterOptions: TransactionFilterOptions = {}) {
        const offset = page*pageSize

        let whereClauses: string[] = []
        let params: (string|number)[] = []

        if(filterOptions.category) {
            whereClauses.push("category = ?")
            params.push(filterOptions.category)
        }

        if(filterOptions.type === "inflow") {
            whereClauses.push("value > 0")
        } else if (filterOptions.type === "outflow") {
            whereClauses.push("value < 0")
        }

        let query = "SELECT * FROM transactions"
        if (whereClauses.length > 0) {
            query += " WHERE " + whereClauses.join(" AND ")
        }

        query += " ORDER BY date DESC, id DESC LIMIT ? OFFSET ?"
        params.push(pageSize, offset)

        try {
            const response = await database.getAllAsync<Transaction>(query, params)
            return response
        } catch (error) {
            console.error("Could not fetch paginated transactions", error)
            throw error
        }
    }

    async function createAndSyncRecurringTransactions() {
        console.log("Iniciando criação e sincronização de transações recorrentes")
        const now = new Date()
        const nowStr = now.toISOString().slice(0, 16)

        try {
            const allRecurringTransactions = await database.getAllAsync<TransactionRecurring>("SELECT * FROM transactions_recurring")

            if(allRecurringTransactions.length === 0) {
                console.log("Não há transações recorrentes")
                return
            }

            for(const blueprint of allRecurringTransactions) {
                //console.log(`RRULE: ${blueprint.rrule}`)
                const rruleOptions = RRule.parseString(blueprint.rrule)
                rruleOptions.dtstart = new Date(`${blueprint.date_start}Z`)
                const rrule = new RRule(rruleOptions)

                const startDateForCheck = blueprint.date_last_processed ? new Date(`${blueprint.date_last_processed}Z`) : new Date(`${blueprint.date_start}Z`)
                //console.log("startDateForCheck: " + startDateForCheck.toISOString())

                const pendingOccurrences = rrule.between(startDateForCheck, now)

                if(pendingOccurrences.length > 0) {
                    console.log(`${pendingOccurrences.length} ocorrências pendentes`)

                    await database.withTransactionAsync(async () => {
                        for(const occurrence of pendingOccurrences) {
                            await database.runAsync("INSERT INTO transactions (value, description, category, date, id_recurring) VALUES (?, ?, ?, ?, ?)",
                                [blueprint.value, blueprint.description, blueprint.category, occurrence.toISOString().slice(0, 16), blueprint.id]
                            )
                            console.log(`Criada transação da transação recorrente ${blueprint.id} no dia ${occurrence.toISOString().slice(0, 16)}`)
                        }
                        await database.runAsync("UPDATE transactions_recurring SET date_last_processed = ? WHERE id = ?",
                            [nowStr, blueprint.id]
                        )
                    })
                }


            }

            console.log("Sincronização concluída.")
        } catch(error) {
            console.error("Erro fatal durante a sincronização de transações recorrentes:", error)
            throw error
        }
    }

    return { createTransaction, createTransactionRecurring, deleteTransaction, getTransactionsFromMonth, getSummaryFromDB, getPaginatedFilteredTransactions, createAndSyncRecurringTransactions }
}