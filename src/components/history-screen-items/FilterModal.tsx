import { useTheme } from "@/context/ThemeContext"
import { BlurView } from "expo-blur"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import GValueInput from "../grouped-list-components/GroupedValueInput"
import { SCOption } from "../menu-items/SegmentedControl"
import SegmentedControlCompact from "../menu-items/SegmentedControlCompact"
import { FontStyles } from "../styles/FontStyles"
import { TypographyProps } from "../styles/TextStyles"
import { CategoryPickerCompact } from "./CategoryPickerCompact"

type FilterModalProps = {
    onBackgroundPress: () => void,
}

export default function FilterModal({onBackgroundPress}: FilterModalProps) {

    const {t} = useTranslation()
    const {theme} = useTheme()
    const text = TypographyProps(theme)

    const [maxValue, setMaxValue] = useState("")
    const [selectedCategories, setSelectedCategories] = useState<number[]>([])

    const sortOptions: SCOption<string>[] = [
        {label: "Data", value: "date"},
        {label: "Valor", value: "value"}
    ]

    const orderOptions: SCOption<string>[] = [
        {label: "Crescente", value: "asc"},
        {label: "Descrescente", value: "desc"}
    ]

    const [sortOption, setSortOption] = useState("date")
    const [orderOption, setOrderOption] = useState("asc")

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
            <TouchableWithoutFeedback>
            <View
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
                        <Text {...text.popupTitle}>Valor absoluto</Text>
                    </View>
                    {/* Text fields container */}
                    <View style={{paddingHorizontal: 16, borderRadius: 26, backgroundColor: theme.fill.secondary}}>
                        <GValueInput
                            separator={"translucent"}
                            label={"Máximo"}
                            onChangeNumValue={(numValue: number) => console.log(`centavos: ${numValue}`)}
                            flowType={"inflow"}
                        />
                        <GValueInput
                            separator="none"
                            label="Mínimo"
                            onChangeNumValue={(numValue: number) => console.log(`centavos: ${numValue}`)}
                            flowType={"inflow"}
                        />
                    </View>
                </View>

                <View style={{paddingHorizontal: 16}}>
                    <Text {...text.popupTitle}>Categorias</Text>
                </View>

                <CategoryPickerCompact onChangeSelected={(selectedIds: number[]) => setSelectedCategories(selectedIds)} type="outflow" />

                <View style={{paddingHorizontal: 16}}>
                    <Text {...text.popupTitle}>Ordenar</Text>
                </View>

                <SegmentedControlCompact
                    options={sortOptions}
                    selectedValue={sortOption}
                    onChange={(value) => setSortOption(value)}
                />

                <SegmentedControlCompact
                    options={orderOptions}
                    selectedValue={orderOption}
                    onChange={(value) => setOrderOption(value)}
                />



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


               
            </View>
            </TouchableWithoutFeedback>
        </Pressable>
    )    

}