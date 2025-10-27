
import { useStyle } from "@/context/StyleContext"
import i18n from "@/i18n"
import { useEffect, useState } from "react"
import { InputAccessoryView, Keyboard, Platform, Text, TextInput, TouchableOpacity, View } from "react-native"
import { TypographyProps } from "../styles/TextStyles"

export type GroupedComponentsProps = {
    separator: "opaque" | "translucent" | "vibrant" | "none",
}

type GValueInputProps = GroupedComponentsProps & {
    label: string,
    acViewKey: string,
    //value: string,
    //onChangeText: (value: string) => void,
    onChangeNumValue: (numValue: number) => void,
    flowType: "inflow" | "outflow",
    valueInCents?: number,
    labelFlex?: number,
    fieldFlex?: number
}

export default function GValueInput({separator, label, acViewKey, onChangeNumValue, flowType, valueInCents, labelFlex, fieldFlex}: GValueInputProps) {

    const {theme} = useStyle()
    const text = TypographyProps(theme)
    const placeholder = 0.0

    const [isFocused, setIsFocused] = useState(false)
    const [textValue, setTextValue] = useState("")

    const separatorTypes = [
        {separator: "opaque", color: theme.separator.opaque},
        {separator: "translucent", color: theme.separator.translucent},
        {separator: "vibrant", color: theme.separator.vibrant},
        {separator: "translucent", color: "transparent"}
    ]

    const formatCurrency = (rawText: string): string => {
        // Se o valor estiver vazio, retornamos uma string vazia para mostrar o placeholder
        if (!rawText) return "";

        let numericValue = parseFloat(rawText.replace(',', '.'));

        // Se não for um número válido (ex: se o usuário digitar apenas "."), retorna vazio
        if (isNaN(numericValue)) return "";

        const valueToFormat = flowType === "inflow" ? numericValue : -numericValue

        return new Intl.NumberFormat(i18n.language, {
            style: "currency",
            currency: i18n.language === "pt-BR" ? "BRL" : "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valueToFormat)
    }

    // Trata o texto digitado
    const handleTextChange = (text: string) => {
        setTextValue(text)

        let cleaned = text.trim()

        cleaned = i18n.language === "en-US" ? cleaned.replace(/,/g, '') 
        : cleaned.replace(/\./g, '').replace(',', '.')

        // Troca vírgula por ponto
        cleaned = cleaned.replace(",", ".")

        // Remove caracteres inválidos
        cleaned = cleaned.replace(/[^0-9.]/g, "")

        // Se tiver mais de um ponto, mantém só o primeiro
        const parts = cleaned.split(".");
        if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("")

        // Converte para número
        const num = parseFloat(cleaned)
        if (!isNaN(num)) {
            onChangeNumValue(Math.round(num * 100))
        } else {
            onChangeNumValue(0)
        }
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
        const formatted = i18n.language === "en-US"
            ? absoluteValue.toFixed(2)
            : absoluteValue.toFixed(2).replace(".", ",")

        setTextValue(formatted)
    }, [valueInCents, isFocused])

    // Ao perder foco, formata como moeda
    const handleBlur = () => {
        let cleaned = textValue.trim()

        cleaned = i18n.language === "en-US" ? cleaned.replace(/,/g, '') 
        : cleaned.replace(/\./g, '').replace(',', '.')

        // Troca vírgula por ponto
        cleaned = cleaned.replace(",", ".")

        // Remove caracteres inválidos
        cleaned = cleaned.replace(/[^0-9.]/g, "")

        // Se tiver mais de um ponto, mantém só o primeiro
        const parts = cleaned.split(".");
        if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("")

        // Converte para número
        const num = parseFloat(cleaned)
        if (isNaN(num) || num === 0) {
            // Zera o campo
            //onChangeNumValue(0)
            setTextValue("")
        } else {
            const cents = Math.round(num * 100)
            onChangeNumValue(cents)
            const numText = i18n.language === "en-US" ? num.toFixed(2) : num.toFixed(2).replace(".", ",")
            setTextValue(numText)
        }
        setIsFocused(false)
    }

    const displayedValue = isFocused ? textValue : formatCurrency(textValue)

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
                    placeholder={placeholder.toLocaleString(i18n.language, {style: "currency", currency: i18n.language === "pt-BR" ? "BRL" : "USD", currencySign: "standard"})} 
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