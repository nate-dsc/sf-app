import { FilterOrderBy, FilterSortBy, useSearchFilters } from "@/context/SearchFiltersContext"
import { useTheme } from "@/context/ThemeContext"
import { BlurView } from "expo-blur"
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

    const {filters, updateFilters, resetFilters} = useSearchFilters()

    const sortOptions: SCOption<FilterSortBy>[] = [
        {label: "Data", value: "date"},
        {label: "Valor", value: "value"}
    ]

    const orderOptions: SCOption<FilterOrderBy>[] = [
        {label: "Descrescente", value: "desc"},
        {label: "Crescente", value: "asc"}
    ]

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
                {/* <View style={{padding: 8, paddingBottom: 24}}>
                    <Text {...text.popupTitle}>Filtros</Text>
                </View> */}
                {/* Value input container */}
                <View style={{gap: 10, paddingBottom: 14}}>
                    {/* Section title container */}
                    <View style={{paddingHorizontal: 16}}>
                        <Text {...text.popupTitle}>Valor absoluto</Text>
                    </View>
                    {/* Text fields container */}
                    <View style={{paddingHorizontal: 16, borderRadius: 26, backgroundColor: theme.fill.secondary}}>
                        <GValueInput
                            separator={"translucent"}
                            label={"Máximo"}
                            acViewKey={"max"}
                            onChangeNumValue={(numValue: number) => updateFilters({maxValue: numValue})}
                            flowType={"inflow"}
                        />
                        <GValueInput
                            separator="none"
                            label="Mínimo"
                            acViewKey={"min"}
                            onChangeNumValue={(numValue: number) => updateFilters({minValue: numValue})}
                            flowType={"inflow"}
                        />
                    </View>
                </View>
                <View style={{gap: 10, paddingBottom: 14}}>
                    <View style={{paddingHorizontal: 16}}>
                        <Text {...text.popupTitle}>Categorias</Text>
                    </View>

                    <CategoryPickerCompact onChangeSelected={(selectedIds: number[]) => updateFilters({category: selectedIds})} type={filters.type || "all"} />
                </View>
                <View style={{gap: 10, paddingBottom: 14}}>
                    <View style={{paddingHorizontal: 16}}>
                        <Text {...text.popupTitle}>Ordenar</Text>
                    </View>

                    <SegmentedControlCompact
                        options={sortOptions}
                        selectedValue={filters.sortBy}
                        onChange={(value) => updateFilters({sortBy: value})}
                    />

                    <SegmentedControlCompact
                        options={orderOptions}
                        selectedValue={filters.orderBy}
                        onChange={(value) => updateFilters({orderBy: value})}
                    />

                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                }}>
                    <TouchableOpacity
                        onPress={()=> {
                            resetFilters()
                            onBackgroundPress()
                        }}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 100,
                            paddingVertical: 13,
                            backgroundColor: theme.fill.secondary
                        }}
                    >
                        <Text style={[FontStyles.body, {fontWeight: "500", color: theme.text.label}]}>Cancelar</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity
                        onPress={onBackgroundPress}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 100,
                            paddingVertical: 13,
                            backgroundColor: theme.colors.blue
                        }}
                    >
                        <Text style={[FontStyles.body, {fontWeight: "500", color: theme.colors.white}]}>Filtrar</Text>
                    </TouchableOpacity>

                </View>


               
            </View>
            </TouchableWithoutFeedback>
        </Pressable>
    )    

}