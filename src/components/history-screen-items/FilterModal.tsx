import { useTheme } from "@/context/ThemeContext"
import { BlurView } from "expo-blur"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import GValueInput from "../grouped-list-components/GroupedValueInput"
import { FontStyles } from "../styles/FontStyles"
import { TypographyProps } from "../styles/TextStyles"

type FilterModalProps = {
    onBackgroundPress: () => void,
}

export default function FilterModal({onBackgroundPress}: FilterModalProps) {

    const {t} = useTranslation()
    const {theme} = useTheme()
    const text = TypographyProps(theme)

    const [maxValue, setMaxValue] = useState("")

    return(
        <Pressable
            style={{flex: 1, justifyContent: "center", alignItems: "stretch", paddingHorizontal: 12, gap: 10}}
            onPress={onBackgroundPress}
        >
            <BlurView
                style={StyleSheet.absoluteFill}
                intensity={10}
                tint="default"
            />
            <Pressable 
                onPress={() => {}}
                style={{
                    rowGap: 10,
                    backgroundColor: theme.background.group.secondaryBg,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    padding: 13,
                    borderRadius: 34,
                    borderCurve: "continuous",
                    shadowColor: "#000",
                    shadowOpacity: 0.2,
                    shadowRadius: 32,
                    shadowOffset: {width: 0, height: 0}
                }}
            >
                {/* Title container */}
                <View style={{padding: 8, paddingBottom: 24}}>
                    <Text {...text.popupTitle}>Filtros</Text>
                </View>
                {/* Value input container */}
                <View style={{gap: 10}}>
                    {/* Section title container */}
                    <View style={{paddingHorizontal: 16}}>
                        <Text {...text.popupTitle}> Valor</Text>
                    </View>
                    {/* Text fields container */}
                    <View style={{paddingHorizontal: 16, borderRadius: 26, backgroundColor: theme.fill.secondary}}>
                        <GValueInput
                            separator={"translucent"}
                            label={"Máximo"}
                            onChangeNumValue={(numValue: number) => console.log(`centavos: ${numValue}`)}
                            flowType={"outflow"}
                        />
                        <GValueInput
                            separator="none"
                            label="Mínimo"
                            onChangeNumValue={(numValue: number) => console.log(`centavos: ${numValue}`)}
                            flowType={"outflow"}
                        />
                    </View>
                </View>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 100,
                        paddingVertical: 13,
                        backgroundColor: theme.fill.secondary
                    }}>
                        <Text style={[FontStyles.body, {fontWeight: "500", color: theme.text.label}]}>Resetar</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 100,
                        paddingVertical: 13,
                        backgroundColor: theme.colors.blue
                    }}>
                        <Text style={[FontStyles.body, {fontWeight: "500", color: theme.colors.white}]}>Filtrar</Text>
                    </TouchableOpacity>

                </View>


               
            </Pressable>
        </Pressable>
    )    

}