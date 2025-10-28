import { useStyle } from "@/context/StyleContext"
import { useBudgetStore } from "@/stores/useBudgetStore"
import { BudgetMonthlyPerformance, BudgetPeriod, CCard, CategoryDistributionFilters, InstallmentPurchaseInput, MonthlyCategoryAggregate, NewCard, RecurringTransaction, SearchFilters, Summary, Transaction } from "@/types/transaction"
import { getColorFromID } from "@/utils/CardUtils"
import { localToUTC } from "@/utils/DateUtils"
import { useCallback, useMemo } from "react"
import { RRule } from "rrule"
import { useDatabase } from "./useDatabase"


export function useTransactionDatabase() {
    const {theme} = useStyle()
    const { database } = useDatabase()

    type CategoryDistributionRow = {
        categoryId: number
        categoryName: string
        flow: string
        color: string | null
        totalValue: number | null
    }

    const createTransaction = useCallback(async (data: Transaction) => {
        const statement = await database.prepareAsync(
            "INSERT INTO transactions (value, description, category, date, flow, account_id, payee_id, notes) VALUES ($value, $description, $category, $date, $flow, $account_id, $payee_id, $notes)"
        )

        const flow = data.flow ?? (data.value >= 0 ? "inflow" : "outflow")

        try {
            await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $category: Number(data.category),
                $date: data.date,
                $flow: flow,
                $account_id: data.account_id ?? null,
                $payee_id: data.payee_id ?? null,
                $notes: data.notes ?? null,
            })

            console.log(`Transação única inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData: ${data.date}\nFluxo: ${flow}`)

        } catch (error) {
            throw error
        } finally {
            statement.finalizeAsync()
        }
    }, [database])

    const createTransactionWithCard = useCallback(async (data: Transaction, cardId: number) => {
        try {
            await database.withTransactionAsync(async () => {
                await database.runAsync(
                    "INSERT INTO transactions (value, description, category, date, card_id, flow, account_id, payee_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        data.value,
                        data.description,
                        Number(data.category),
                        data.date,
                        cardId,
                        data.flow ?? (data.value >= 0 ? "inflow" : "outflow"),
                        data.account_id ?? null,
                        data.payee_id ?? null,
                        data.notes ?? null,
                    ]
                )

                const limitAdjustment = data.value < 0 ? Math.abs(data.value) : -Math.abs(data.value)

                if (limitAdjustment !== 0) {
                    await database.runAsync(
                        "UPDATE cards SET limit_used = limit_used + ? WHERE id = ?",
                        [limitAdjustment, cardId]
                    )
                }
            })

            console.log(`Transação com cartão inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData: ${data.date}\nCartão: ${cardId}`)
        } catch (error) {
            throw error
        }
    }, [database])

    const createInstallmentPurchase = useCallback(async (data: InstallmentPurchaseInput) => {
        const resolveFirstOccurrence = (purchaseDay: number) => {
            const now = new Date()
            now.setHours(0, 0, 0, 0)

            const currentMonthDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

            if (purchaseDay <= currentMonthDays) {
                return new Date(now.getFullYear(), now.getMonth(), purchaseDay, 0, 0, 0, 0)
            }

            let year = now.getFullYear()
            let month = now.getMonth() - 1

            while (true) {
                if (month < 0) {
                    month = 11
                    year -= 1
                }

                const daysInMonth = new Date(year, month + 1, 0).getDate()

                if (purchaseDay <= daysInMonth) {
                    return new Date(year, month, purchaseDay, 0, 0, 0, 0)
                }

                month -= 1
            }
        }

        try {
            await database.withTransactionAsync(async () => {
                const firstOccurrence = resolveFirstOccurrence(data.purchaseDay)
                const firstOccurrenceStr = firstOccurrence.toISOString().slice(0, 16)

                const rrule = new RRule({
                    freq: RRule.MONTHLY,
                    count: data.installmentsCount,
                })

                const description = data.description.trim()

                await database.runAsync(
                    "INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed, card_id, is_installment, account_id, payee_id, flow, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        -Math.abs(data.installmentValue),
                        description,
                        Number(data.category),
                        firstOccurrenceStr,
                        rrule.toString(),
                        null,
                        data.cardId,
                        1,
                        null,
                        null,
                        "outflow",
                        null,
                    ]
                )

                const totalValue = data.installmentValue * data.installmentsCount

                await database.runAsync(
                    "UPDATE cards SET limit_used = limit_used + ? WHERE id = ?",
                    [totalValue, data.cardId]
                )
            })

            console.log("Compra parcelada registrada com sucesso")
        } catch (error) {
            console.error("Falha ao registrar compra parcelada", error)
            throw error
        }
    }, [database])

    const createRecurringTransaction = useCallback(async (data: RecurringTransaction) => {
        const statement = await database.prepareAsync(
            "INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed, card_id, account_id, payee_id, flow, notes, is_installment) VALUES ($value, $description, $category, $date_start, $rrule, $date_last_processed, $card_id, $account_id, $payee_id, $flow, $notes, $is_installment)"
        )

        const flow = data.flow ?? (data.value >= 0 ? "inflow" : "outflow")

        try {
            await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $category: Number(data.category),
                $date_start: data.date_start,
                $rrule: data.rrule,
                $date_last_processed: null,
                $card_id: data.card_id ?? null,
                $account_id: data.account_id ?? null,
                $payee_id: data.payee_id ?? null,
                $flow: flow,
                $notes: data.notes ?? null,
                $is_installment: data.is_installment ?? 0,
            })

            console.log(`Transação recorrente inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData início: ${data.date_start}\nRRULE: ${data.rrule}\nFluxo: ${flow}`)

        } catch (error) {
            throw error
        } finally {
            statement.finalizeAsync()
        }
    }, [database])

    const createRecurringTransactionWithCard = useCallback(async (data: RecurringTransaction, cardId: number) => {
        const statement = await database.prepareAsync(
            "INSERT INTO transactions_recurring (value, description, category, date_start, rrule, date_last_processed, card_id, account_id, payee_id, flow, notes, is_installment) VALUES ($value, $description, $category, $date_start, $rrule, $date_last_processed, $card_id, $account_id, $payee_id, $flow, $notes, $is_installment)"
        )

        try {
            await statement.executeAsync({
                $value: data.value,
                $description: data.description,
                $category: Number(data.category),
                $date_start: data.date_start,
                $rrule: data.rrule,
                $date_last_processed: null,
                $card_id: cardId,
                $account_id: data.account_id ?? null,
                $payee_id: data.payee_id ?? null,
                $flow: data.flow ?? (data.value >= 0 ? "inflow" : "outflow"),
                $notes: data.notes ?? null,
                $is_installment: data.is_installment ?? 0,
            })

            console.log(`Transação recorrente com cartão inserida:\nValor: ${data.value}\nDescrição: ${data.description}\nCategoria: ${data.category}\nData início: ${data.date_start}\nRRULE: ${data.rrule}\nCartão: ${cardId}`)
        } catch (error) {
            throw error
        } finally {
            statement.finalizeAsync()
        }
    }, [database])

    const createCard = useCallback(async (data: NewCard) => {
        const statement = "INSERT INTO cards (name, color, card_limit, limit_used, closing_day, due_day, ign_wknd) VALUES (?,?,?,?,?,?,?)"

        const params = [data.name, data.color, data.limit, 0, data.closingDay, data.dueDay, data.ignoreWeekends]

        try {
            await database.runAsync(statement, params)
        } catch (error) {
            console.log("Não foi possivel adicionar o cartão")
            throw error
        }
    }, [database])

    const getCards = useCallback(async (): Promise<CCard[]> => {
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
    }, [database, theme])

    const getCard = useCallback(async (cardId: number): Promise<CCard | null> => {
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
    }, [database, theme])

    const deleteTransaction = useCallback(async (id: number) => {
        try {
            await database.runAsync("DELETE FROM transactions WHERE id = ?", [id])
        } catch (error) {
            console.error("Could not delete transaction", error)
            throw error
        }

    }, [database])

    const deleteRecurringTransaction = useCallback(async (id: number) => {
        try {
            await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [id])
        } catch (error) {
            console.error("Could not delete recurring transaction", error)
            throw error
        }

    }, [database])

    const deleteRecurringTransactionCascade = useCallback(async (id: number) => {
        try {
            await database.withTransactionAsync(async () => {
                await database.runAsync("DELETE FROM transactions WHERE id_recurring = ?", [id])
                await database.runAsync("DELETE FROM transactions_recurring WHERE id = ?", [id])
            })
        } catch (error) {
            console.error("Could not delete recurring transaction cascade", error)
            throw error
        }
    }, [database])

    async function deleteCard(id: number) {
        try {
            await database.runAsync("DELETE FROM cards WHERE id = ?", [id])
        } catch (error) {
            console.error("Could not delete card", error)
            throw error
        }
    }

    const getTransactionsFromMonth = useCallback(async (YMString: string, orderBy: "day" | "id") => {
        const orderStr = orderBy === "id" ? "id" : "CAST(strftime('%d', date) AS INTEGER)"

        try {
            const query = `SELECT * FROM transactions WHERE strftime('%Y-%m', date) = ${YMString} ORDER BY ${orderStr}`

            const response = await database.getAllAsync<Transaction>(query)

            return response
        } catch (error) {
            console.log("Could not find transactions by month")
            throw error
        }
    }, [database])

    const calculateBudgetSpent = useCallback(async (period: BudgetPeriod) => {
        const now = new Date()
        const end = new Date(now)
        end.setHours(0, 0, 0, 0)

        const start = new Date(end)

        if (period === "weekly") {
            start.setDate(start.getDate() - 6)
        } else if (period === "biweekly") {
            start.setDate(start.getDate() - 13)
        } else {
            start.setDate(1)
        }

        const startISO = start.toISOString().slice(0, 10)
        const endISO = end.toISOString().slice(0, 10)

        const result = await database.getFirstAsync<{ total: number | null }>(
            "SELECT SUM(value) as total FROM transactions WHERE flow = 'outflow' AND date(date) BETWEEN ? AND ?",
            [startISO, endISO]
        )

        const rawTotal = result?.total ?? 0
        return Math.abs(rawTotal);
    }, [database])

    const getSummaryFromDB = useCallback(async (): Promise<Summary> => {
        // Lógica para obter o mês anterior no formato YYYY-MM
        const today = new Date();
        // Leva a data para o primeiro dia do mês atual e depois subtrai 1 dia para ir para o último dia do mês anterior
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const currentMonthStr = `${year}-${month}`;

        try {
            // Query para somar todas as transações positivas (entradas) do mês anterior
            const inflowResult = await database.getFirstAsync<{ total: number }>(
                "SELECT SUM(value) as total FROM transactions WHERE flow = 'inflow' AND strftime('%Y-%m', date) = ?",
                [currentMonthStr]
            );

            // Query para somar todas as transações negativas (saídas) do mês anterior
            const outflowResult = await database.getFirstAsync<{ total: number }>(
                "SELECT SUM(value) as total FROM transactions WHERE flow = 'outflow' AND strftime('%Y-%m', date) = ?",
                [currentMonthStr]
            );
            
            // Query para buscar a transação mais recente
            const lastTransactionResult = await database.getFirstAsync<Transaction>(
                "SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT 1"
            );

            const budgetState = useBudgetStore.getState().budget;

            let budgetSnapshot: Summary["budget"] = null;

            if (budgetState) {
                const spentCents = await calculateBudgetSpent(budgetState.period);
                budgetSnapshot = {
                    period: budgetState.period,
                    amountCents: budgetState.amountCents,
                    spentCents,
                };
            }

            const summaryData: Summary = {
                // Usa ?? 0 para garantir que o valor seja um número caso não haja transações
                inflowCurrentMonth: inflowResult?.total ?? 0,
                // Multiplica por -1 para tornar o valor positivo
                outflowCurrentMonth: (outflowResult?.total ?? 0) * -1,
                lastTransaction: lastTransactionResult || null, // Garante que seja null se não houver transação
                budget: budgetSnapshot,
            };

            return summaryData;

        } catch (error) {
            console.error("Falha ao buscar dados do sumário:", error);
            throw error;
        }
    }, [calculateBudgetSpent, database])

    const getMonthlyCategoryDistribution = useCallback(async (
        filters: CategoryDistributionFilters = {}
    ): Promise<MonthlyCategoryAggregate[]> => {
        const targetDate = filters.month ? new Date(filters.month) : new Date()
        const year = targetDate.getFullYear()
        const month = (targetDate.getMonth() + 1).toString().padStart(2, "0")
        const monthKey = `${year}-${month}`

        const whereClauses = ["strftime('%Y-%m', t.date) = ?"]
        const params: (string | number)[] = [monthKey]

        if (filters.flow) {
            whereClauses.push("c.flow = ?")
            params.push(filters.flow)
        }

        const whereStatement = `WHERE ${whereClauses.join(" AND ")}`

        try {
            const rows = await database.getAllAsync<CategoryDistributionRow>(
                `SELECT
                    c.id AS categoryId,
                    c.name AS categoryName,
                    c.flow AS flow,
                    c.color AS color,
                    SUM(t.value) AS totalValue
                FROM transactions t
                INNER JOIN categories c ON c.id = t.category
                ${whereStatement}
                GROUP BY c.id, c.name, c.flow, c.color`,
                params
            )

            return rows
                .map((row) => {
                    const rawTotal = typeof row.totalValue === "number" ? row.totalValue : Number(row.totalValue ?? 0)
                    const normalizedTotal = row.flow === "outflow" ? Math.abs(rawTotal) : rawTotal
                    const safeTotal = Number.isFinite(normalizedTotal) ? normalizedTotal : 0

                    return {
                        categoryId: row.categoryId,
                        name: row.categoryName,
                        color: row.color ?? null,
                        flow: row.flow === "outflow" ? "outflow" : "inflow",
                        total: safeTotal,
                    } satisfies MonthlyCategoryAggregate
                })
                .filter((entry) => entry.total > 0)
        } catch (error) {
            console.error("Falha ao buscar distribuição mensal por categoria:", error)
            throw error
        }
    }, [database])

    const getBudgetMonthlyPerformance = useCallback(
        async (options: { months?: number } = {}): Promise<BudgetMonthlyPerformance[]> => {
            const budgetState = useBudgetStore.getState().budget

            if (!budgetState) {
                return []
            }

            const monthsToFetch = Math.max(options.months ?? 6, 1)
            const monthKeys: string[] = []

            const referenceDate = new Date()
            referenceDate.setDate(1)
            referenceDate.setHours(0, 0, 0, 0)

            for (let index = 0; index < monthsToFetch; index += 1) {
                const target = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - index, 1)
                const year = target.getFullYear()
                const month = (target.getMonth() + 1).toString().padStart(2, "0")
                monthKeys.push(`${year}-${month}`)
            }

            type MonthlyTotalRow = { monthKey: string; totalValue: number | null }

            const placeholders = monthKeys.map(() => "?").join(", ")

            let totals: MonthlyTotalRow[] = []

            if (monthKeys.length > 0) {
                totals = await database.getAllAsync<MonthlyTotalRow>(
                    `SELECT strftime('%Y-%m', date) as monthKey, SUM(value) as totalValue
                    FROM transactions
                    WHERE flow = 'outflow' AND strftime('%Y-%m', date) IN (${placeholders})
                    GROUP BY monthKey`,
                    monthKeys
                )
            }

            const totalsMap = new Map<string, number>()

            totals.forEach((row) => {
                if (!row?.monthKey) {
                    return
                }

                const rawTotal = typeof row.totalValue === "number" ? row.totalValue : Number(row.totalValue ?? 0)
                totalsMap.set(row.monthKey, Math.abs(rawTotal))
            })

            const convertBudgetToMonthly = (period: BudgetPeriod, amountCents: number) => {
                if (amountCents <= 0) {
                    return 0
                }

                if (period === "monthly") {
                    return amountCents
                }

                if (period === "biweekly") {
                    return Math.round((amountCents * 26) / 12)
                }

                return Math.round((amountCents * 52) / 12)
            }

            const monthlyBudgetCents = convertBudgetToMonthly(budgetState.period, budgetState.amountCents)

            return monthKeys.map((monthKey) => {
                const spentCents = totalsMap.get(monthKey) ?? 0
                const differenceCents = monthlyBudgetCents - spentCents

                return {
                    monthKey,
                    budgetCents: monthlyBudgetCents,
                    spentCents,
                    differenceCents,
                }
            })
        },
        [database]
    )

    const getPaginatedFilteredTransactions = useCallback(async (page: number, pageSize: number, filterOptions: SearchFilters = {}) => {
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
            whereClauses.push("flow = 'inflow'")
        } else if (filterOptions.type === "outflow") {
            whereClauses.push("flow = 'outflow'")
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
        query += ` ORDER BY ${sortBy} ${orderBy}, id DESC LIMIT ? OFFSET ?`;
        params.push(pageSize, offset)

        try {
            const response = await database.getAllAsync<Transaction>(query, params)
            return response
        } catch (error) {
            console.error("Could not fetch paginated transactions", error)
            throw error
        }
    }, [database])

    const createAndSyncRecurringTransactions = useCallback(async () => {
        console.log("Iniciando criação e sincronização de transações recorrentes")
        const newEndOfDay = new Date()
        newEndOfDay.setHours(23,59,59)
        const newEndOfDayStr = newEndOfDay.toISOString().slice(0, 16)

        try {
            const allRecurringTransactions = await database.getAllAsync<RecurringTransaction>(
                "SELECT * FROM transactions_recurring WHERE is_installment = 0 OR is_installment IS NULL"
            )

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

                const pendingOccurrences = rrule.between(startDateForCheck, newEndOfDay, true)
                console.log(`rrule: ${rrule.toString()}`)
                console.log(`pendingocurrences: ${pendingOccurrences.toString()}`)

                if(pendingOccurrences.length > 0) {
                    console.log(`${pendingOccurrences.length} ocorrências pendentes`)

                    await database.withTransactionAsync(async () => {
                        for(const occurrence of pendingOccurrences) {
                            occurrence.setHours(0,0,0)
                            await database.runAsync(
                                "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, account_id, payee_id, flow, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                [
                                    blueprint.value,
                                    blueprint.description,
                                    blueprint.category,
                                    occurrence.toISOString().slice(0, 16),
                                    blueprint.id,
                                    blueprint.card_id ?? null,
                                    blueprint.account_id ?? null,
                                    blueprint.payee_id ?? null,
                                    blueprint.flow ?? (blueprint.value >= 0 ? "inflow" : "outflow"),
                                    blueprint.notes ?? null,
                                ]
                            )

                            if (blueprint.card_id) {
                                const limitAdjustment = blueprint.value < 0 ? Math.abs(blueprint.value) : -Math.abs(blueprint.value)

                                if (limitAdjustment !== 0) {
                                    await database.runAsync(
                                        "UPDATE cards SET limit_used = limit_used + ? WHERE id = ?",
                                        [limitAdjustment, blueprint.card_id]
                                    )
                                }
                            }

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
    }, [database])

    const createAndSyncInstallmentPurchases = useCallback(async () => {
        console.log("Sincronizando compras parceladas")
        const endOfDay = new Date()
        endOfDay.setHours(23,59,59,0)
        const endOfDayTimestamp = endOfDay.getTime()

        const calculateDueDate = (purchaseDate: Date, dueDay: number) => {
            const purchaseDay = purchaseDate.getDate()

            let dueYear = purchaseDate.getFullYear()
            let dueMonth = purchaseDate.getMonth()

            const daysInCurrentMonth = new Date(dueYear, dueMonth + 1, 0).getDate()
            const dueDayThisMonth = Math.min(dueDay, daysInCurrentMonth)

            if (dueDayThisMonth >= purchaseDay) {
                return new Date(dueYear, dueMonth, dueDayThisMonth, 0, 0, 0, 0)
            }

            dueMonth += 1
            if (dueMonth > 11) {
                dueMonth = 0
                dueYear += 1
            }

            const daysInNextMonth = new Date(dueYear, dueMonth + 1, 0).getDate()
            const adjustedDueDay = Math.min(dueDay, daysInNextMonth)

            return new Date(dueYear, dueMonth, adjustedDueDay, 0, 0, 0, 0)
        }

        try {
            const installmentBlueprints = await database.getAllAsync<RecurringTransaction>(
                "SELECT * FROM transactions_recurring WHERE is_installment = 1"
            )

            if (installmentBlueprints.length === 0) {
                return
            }

            for (const blueprint of installmentBlueprints) {
                if (!blueprint.card_id) {
                    console.warn(`Compra parcelada ${blueprint.id} sem cartão associado foi ignorada.`)
                    continue
                }

                const card = await database.getFirstAsync<{
                    due_day: number
                }>("SELECT due_day FROM cards WHERE id = ?", [blueprint.card_id])

                if (!card) {
                    console.warn(`Cartão ${blueprint.card_id} não encontrado para compra parcelada ${blueprint.id}`)
                    continue
                }

                const rruleOptions = RRule.parseString(blueprint.rrule)
                rruleOptions.dtstart = new Date(`${blueprint.date_start}Z`)
                const rrule = new RRule(rruleOptions)
                const allOccurrences = rrule.all()

                const existingCountRow = await database.getFirstAsync<{ total: number }>(
                    "SELECT COUNT(*) as total FROM transactions WHERE id_recurring = ?",
                    [blueprint.id]
                )

                let generatedCount = existingCountRow?.total ?? 0

                if (generatedCount >= allOccurrences.length) {
                    continue
                }

                await database.withTransactionAsync(async () => {
                    for (let index = generatedCount; index < allOccurrences.length; index++) {
                        const occurrence = new Date(allOccurrences[index].getTime())
                        occurrence.setHours(0, 0, 0, 0)

                        const dueDate = calculateDueDate(occurrence, card.due_day)

                        if (dueDate.getTime() > endOfDayTimestamp) {
                            break
                        }

                        const dueDateStr = dueDate.toISOString().slice(0, 16)

                        await database.runAsync(
                            "INSERT INTO transactions (value, description, category, date, id_recurring, card_id, account_id, payee_id, flow, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                            [
                                blueprint.value,
                                blueprint.description,
                                blueprint.category,
                                dueDateStr,
                                blueprint.id,
                                blueprint.card_id ?? null,
                                blueprint.account_id ?? null,
                                blueprint.payee_id ?? null,
                                blueprint.flow ?? (blueprint.value >= 0 ? "inflow" : "outflow"),
                                blueprint.notes ?? null,
                            ]
                        )

                        await database.runAsync(
                            "UPDATE transactions_recurring SET date_last_processed = ? WHERE id = ?",
                            [dueDateStr, blueprint.id]
                        )

                        generatedCount += 1
                    }
                })
            }

            console.log("Sincronização de compras parceladas concluída")
        } catch (error) {
            console.error("Erro ao sincronizar compras parceladas:", error)
            throw error
        }
    }, [database])

    const getRRULE = useCallback(async (id: number): Promise<string> => {
        try {
            const parentTransaction = await database.getAllAsync<RecurringTransaction>("SELECT * FROM transactions_recurring WHERE id = ?",[id])

            return parentTransaction[0].rrule

        } catch(error) {
            console.error("Erro na busca por transação recorrente:", error)
            throw error
        }
    }, [database])

    async function getRecurringIncomeTransactions() {
        try {
            const result = await database.getAllAsync<RecurringTransaction>("SELECT * FROM transactions_recurring WHERE flow = 'inflow'")
            return result
        } catch (error) {
            console.log("Não foi possível recuperar as transações recorrentes")
            throw error
        }
    }

    const getRecurringSummaryThisMonth = useCallback(async (flowType: "inflow" | "outflow") => {
        const now = new Date()

        const startLocal = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
        const endLocal = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

        const startUTC = localToUTC(startLocal)
        const endUTC = localToUTC(endLocal)


        let totalRecurring = 0
        const categoryTotalsMap = new Map<number, number>()

        const query = flowType === "outflow" ? "SELECT * FROM transactions_recurring WHERE flow = 'outflow'" : "SELECT * FROM transactions_recurring WHERE flow = 'inflow'"

        try {
            const recurringTransactions = await database.getAllAsync<RecurringTransaction>(query)

            for(const recurringTransaction of recurringTransactions) {
                const rruleOptions = RRule.parseString(recurringTransaction.rrule)
                rruleOptions.dtstart = new Date(`${recurringTransaction.date_start}Z`)
                const rrule = new RRule(rruleOptions)

                const pendingOccurrences = rrule.between(startUTC, endUTC, true)
                console.log(`rrule: ${rrule.toString()}`)
                console.log(`pendingocurrences: ${pendingOccurrences.toString()}`)

                if(pendingOccurrences.length > 0) {
                    const transactionTotal = recurringTransaction.value * pendingOccurrences.length
                    totalRecurring += transactionTotal

                    const currentCategoryTotal = categoryTotalsMap.get(recurringTransaction.category) ?? 0
                    categoryTotalsMap.set(recurringTransaction.category, currentCategoryTotal + transactionTotal)
                }
            }

            const categoryTotals: Record<number, number> = {}

            categoryTotalsMap.forEach((value, key) => {
                categoryTotals[key] = value
            })

            return {totalRecurring, recurringTransactions, categoryTotals}

        } catch (error) {
            console.log("Não foi possível recuperar o sumário das transações recorrentes")
            throw error
        }
    }, [database])

    const databaseMethods = useMemo(() => ({
        createTransaction,
        createRecurringTransaction,
        createTransactionWithCard,
        createRecurringTransactionWithCard,
        createInstallmentPurchase,
        createCard,
        getCards,
        getCard,
        deleteTransaction,
        deleteRecurringTransaction,
        deleteRecurringTransactionCascade,
        getTransactionsFromMonth,
        getSummaryFromDB,
        getMonthlyCategoryDistribution,
        getBudgetMonthlyPerformance,
        getPaginatedFilteredTransactions,
        createAndSyncRecurringTransactions,
        createAndSyncInstallmentPurchases,
        getRRULE,
        getRecurringSummaryThisMonth,
    }), [
        createTransaction,
        createRecurringTransaction,
        createTransactionWithCard,
        createRecurringTransactionWithCard,
        createInstallmentPurchase,
        createCard,
        getCards,
        getCard,
        deleteTransaction,
        deleteRecurringTransaction,
        deleteRecurringTransactionCascade,
        getTransactionsFromMonth,
        getSummaryFromDB,
        getMonthlyCategoryDistribution,
        getBudgetMonthlyPerformance,
        getPaginatedFilteredTransactions,
        createAndSyncRecurringTransactions,
        createAndSyncInstallmentPurchases,
        getRRULE,
        getRecurringSummaryThisMonth,
    ])

    return databaseMethods
}
