import { FilterOrderBy, FilterSortBy, useSearchFilters } from "@/context/SearchFiltersContext"
import { useTheme } from "@/context/ThemeContext"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import GValueInput from "../components/grouped-list-components/GroupedValueInput"
import { CategoryPickerCompact } from "../components/history-screen-items/CategoryPickerCompact"
import { SCOption } from "../components/menu-items/SegmentedControl"
import SegmentedControlCompact from "../components/menu-items/SegmentedControlCompact"
import { FontStyles } from "../components/styles/FontStyles"
import { TypographyProps } from "../components/styles/TextStyles"

export default function FilterModalSheet() {

    const {t} = useTranslation()
    const {theme} = useTheme()
    const text = TypographyProps(theme)
    const paddingTop = useHeaderHeight()
    const router = useRouter()
    const insets = useSafeAreaInsets()

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
        <View style={{flex: 1, paddingHorizontal: 16, paddingTop: paddingTop}}>
            <ScrollView
                contentContainerStyle={{gap: 14, paddingBottom: 100}}
            >
                <View style={{gap: 10}}>
                    <View style={{paddingHorizontal: 16}}>
                        <Text {...text.popupTitle}>Valor absoluto</Text>
                    </View>
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

                <View style={{gap: 10}}>
                    <View style={{paddingHorizontal: 16}}>
                        <Text {...text.popupTitle}>Categorias</Text>
                    </View>

                    <CategoryPickerCompact
                        onChangeSelected={(selectedIds: number[]) => updateFilters({category: selectedIds})}
                        type={filters.type || "all"}
                    />
                </View>

                <View style={{gap: 10}}>
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

                <View style={{gap: 10}}>
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

                <View style={{gap: 10}}>
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

            
            <View 
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                    padding: 16,
                    backgroundColor: theme.background.group.secondaryBg
                }}
            >
                <TouchableOpacity
                    onPress={()=> {
                        resetFilters()
                        router.back()
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
                    onPress={() => router.back()}
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
            </ScrollView>
        </View>
    )    

}

