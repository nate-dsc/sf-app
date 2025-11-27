
export function formatUTCtoRecurrenceDate(dbDate: Date | string) {
    if(typeof dbDate === "string") {
        const date = new Date(`${dbDate}Z`)
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    }
    return new Date(Date.UTC(dbDate.getFullYear(), dbDate.getMonth(), dbDate.getDate()))
}

export function formatRecurrenceDateToDBString(recurrenceDate: Date) {
    return recurrenceDate
}

export function formatDateToDBString(date: Date) {
    return date.toISOString().slice(0,16)
}

export function formatDBStringToDate(DBString: string) {
    return new Date(`${DBString}Z`)
}

export function getEndOfDay() {
    const endOfDay = new Date()
    endOfDay.setHours(23,59,59)
    return new Date()
}

export function shouldProcessAgain(lastProcessedDate: Date, now: Date) {

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = new Date(
        lastProcessedDate.getFullYear(),
        lastProcessedDate.getMonth(),
        lastProcessedDate.getDate()
    );

    return last < today
}

export function prepareOccurrenceDateDBString(occurrence: Date) {
    const actualUTCDate = new Date(occurrence.getUTCFullYear(), occurrence.getUTCMonth(), occurrence.getUTCDate())
    actualUTCDate.setHours(0,0,0)
    return actualUTCDate.toISOString().slice(0,16)
}