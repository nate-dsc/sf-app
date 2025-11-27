import { prepareOccurrenceDateDBString } from "@/utils/RecurrenceDateUtils";

describe("prepareOccurrenceDateDBString", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    //Data inicial: (local) 2025-11-23T23:00 (utc) 2025-11-24T02:00
    //RRULE: BYMONTHDAY=23
    //Esperado: (local) 2025-11-23T00:00 (utc) 2025-11-23T03:00
    it("Teste 1", () => {
        const occurrenceDate = new Date(Date.UTC(2025,10,27))
        
        const result = prepareOccurrenceDateDBString(occurrenceDate)

        //asserts
        expect(result).toMatch("2025-11-27T03:00")
    })

    it("Teste 2", () => {
        const occurrenceDate = new Date(Date.UTC(2025,10,23))
        
        const result = prepareOccurrenceDateDBString(occurrenceDate)

        //asserts
        expect(result).toMatch("2025-11-23T03:00")
    })

    it("Teste 3", () => {
        const occurrenceDate = new Date(Date.UTC(2025,10,20))
        
        const result = prepareOccurrenceDateDBString(occurrenceDate)

        //asserts
        expect(result).toMatch("2025-11-20T03:00")
    })
    
})