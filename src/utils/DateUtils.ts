import i18n from "@/i18n"

export function timestampedYMDtoLocaleDate (timestampedYMD: string) {
    const UTCstring = timestampedYMD + "Z"
    const date = new Date(UTCstring)
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    } as const
    return date.toLocaleString(i18n.language, options)
}

export function monthShortDate (date: Date) {
    const options = {
        day: 'numeric',
        month: 'short', 
        year: 'numeric'
    } as const
    return date.toLocaleString(i18n.language, options)
}

export function timestampedYMDtoLocaleDateWithoutYear (timestampedYMD: string) {
    const UTCstring = timestampedYMD + "Z"
    const date = new Date(UTCstring)
    const options = {
        day: '2-digit',
        month: '2-digit'
    } as const
    return date.toLocaleString(i18n.language, options)
}

export function timestampedYMDtoLocaleMonthShortDate (timestampedYMD: string) {
    const UTCstring = timestampedYMD + "Z"
    const date = new Date(UTCstring)
    const options = {
        day: 'numeric',
        month: 'short', 
        year: 'numeric'
    } as const
    return date.toLocaleString(i18n.language, options)
}

export function datesToIntervalStrings(initialDate: Date, finalDate: Date): string[] {
    const initial = initialDate
    initial.setHours(0,0,0,0)
    const final = finalDate
    final.setHours(0,0,0,0)
    const idStr = initial.toISOString().slice(0,16)
    const fdStr = final.toISOString().slice(0,16)
    return [idStr, fdStr]
}

export function localToUTC(date: Date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
}