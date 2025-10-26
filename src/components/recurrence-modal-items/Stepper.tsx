
import { useStyle } from "@/context/StyleContext";
import React, { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontStyles } from "../styles/FontStyles";

type StepperProps = {
    singular: string,
    plural: string,
    min: number,
    max: number,
    value: number,
    onValueChange: (newValue: number) => void
};

export default function Stepper({singular, plural, min, max, value, onValueChange } : StepperProps) {
    const {theme, layout} = useStyle()

    const intervalRef = useRef<number | null>(null)
    const valueRef = useRef(value)

    useEffect(() => {
        valueRef.current = value;
    }, [value])

    // 3. (IMPORTANTE) Efeito para limpar o intervalo se o componente for desmontado
    // Isso evita vazamentos de memória e erros.
    useEffect(() => {
        // A função de retorno do useEffect é a função de "limpeza"
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []); // O array vazio [] garante que isso rode apenas na montagem e desmontagem

    const handleIncrease = () => {
        const currentValue = valueRef.current
        const newValue = currentValue < max ? currentValue + 1 : max
        onValueChange(newValue)
    }
    
    const handleDecrease = () => {
        const currentValue = valueRef.current
        const newValue = currentValue > min ? currentValue - 1 : min
        onValueChange(newValue)
    }

    // 4. Função para INICIAR o contador (para aumentar)
    const startIncreasing = () => {
        // Limpa qualquer intervalo anterior para segurança
        if (intervalRef.current) clearInterval(intervalRef.current);
        // Aumenta o valor uma vez imediatamente ao tocar
        handleIncrease();
        // Inicia um intervalo para continuar aumentando a cada 150ms
        intervalRef.current = setInterval(handleIncrease, 200); // Ajuste o tempo (ms) para a velocidade desejada
    };
    
    // 5. Função para INICIAR o contador (para diminuir)
    const startDecreasing = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        handleDecrease();
        intervalRef.current = setInterval(handleDecrease, 200);
    };

    // 6. Função para PARAR o contador
    const stopCounter = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    return (
        <View 
            style={{
                paddingHorizontal: layout.margin.contentArea,
                borderRadius: layout.radius.groupedView,
                backgroundColor: theme.fill.secondary
            }}
        >  
            <View 
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View 
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 1,
                        justifyContent: "flex-start",
                        gap: 8
                    }}
                >
                    <TouchableOpacity
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: 52,
                            height: 52,
                        }}
                        onPressIn={startDecreasing}
                        onPressOut={stopCounter}
                        disabled={value === min}
                    >
                        <View 
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: 48,
                                height: 36,
                                borderRadius: layout.radius.round,
                                backgroundColor: theme.segmentedControl.selected,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 28,
                                    lineHeight: 30,
                                    fontWeight: "bold",
                                    color: theme.text.label
                                }}
                            >
                                -
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{width: 52}}>
                        <Text
                            style={{
                                fontVariant: ["tabular-nums"],
                                fontSize: 17,
                                lineHeight: 22,
                                fontWeight: "500",
                                textAlign: "center",
                                color: theme.text.label
                            }}
                        >
                            {String(value)}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: 52,
                            height: 52,
                        }}
                        onPressIn={startIncreasing}
                        onPressOut={stopCounter}
                        disabled={value === max}
                    >
                        <View 
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: 48,
                                height: 36,
                                borderRadius: layout.radius.round,
                                backgroundColor: theme.segmentedControl.selected,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 28,
                                    lineHeight: 30,
                                    fontWeight: "bold",
                                    color: theme.text.label
                                }}
                            >
                                +
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, paddingVertical: 12, alignItems: "center"}}>
                    <Text 
                        style={[{color: theme.menuItem.text}, FontStyles.body]}
                        ellipsizeMode="tail"
                    >
                        {value === 1 ? singular : plural}
                    </Text>
                </View>
            </View>
        </View>
    );
};