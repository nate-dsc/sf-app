import { useSearchFilters } from "@/context/SearchFiltersContext"
import { useStyle } from "@/context/StyleContext"
import { SCOption } from "@/types/components"
import { FilterOrderBy, FilterSortBy } from "@/types/Transactions"
import { BlurView } from "expo-blur"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import SegmentedControlCompact from "../../recurrence-modal-items/SegmentedControlCompact"
import { FontStyles } from "../../styles/FontStyles"
import { TypographyProps } from "../../styles/TextStyles"

type OrderModalProps = {
    onBackgroundPress: () => void,
}

export default function OrderModal({onBackgroundPress}: OrderModalProps) {

    const {t} = useTranslation()
    const {theme} = useStyle()
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
                    <View style={{gap: 10, paddingBottom: 14}}>
                        <View style={{paddingHorizontal: 16}}>
                            <Text {...text.popupTitle}>Ordenação</Text>
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
                            <Text style={[FontStyles.body, {fontWeight: "500", color: theme.colors.white}]}>Ordenar</Text>
                        </TouchableOpacity>
                    </View>   
                </View>
            </TouchableWithoutFeedback>
        </Pressable>
    )    

}