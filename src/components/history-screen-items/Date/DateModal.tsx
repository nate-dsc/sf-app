import BlurredModalView from "@/components/BlurredModalView"
import LabeledButton from "@/components/buttons/LabeledButton"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import GroupView from "@/components/grouped-list-components/GroupView"
import { useSearchFilters } from "@/context/SearchFiltersContext"
import { useStyle } from "@/context/StyleContext"
import { FONT_SIZE, FONT_WEIGHT } from "@/styles/Fonts"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"
import GDateInput from "../../grouped-list-components/GroupedDateInput"

type DateModalProps = {
    onBackgroundPress: () => void,
}

export default function FilterModal({onBackgroundPress}: DateModalProps) {

    const {t} = useTranslation()
    const {theme} = useStyle()

    const {filters, updateFilters, resetDates} = useSearchFilters()

    const handleInitialDateChange = (initialDate: Date) => {
        const id = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate(), 0, 0, 0)
        updateFilters({initialDate: id})
    }

    const handleFinalDateChange = (finalDate: Date) => {
        const fd = new Date(finalDate.getFullYear(), finalDate.getMonth(), finalDate.getDate(), 23, 59, 59)
        updateFilters({finalDate: fd})
    }

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
                    Período
                </Text>

                <GroupView>
                    <GDateInput
                        separator={"vibrant"}
                        leadingLabel={"Data inicial"}
                        value={filters.initialDate ?? new Date()}
                        onDateChange={handleInitialDateChange}
                    />
                    <GDateInput
                        separator="none"
                        leadingLabel="Data final"
                        value={filters.finalDate ?? new Date()}
                        onDateChange={handleFinalDateChange}
                    />
                </GroupView>

                <View style={{ flexDirection: "row", gap: 16 }}>
                    <View style={{flex: 1}}>
                        <LabeledButton
                            label={"Limpar"}
                            onPress={()=> {
                                resetDates()
                                onBackgroundPress()
                            }}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <PrimaryButton
                            label={"Filtrar"}
                            onPress={()=> {
                                updateFilters({dateFilterActive: true})
                                onBackgroundPress()
                            }}
                        />
                    </View>
                </View>
            </View>
        </BlurredModalView>
    )    

}