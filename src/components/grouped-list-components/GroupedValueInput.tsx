
import { useStyle } from "@/context/StyleContext"
import i18n from "@/i18n"
import { type TransactionType } from "@/types/transaction"
import { useCallback, useEffect, useMemo, useState } from "react"
import { InputAccessoryView, Keyboard, Platform, Text, TextInput, TouchableOpacity, View } from "react-native"
import { formatCurrency } from "@/utils/currencyUtils"

export type GroupedComponentsProps = {
    separator: "opaque" | "translucent" | "vibrant" | "none",
}

type GValueInputProps = GroupedComponentsProps & {
    label: string,
    acViewKey: string,
    //value: string,
    //onChangeText: (value: string) => void,
    onChangeNumValue: (numValue: number) => void,
    transactionType: TransactionType,
    valueInCents?: number,
    labelFlex?: number,
    fieldFlex?: number
}

export default function GValueInput({separator, label, acViewKey, onChangeNumValue, transactionType, valueInCents, labelFlex, fieldFlex}: GValueInputProps) {

    const {theme} = useStyle()
    const placeholder = 0.0
    const locale = i18n.language
    const currency = locale === "pt-BR" ? "BRL" : "USD"

    const [isFocused, setIsFocused] = useState(false)
    const [textValue, setTextValue] = useState("")

    const separatorTypes = [
        {separator: "opaque", color: theme.separator.opaque},
        {separator: "translucent", color: theme.separator.translucent},
        {separator: "vibrant", color: theme.separator.vibrant},
        {separator: "translucent", color: "transparent"}
    ]

    const parseRawTextToNumber = useCallback(
        (text: string) => {
            let cleaned = text.trim()

            cleaned = locale === "en-US" ? cleaned.replace(/,/g, '') : cleaned.replace(/\./g, '').replace(',', '.')

            cleaned = cleaned.replace(",", ".")
            cleaned = cleaned.replace(/[^0-9.]/g, "")

            const parts = cleaned.split(".")
            if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("")

            const num = parseFloat(cleaned)
            return Number.isNaN(num) ? null : num
        },
        [locale],
    )

    // Trata o texto digitado
    const handleTextChange = (text: string) => {
        setTextValue(text)

        const num = parseRawTextToNumber(text)
        if (num !== null) {
            onChangeNumValue(Math.round(num * 100))
            return
        }

        onChangeNumValue(0)
    }

    // Ao focar, mostra apenas o número cru (sem formatação)
    const handleFocus = () => {
        setIsFocused(true)
    }

    useEffect(() => {
        if (valueInCents === undefined || isFocused) {
            return
        }

        if (valueInCents === 0) {
            setTextValue("")
            return
        }

        const absoluteValue = Math.abs(valueInCents) / 100
        const formatted = locale === "en-US"
            ? absoluteValue.toFixed(2)
            : absoluteValue.toFixed(2).replace(".", ",")

        setTextValue(formatted)
    }, [isFocused, locale, valueInCents])

    // Ao perder foco, formata como moeda
    const handleBlur = () => {
        const num = parseRawTextToNumber(textValue)
        if (num === null || num === 0) {
            // Zera o campo
            //onChangeNumValue(0)
            setTextValue("")
        } else {
            const cents = Math.round(num * 100)
            onChangeNumValue(cents)
            const numText = locale === "en-US" ? num.toFixed(2) : num.toFixed(2).replace(".", ",")
            setTextValue(numText)
        }
        setIsFocused(false)
    }

    const displayedValue = useMemo(() => {
        if (isFocused) return textValue

        const parsedValue = parseRawTextToNumber(textValue)

        if (parsedValue === null) return ""

        const valueToFormat = transactionType === "in" ? parsedValue : -parsedValue

        return formatCurrency(valueToFormat, {
            locale,
            currency,
            fromCents: false,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }, [currency, isFocused, locale, parseRawTextToNumber, textValue, transactionType])

    return(
        <View>
            <View style={{flexDirection: "row", justifyContent: "space-between", paddingTop: 15, paddingBottom: 14, gap: 8}}>
                <Text 
                    style={{
                        flex: labelFlex ? labelFlex : 1,
                        lineHeight: 22,
                        fontSize: 17,
                        color: theme.text.label
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {label}
                </Text>
                <TextInput
                    style={{flex: fieldFlex ? fieldFlex : 3, lineHeight: 22, fontSize: 17, color: theme.text.label}}
                    placeholder={formatCurrency(placeholder, { locale, currency, fromCents: false })}
                    placeholderTextColor={theme.text.secondaryLabel}
                    keyboardType="decimal-pad"
                    inputMode="decimal"
                    textAlign="right"
                    maxLength={11}
                    inputAccessoryViewID={acViewKey}
                    value={displayedValue}
                    onChangeText={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </View>
            <View style={{height: 1, backgroundColor: separatorTypes.find(item => item.separator === separator)?.color || "transparent"}}/>

            {Platform.OS === 'ios' && (
                <InputAccessoryView nativeID={acViewKey}>
                    <View style={{
                        width: '100%',
                        paddingBottom: 6,
                        paddingHorizontal: 16,
                        alignItems: 'flex-end',
                    }}>
                        <TouchableOpacity onPress={Keyboard.dismiss}>
                            <View style={{paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, backgroundColor: theme.colors.blue}}>
                                <Text style={{lineHeight: 22, fontSize: 17, color: theme.colors.white}}>
                                    Concluído
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </InputAccessoryView>
            )}
        </View>
    )
}