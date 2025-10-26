import { useStyle } from "@/context/StyleContext"
import { useSummaryStore } from "@/stores/useSummaryStore"
import { CCard, NewCard, RecurringTransaction, SearchFilters, Summary, Transaction } from "@/types/transaction"
import { getColorFromID } from "@/utils/CardUtils"
import { localToUTC } from "@/utils/DateUtils"
import { useSQLiteContext } from "expo-sqlite"
import { RRule } from "rrule"


export function useTransactionDatabase() {
    const {triggerRefresh} = useSummaryStore()
    const {theme} = useStyle()
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

    async function createRecurringTransaction(data: RecurringTransaction) {
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

    async function createCard(data: NewCard) {
        const statement = "INSERT INTO cards (name, color, card_limit, limit_used, closing_day, due_day, ign_wknd) VALUES (?,?,?,?,?,?,?)"

        const params = [data.name, data.color, data.limit, 0, data.closingDay, data.dueDay, data.ignoreWeekends]

        try {
            const result = await database.runAsync(statement, params)
        } catch (error) {
            console.log("Não foi possivel adicionar o cartão")
            throw error
        }
    }

    async function getCards(): Promise<CCard[]> {
        try {
            const cards = await database.getAllAsync<{
                id: number
                name: string
                color: number
                card_limit: number
                limit_used: number
                closing_day: number
                due_day: number
                ign_wknd: number
            }>("SELECT * FROM cards")

            return cards.map((card) => ({
                id: card.id,
                name: card.name,
                limit: card.card_limit,
                limitUsed: card.limit_used,
                color: getColorFromID(card.color, theme),
                closingDay: card.closing_day,
                dueDay: card.due_day,
                ignoreWeekends: !!card.ign_wknd
            }))
        } catch (error) {
            console.error("Could not fetch cards", error)
            throw error
        }
    }

    async function getCard(cardId: number): Promise<CCard | null> {
        try {
            const card = await database.getFirstAsync<{
                id: number
                name: string
                color: number
                card_limit: number
                limit_used: number
                closing_day: number
                due_day: number
                ign_wknd: number
            }>("SELECT * FROM cards WHERE id = ?", [cardId])

            if (!card) {
                return null
            }

            return {
                id: card.id,
                name: card.name,
                limit: card.card_limit,
                limitUsed: card.limit_used,
                color: getColorFromID(card.color, theme),
                closingDay: card.closing_day,
                dueDay: card.due_day,
                ignoreWeekends: !!card.ign_wknd,
            }
        } catch (error) {
            console.error("Could not fetch card", error)
            throw error
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

    async function deleteRecurringTransaction(id: number) {
        try {
            await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [id])
        } catch (error) {
            console.error("Could not delete recurring transaction", error)
            throw error
        }

    }

    async function deleteRecurringTransactionCascade(id: number) {
        try {
            await database.withTransactionAsync(async () => {
                await database.runAsync("DELETE FROM transactions WHERE id_recurring = ?", [id])
                await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [id])
            })
        } catch (error) {
            console.error("Could not delete recurring transaction cascade", error)
            throw error
        }
    }

    async function deleteCard(id: number) {
        try {
            await database.runAsync("DELETE FROM cards WHERE id = ?", [id])
        } catch (error) {
            console.error("Could not delete card", error)
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

    async function getPaginatedFilteredTransactions(page: number, pageSize: number, filterOptions: SearchFilters = {}) {
        const offset = page*pageSize

        let whereClauses: string[] = []
        let params: (string|number)[] = []

        if (filterOptions.textSearch && filterOptions.textSearch.trim() !== "") {
            whereClauses.push("description LIKE ?");
            params.push(`%${filterOptions.textSearch.trim()}%`);
        }

        if (filterOptions.category && filterOptions.category.length > 0) {
            // Cria uma string com a quantidade correta de placeholders: (?, ?, ?)
            const placeholders = filterOptions.category.map(() => "?").join(", ");
            whereClauses.push(`category IN (${placeholders})`);
            // Adiciona todos os IDs de categoria ao array de parâmetros
            params.push(...filterOptions.category);
        }

        if(filterOptions.type === "inflow") {
            whereClauses.push("value > 0")
        } else if (filterOptions.type === "outflow") {
            whereClauses.push("value < 0")
        }

        if (filterOptions.minValue !== undefined) {
            if (filterOptions.type === "inflow") {
                whereClauses.push("value >= ?");
                params.push(filterOptions.minValue);
            } else if (filterOptions.type === "outflow") {
                whereClauses.push("value <= ?");
                params.push(-filterOptions.minValue);
            } else { // all
                whereClauses.push("(value >= ? OR value <= ?)");
                params.push(filterOptions.minValue, -filterOptions.minValue);
            }
        }

        if (filterOptions.maxValue !== undefined) {
            if (filterOptions.type === "inflow") {
                whereClauses.push("value <= ?");
                params.push(filterOptions.maxValue);
            } else if (filterOptions.type === "outflow") {
                whereClauses.push("value >= ?");
                params.push(-filterOptions.maxValue);
            } else { // all
                whereClauses.push("(value <= ? OR value >= ?)");
                params.push(filterOptions.maxValue, -filterOptions.maxValue);
            }
        }

        if (filterOptions.dateFilterActive && filterOptions.initialDate && filterOptions.finalDate) {
            whereClauses.push("date BETWEEN ? AND ?");
            params.push(
                filterOptions.initialDate.toISOString().slice(0, 16),
                filterOptions.finalDate.toISOString().slice(0, 16)
            );
        }

        let query = "SELECT * FROM transactions"
        if (whereClauses.length > 0) {
            query += " WHERE " + whereClauses.join(" AND ")
        }

        const sortBy = filterOptions.sortBy === "value" ? "value" : "date"; // Whitelist
        const orderBy = filterOptions.orderBy === "asc" ? "ASC" : "DESC";   // Whitelist
        
        // Adiciona a ordenação principal e uma secundária para desempate
        query += ` ORDER BY ${sortBy} ${orderBy}, id DESC`;
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
        const newEndOfDay = new Date()
        newEndOfDay.setHours(23,59,59)
        const newEndOfDayStr = newEndOfDay.toISOString().slice(0, 16)

        try {
            const allRecurringTransactions = await database.getAllAsync<RecurringTransaction>("SELECT * FROM transactions_recurring")

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

                const pendingOccurrences = rrule.between(startDateForCheck, newEndOfDay)

                if(pendingOccurrences.length > 0) {
                    console.log(`${pendingOccurrences.length} ocorrências pendentes`)

                    await database.withTransactionAsync(async () => {
                        for(const occurrence of pendingOccurrences) {
                            occurrence.setHours(0,0,0)
                            await database.runAsync("INSERT INTO transactions (value, description, category, date, id_recurring) VALUES (?, ?, ?, ?, ?)",
                                [blueprint.value, blueprint.description, blueprint.category, occurrence.toISOString().slice(0, 16), blueprint.id]
                            )
                            console.log(`Criada transação da transação recorrente ${blueprint.id} no dia ${occurrence.toISOString().slice(0, 16)}`)
                        }
                        await database.runAsync("UPDATE transactions_recurring SET date_last_processed = ? WHERE id = ?",
                            [newEndOfDayStr, blueprint.id]
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

    async function getRRULE(id: number): Promise<string> {
        try {
            const parentTransaction = await database.getAllAsync<RecurringTransaction>("SELECT * FROM transactions_recurring WHERE id = ?",[id])

            return parentTransaction[0].rrule

        } catch(error) {
            console.error("Erro na busca por transação recorrente:", error)
            throw error
        }
    }

    async function getRecurringIncomeTransactions() {
        try {
            const result = await database.getAllAsync<RecurringTransaction>("SELECT * FROM transactions_recurring WHERE value > 0")
            return result
        } catch (error) {
            console.log("Não foi possível recuperar as transações recorrentes")
            throw error
        }
    }

    async function getRecurringSummaryThisMonth(flowType: "inflow" | "outflow") {
        const now = new Date()

        const startLocal = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
        const endLocal = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

        const startUTC = localToUTC(startLocal)
        const endUTC = localToUTC(endLocal)


        let totalRecurringIncome = 0

        const query = flowType === "outflow" ? "SELECT * FROM transactions_recurring WHERE value < 0" : "SELECT * FROM transactions_recurring WHERE value > 0"

        try {
            const recurringIncomeTransactions = await database.getAllAsync<RecurringTransaction>(query)

            for(const recurringTransaction of recurringIncomeTransactions) {
                const rruleOptions = RRule.parseString(recurringTransaction.rrule)
                rruleOptions.dtstart = new Date(`${recurringTransaction.date_start}Z`)
                const rrule = new RRule(rruleOptions)

                const pendingOccurrences = rrule.between(startUTC, endUTC, true)

                if(pendingOccurrences.length > 0) {
                    totalRecurringIncome += recurringTransaction.value * pendingOccurrences.length
                }
            }

            return {totalRecurringIncome, recurringIncomeTransactions}

        } catch (error) {
            console.log("Não foi possível recuperar o sumário das transações recorrentes")
            throw error
        }
    }

    return {
        createTransaction,
        createRecurringTransaction,
        createCard,
        getCards,
        getCard,
        deleteTransaction,
        deleteRecurringTransaction,
        deleteRecurringTransactionCascade,
        getTransactionsFromMonth,
        getSummaryFromDB,
        getPaginatedFilteredTransactions,
        createAndSyncRecurringTransactions,
        getRRULE,
        getRecurringSummaryThisMonth
    }
}
