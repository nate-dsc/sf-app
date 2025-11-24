import BlurredModalView from "@/components/BlurredModalView"
import LabeledButton from "@/components/buttons/LabeledButton"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import { useSearchFilters } from "@/context/SearchFiltersContext"
import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE, FONT_WEIGHT } from "@/styles/Fonts"
import { SCOption } from "@/types/Components"
import { FilterOrderBy, FilterSortBy } from "@/types/Transactions"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"
import SegmentedControlCompact from "../../recurrence-modal-items/SegmentedControlCompact"

type OrderModalProps = {
    onBackgroundPress: () => void,
}

export default function OrderModal({onBackgroundPress}: OrderModalProps) {

    const {t} = useTranslation()
    const {theme} = useStyle()

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
        <BlurredModalView
            onBackgroundPress={onBackgroundPress}
        >
            <View
                style={{
                    gap: 16
                }}
            >
                <Text
                    style={{
                        paddingHorizontal: 16,
                        fontSize: FONT_SIZE.BODY,
                        fontWeight: FONT_WEIGHT.MEDIUM,
                        color: theme.text.label
                    }}
                >
                    Ordenação
                </Text>

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
                
                <View style={{ flexDirection: "row", gap: 16 }}>
                    <View style={{flex: 1}}>
                        <LabeledButton
                            label={"Cancelar"}
                            onPress={()=> {
                                resetFilters()
                                onBackgroundPress()
                            }}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <PrimaryButton
                            label={"Ordenar"}
                            onPress={onBackgroundPress}
                        />
                    </View>
                </View>
            </View>
        </BlurredModalView>
    )    

}