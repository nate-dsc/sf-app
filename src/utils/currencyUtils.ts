type FormatCurrencyOptions = {
    locale?: string
    currency?: string
    fromCents?: boolean
    currencySign?: "standard" | "accounting"
    minimumFractionDigits?: number
    maximumFractionDigits?: number
}

export function formatCurrency(
    value: number,
    {
        locale = "en-US",
        currency = locale === "pt-BR" ? "BRL" : "USD",
        fromCents = true,
        currencySign = "standard",
        minimumFractionDigits,
        maximumFractionDigits,
    }: FormatCurrencyOptions = {},
) {
    const amount = fromCents ? value / 100 : value

    return amount.toLocaleString(locale, {
        style: "currency",
        currency,
        currencySign,
        minimumFractionDigits,
        maximumFractionDigits,
    })
}
