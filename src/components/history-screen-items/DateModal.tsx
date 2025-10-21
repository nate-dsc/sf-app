import { FilterOrderBy, FilterSortBy, useSearchFilters } from "@/context/SearchFiltersContext"
import { useTheme } from "@/context/ThemeContext"
import { BlurView } from "expo-blur"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import GDateInput from "../grouped-list-components/GroupedDateInput"
import { SCOption } from "../menu-items/SegmentedControl"
import { FontStyles } from "../styles/FontStyles"
import { TypographyProps } from "../styles/TextStyles"

type DateModalProps = {
    onBackgroundPress: () => void,
}

export default function FilterModal({onBackgroundPress}: DateModalProps) {

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
                <View style={{gap: 10, paddingBottom: 14}}>
                    {/* Section title container */}
                    <View style={{paddingHorizontal: 16}}>
                        <Text {...text.popupTitle}>Definir período</Text>
                    </View>
                    {/* Text fields container */}
                    <View style={{paddingHorizontal: 16, borderRadius: 26, backgroundColor: theme.fill.secondary}}>
                        <GDateInput
                            separator={"translucent"}
                            label={"Data inicial"}
                            value={new Date()}
                            onDateChange={()=>{}}
                        />
                        <GDateInput
                            separator="none"
                            label="Data final"
                            value={new Date()}
                            onDateChange={()=>{}}
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