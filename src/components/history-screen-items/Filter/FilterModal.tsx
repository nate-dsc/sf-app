import BlurredModalView from "@/components/BlurredModalView"
import LabeledButton from "@/components/buttons/LabeledButton"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import GroupView from "@/components/grouped-list-components/GroupView"
import { useSearchFilters } from "@/context/SearchFiltersContext"
import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE, FONT_WEIGHT } from "@/styles/Fonts"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"
import GValueInput from "../../grouped-list-components/GroupedValueInput"
import { CategoryPickerCompact } from "./CategoryPickerCompact"

type FilterModalProps = {
    onBackgroundPress: () => void,
}

export default function FilterModal({onBackgroundPress}: FilterModalProps) {

    const {t} = useTranslation()
    const {theme} = useStyle()

    const {filters, updateFilters, resetFilters} = useSearchFilters()

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
                    Valor absoluto
                </Text>

                <GroupView>
                    <GValueInput
                        separator={"translucent"}
                        label={"Máximo"}
                        acViewKey={"max"}
                        onChangeNumValue={(numValue: number) => updateFilters({maxValue: numValue})}
                        transactionType="in"
                    />
                    <GValueInput
                        separator="none"
                        label="Mínimo"
                        acViewKey={"min"}
                        onChangeNumValue={(numValue: number) => updateFilters({minValue: numValue})}
                        transactionType="in"
                    />
                </GroupView>

                <CategoryPickerCompact onChangeSelected={(selectedIds: number[]) => updateFilters({category: selectedIds})} type={filters.type || "all"} />

                <View style={{ flexDirection: "row", gap: 16 }}>
                    <View style={{flex: 1}}>
                        <LabeledButton
                            label={"Limpar"}
                            onPress={()=> {
                                resetFilters()
                                onBackgroundPress()
                            }}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <PrimaryButton
                            label={"Filtrar"}
                            onPress={onBackgroundPress}
                        />
                    </View>
                </View>
            </View>
        </BlurredModalView>
    )    

}