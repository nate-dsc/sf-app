import { useSearchFilters } from "@/context/SearchFiltersContext"
import { useStyle } from "@/context/StyleContext"
import { BlurView } from "expo-blur"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import GValueInput from "../../grouped-list-components/GroupedValueInput"
import { FontStyles } from "../../styles/FontStyles"
import { TypographyProps } from "../../styles/TextStyles"
import { CategoryPickerCompact } from "./CategoryPickerCompact"

type FilterModalProps = {
    onBackgroundPress: () => void,
}

export default function FilterModal({onBackgroundPress}: FilterModalProps) {

    const {t} = useTranslation()
    const {theme} = useStyle()
    const text = TypographyProps(theme)

    const {filters, updateFilters, resetFilters} = useSearchFilters()

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
                        <Text {...text.popupTitle}>Valor absoluto</Text>
                    </View>
                    <View style={{paddingHorizontal: 16, borderRadius: 26, backgroundColor: theme.fill.secondary}}>
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
                    </View>
                </View>
                <View style={{gap: 10, paddingBottom: 14}}>
                    <View style={{paddingHorizontal: 16}}>
                        <Text {...text.popupTitle}>Categorias</Text>
                    </View>

                    <CategoryPickerCompact onChangeSelected={(selectedIds: number[]) => updateFilters({category: selectedIds})} type={filters.type || "all"} />
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