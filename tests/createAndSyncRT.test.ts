// tests/createAndSyncRecurringTransactionsCore.test.ts
import { createAndSyncRecurringTransactionsCore } from "@/database/modules/createAndSyncRT"

// 🔹 Ajuste esses paths pros seus arquivos reais:
import * as rtRepository from "@/database/repositories/RecurringTransactionRepository"
import * as rtUtils from "@/utils/RecurrenceDateUtils"

// Neste teste vamos deixar helpers de data e RRule reais
// Se o path for diferente, ajusta aqui também:
// import * as dateUtils from "../src/utils/date/prepareOccurrenceDateDBString"

jest.mock("@/database/repositories/RecurringTransactionRepository")
jest.mock("@/utils/RecurrenceDateUtils", () => {
    const actual = jest.requireActual("@/utils/RecurrenceDateUtils")
    return {
        ...actual,
        // só this vira mock; o resto continua real
        shouldProcessAgain: jest.fn(),
    }
})

// helper: cria um "database" fake com withTransactionAsync
function createMockDatabase() {
    return {
        withTransactionAsync: jest.fn(async (fn: () => Promise<void>) => {
        await fn()
        }),
    } as any
}

describe("createAndSyncRecurringTransactionsCore", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("não faz nada se não houver recorrências", async () => {
        const database = createMockDatabase()

        ;(rtRepository.fetchRecurringTransactions as jest.Mock).mockResolvedValue([])

        await createAndSyncRecurringTransactionsCore(database, new Date("2025-11-24T02:30Z"))

        expect(rtRepository.fetchRecurringTransactions).toHaveBeenCalledWith(database)
        expect(rtRepository.insertRecurringOcurrence).not.toHaveBeenCalled()
        expect(rtRepository.updateRecurringLastProcessed).not.toHaveBeenCalled()
        expect(database.withTransactionAsync).not.toHaveBeenCalled()
    })

    it("Recorrência no mesmo dia da criação", async () => {
        const database = createMockDatabase()
        const now = new Date("2025-11-24T02:30Z") // local: 2025-11-23T23:30

        ;(rtRepository.fetchRecurringTransactions as jest.Mock).mockResolvedValue([
        {
            id: 10,
            value: 100,
            description: "Netflix",
            category: 1,
            date_start: "2025-11-24T02:00", // local: 2025-11-23T23:00
            date_last_processed: null,
            rrule: "FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=23",
            card_id: null,
            type: "out",
        },
        ])

        // 2) forçamos shouldProcessAgain a sempre true
        //;(rtUtils.shouldProcessAgain as jest.Mock).mockReturnValue(true)

        const insertMock = rtRepository.insertRecurringOcurrence as jest.Mock
        const updateMock = rtRepository.updateRecurringLastProcessed as jest.Mock

        insertMock.mockResolvedValue(undefined)
        updateMock.mockResolvedValue(undefined)

        await createAndSyncRecurringTransactionsCore(database, now)

        // asserts:

        // chamou o fetch
        expect(rtRepository.fetchRecurringTransactions).toHaveBeenCalledWith(database)

        // houve pelo menos uma transação gerada
        expect(insertMock).toHaveBeenCalled()
        expect(database.withTransactionAsync).toHaveBeenCalled()

        const firstInsertCall = insertMock.mock.calls[0]
        const generatedTransaction = firstInsertCall[1]

        expect(generatedTransaction).toMatchObject({
            id: 0,
            value: 100,
            description: "Netflix",
            category: 1,
            date: "2025-11-23T03:00", //local: 2025-11-23T00:00
            id_recurring: 10,
            card_id: null,
            type: "out",
        })
        // data gerada deve ser string em formato de data p/ o DB
        expect(typeof generatedTransaction.date).toBe("string")

        // updated last_processed
        expect(updateMock).toHaveBeenCalledTimes(insertMock.mock.calls.length)
        expect(updateMock.mock.calls[0][0]).toBe(database) // primeiro arg: database
        expect(updateMock.mock.calls[0][1]).toBe(10) // id da recorrência
        expect(typeof updateMock.mock.calls[0][2]).toBe("string") // nowDB string
    })

    it("Recorrência no dia anterior a criação", async () => {
        const database = createMockDatabase()
        const now = new Date("2025-11-25T02:30Z") // local: 2025-11-24T23:30

        ;(rtRepository.fetchRecurringTransactions as jest.Mock).mockResolvedValue([
        {
            id: 10,
            value: 100,
            description: "Netflix",
            category: 1,
            date_start: "2025-11-23T02:00", // local: 2025-11-22T23:00
            date_last_processed: null,
            rrule: "FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=23",
            card_id: null,
            type: "out",
        },
        ])

        const insertMock = rtRepository.insertRecurringOcurrence as jest.Mock
        const updateMock = rtRepository.updateRecurringLastProcessed as jest.Mock

        insertMock.mockResolvedValue(undefined)
        updateMock.mockResolvedValue(undefined)

        await createAndSyncRecurringTransactionsCore(database, now)

        // asserts:

        // chamou o fetch
        expect(rtRepository.fetchRecurringTransactions).toHaveBeenCalledWith(database)

        // houve pelo menos uma transação gerada
        expect(insertMock).toHaveBeenCalled()
        expect(database.withTransactionAsync).toHaveBeenCalled()

        const firstInsertCall = insertMock.mock.calls[0]
        const generatedTransaction = firstInsertCall[1]

        expect(generatedTransaction).toMatchObject({
            id: 0,
            value: 100,
            description: "Netflix",
            category: 1,
            date: "2025-11-23T03:00", //local: 2025-11-23T00:00
            id_recurring: 10,
            card_id: null,
            type: "out",
        })
        // data gerada deve ser string em formato de data p/ o DB
        expect(typeof generatedTransaction.date).toBe("string")

        // updated last_processed
        expect(updateMock).toHaveBeenCalledTimes(insertMock.mock.calls.length)
        expect(updateMock.mock.calls[0][0]).toBe(database) // primeiro arg: database
        expect(updateMock.mock.calls[0][1]).toBe(10) // id da recorrência
        expect(typeof updateMock.mock.calls[0][2]).toBe("string") // nowDB string
    })

    it("Recorrência no dia seguinte a criação", async () => {
        const database = createMockDatabase()
        const now = new Date("2025-11-23T02:30Z") // local: 2025-11-22T23:30

        ;(rtRepository.fetchRecurringTransactions as jest.Mock).mockResolvedValue([
        {
            id: 10,
            value: 100,
            description: "Netflix",
            category: 1,
            date_start: "2025-11-23T02:00", // local: 2025-11-22T23:00
            date_last_processed: null,
            rrule: "FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=23",
            card_id: null,
            type: "out",
        },
        ])

        const insertMock = rtRepository.insertRecurringOcurrence as jest.Mock
        const updateMock = rtRepository.updateRecurringLastProcessed as jest.Mock

        insertMock.mockResolvedValue(undefined)
        updateMock.mockResolvedValue(undefined)

        await createAndSyncRecurringTransactionsCore(database, now)

        // asserts:

        expect(rtRepository.insertRecurringOcurrence).not.toHaveBeenCalled()
        expect(rtRepository.updateRecurringLastProcessed).not.toHaveBeenCalled()
    })

    it("Recorrência no mesmo dia da criação, mas já processada hoje (após a criação)", async () => {
        const database = createMockDatabase()
        const now = new Date("2025-11-24T02:30Z") // local: 2025-11-23T23:30

        ;(rtRepository.fetchRecurringTransactions as jest.Mock).mockResolvedValue([
        {
            id: 10,
            value: 100,
            description: "Netflix",
            category: 1,
            date_start: "2025-11-24T02:00", // local: 2025-11-23T23:00
            date_last_processed: "2025-11-24T02:15",
            rrule: "FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=23",
            card_id: null,
            type: "out",
        },
        ])

        const insertMock = rtRepository.insertRecurringOcurrence as jest.Mock
        const updateMock = rtRepository.updateRecurringLastProcessed as jest.Mock

        insertMock.mockResolvedValue(undefined)
        updateMock.mockResolvedValue(undefined)

        await createAndSyncRecurringTransactionsCore(database, now)

        // asserts:

        expect(rtRepository.insertRecurringOcurrence).not.toHaveBeenCalled()
        expect(rtRepository.updateRecurringLastProcessed).not.toHaveBeenCalled()
    })

    it("Recorrência no mesmo dia da criação, mas já processada hoje (antes da criação)", async () => {
        const database = createMockDatabase()
        const now = new Date("2025-11-24T02:30Z") // local: 2025-11-23T23:30

        ;(rtRepository.fetchRecurringTransactions as jest.Mock).mockResolvedValue([
        {
            id: 10,
            value: 100,
            description: "Netflix",
            category: 1,
            date_start: "2025-11-24T02:00", // local: 2025-11-23T23:00
            date_last_processed: "2025-11-24T01:00",
            rrule: "FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=23",
            card_id: null,
            type: "out",
        },
        ])

        const insertMock = rtRepository.insertRecurringOcurrence as jest.Mock
        const updateMock = rtRepository.updateRecurringLastProcessed as jest.Mock

        insertMock.mockResolvedValue(undefined)
        updateMock.mockResolvedValue(undefined)

        await createAndSyncRecurringTransactionsCore(database, now)

        // asserts:

        expect(rtRepository.insertRecurringOcurrence).not.toHaveBeenCalled()
        expect(rtRepository.updateRecurringLastProcessed).not.toHaveBeenCalled()
    })

    

    it("pula recorrências quando shouldProcessAgain retorna false", async () => {
        const database = createMockDatabase()
        const now = new Date("2025-11-25T12:00:00Z")

        ;(rtRepository.fetchRecurringTransactions as jest.Mock).mockResolvedValue([
        {
            id: 11,
            value: 50,
            description: "Spotify",
            category: 2,
            date_start: "2025-11-20T00:00:00",
            date_last_processed: "2025-11-25T00:00:00",
            rrule: "FREQ=DAILY;INTERVAL=1",
            card_id: null,
            type: "out",
        },
        ])

        ;(rtUtils.shouldProcessAgain as jest.Mock).mockReturnValue(false)

        await createAndSyncRecurringTransactionsCore(database, now)

        expect(rtRepository.insertRecurringOcurrence).not.toHaveBeenCalled()
        expect(rtRepository.updateRecurringLastProcessed).not.toHaveBeenCalled()
    })
})
