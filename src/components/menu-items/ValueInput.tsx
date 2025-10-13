import { FontStyles } from "@/components/styles/FontStyles"
import { useTheme } from "@/context/ThemeContext"
import i18n from "@/i18n"
import { useState } from "react"
import { Text, TextInput, TextInputProps, View } from "react-native"
import { MIStyles } from "./MenuItemStyles"

type ValueInputProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
    leftText: string
    value: string; 
    onChangeText: (value: string) => void; 
    flowType: "inflow" | "outflow"
}

export default function ValueInput({leftText, value, onChangeText, flowType, ...rest}: ValueInputProps) {

    const placeholder = 0.0
    const theme = useTheme()
    const menuStyles = MIStyles(theme.theme)
    
    const [isFocused, setIsFocused] = useState(false);

    const formatCurrency = (rawText: string): string => {
        // Se o valor estiver vazio, retornamos uma string vazia para mostrar o placeholder
        if (!rawText) return "";

        let numericValue = parseFloat(rawText.replace(',', '.'));

        // Se não for um número válido (ex: se o usuário digitar apenas "."), retorna vazio
        if (isNaN(numericValue)) return "";

        const valueToFormat = flowType === "inflow" ? numericValue : -numericValue;

        return new Intl.NumberFormat(i18n.language, {
            style: "currency",
            currency: i18n.language === "pt-BR" ? "BRL" : "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valueToFormat)
    };

    const handleTextChange = (text: string) => {
        
        onChangeText(text);
    };
    
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        let cleaned = value.trim();

        // Troca vírgula por ponto
        cleaned = cleaned.replace(",", ".");

        // Remove caracteres inválidos
        cleaned = cleaned.replace(/[^0-9.]/g, "");

        // Se tiver mais de um ponto, mantém só o primeiro
        const parts = cleaned.split(".");
        if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");

        // Converte para número
        const num = parseFloat(cleaned);
        if (isNaN(num) || num === 0) {
            // Zera o campo
            onChangeText("");
        } else {
            // Formata com duas casas decimais para garantir consistência
            onChangeText(
                new Intl.NumberFormat(i18n.language, {
                    style: "decimal",
                }).format(num)
            )
        }
        setIsFocused(false);
    };

    const displayedValue = isFocused ? value : formatCurrency(value);

    return(
        <View style={menuStyles.input}>
            {/* O container da esquerda agora funciona como um label */}
            <View style={menuStyles.inputTextContainer}>
                <Text
                    style={[menuStyles.text, FontStyles.body]}
                >{leftText}</Text>
            </View>
            <View style={menuStyles.inputContainer}>
                <TextInput
                    style={[menuStyles.text, FontStyles.numBody, {fontSize: 18}]}
                    // Placeholder ignora o sinal!
                    placeholder={placeholder.toLocaleString(i18n.language, {style: "currency", currency: i18n.language === "pt-BR" ? "BRL" : "USD", currencySign: "standard"})} 
                    placeholderTextColor={menuStyles.textUnfocused.color}
                    keyboardType="decimal-pad"
                    inputMode="decimal"
                    textAlign="right"
                    maxLength={11}
                    {...rest}

                    value={displayedValue}
                    onChangeText={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </View>
        </View>
    )
}