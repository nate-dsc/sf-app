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