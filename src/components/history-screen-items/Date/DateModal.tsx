import { useSearchFilters } from "@/context/SearchFiltersContext"
import { useStyle } from "@/context/StyleContext"
import { BlurView } from "expo-blur"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import GDateInput from "../../grouped-list-components/GroupedDateInput"
import { FontStyles } from "../../styles/FontStyles"
import { TypographyProps } from "../../styles/TextStyles"

type DateModalProps = {
    onBackgroundPress: () => void,
}

export default function FilterModal({onBackgroundPress}: DateModalProps) {

    const {t} = useTranslation()
    const {theme} = useStyle()
    const text = TypographyProps(theme)

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
        <Pressable
            style={{flex: 1, justifyContent: "center", alignItems: "stretch", paddingHorizontal: 12, gap: 10}}
            onPress={() => {
                onBackgroundPress()
            }}
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
                    {/* Section title container */}
                    <View style={{paddingHorizontal: 16}}>
                        <Text {...text.popupTitle}>Período</Text>
                    </View>
                    {/* Text fields container */}
                    <View style={{paddingHorizontal: 16, borderRadius: 26, backgroundColor: theme.fill.secondary}}>
                        <GDateInput
                            separator={"translucent"}
                            label={"Data inicial"}
                            value={filters.initialDate ?? new Date()}
                            onDateChange={handleInitialDateChange}
                        />
                        <GDateInput
                            separator="none"
                            label="Data final"
                            value={filters.finalDate ?? new Date()}
                            onDateChange={handleFinalDateChange}
                        />
                    </View>
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                }}>
                    <TouchableOpacity
                        onPress={()=> {
                            resetDates()
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
                        <Text style={[FontStyles.body, {fontWeight: "500", color: theme.text.label}]}>Limpar</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity
                        onPress={()=> {
                            updateFilters({dateFilterActive: true})
                            onBackgroundPress()
                        }}
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