import CreditCardView from "@/components/CreditCardView";
import GDateInput from "@/components/grouped-list-components/GroupedDateInput";
import GSwitch from "@/components/grouped-list-components/GroupedSwitch";
import GTextInput from "@/components/grouped-list-components/GroupedTextInput";
import GValueInput from "@/components/grouped-list-components/GroupedValueInput";
import SimpleColorPicker from "@/components/pickers/SimpleColorPicker";
import { useStyle } from "@/context/StyleContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";



export default function AddCardModal() {

    const {theme, layout} = useStyle()
    const {t} = useTranslation()

    const colors = theme.colors

    const [selectedColor, setSelectedColor] = useState(colors.gray1)
    const [name, setName] = useState("")
    const [ignoreWeekends, setIgnoreWeekends] = useState(true)

    const colorOptions = [
        { code: colors.red, label: t("credit.red") },
        { code: colors.orange, label: t("credit.orange") },
        { code: colors.mint, label: t("credit.mint") },
        { code: colors.green, label: t("credit.green") },
        { code: colors.cyan, label: t("credit.cyan") },
        { code: colors.purple, label: t("credit.purple") },
        { code: colors.indigo, label: t("credit.indigo") },
        { code: colors.gray1, label: t("credit.gray") },
    ]
    
    return(
        <ScrollView 
            contentContainerStyle={{
                flex: 1,
                paddingTop: useHeaderHeight() + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                gap: layout.margin.sectionGap
            }}>

            <View style={{flexDirection: "row", justifyContent: "center"}}>
                <CreditCardView color={selectedColor} name={name} />
            </View>

            <View 
                style={{
                    paddingHorizontal: layout.margin.contentArea,
                    borderRadius: layout.radius.groupedView,
                    backgroundColor: theme.fill.secondary
                }}
            >
                <GTextInput
                    separator={"translucent"}
                    label={t("credit.name")}
                    value={name}
                    onChangeText={setName}
                    acViewKey={"nome"}
                    maxLength={20}
                />
                <GValueInput
                    separator={"translucent"}
                    label={t("credit.limit")}
                    acViewKey={"lim"}
                    onChangeNumValue={() => {}}
                    flowType={"inflow"}
                />
                <GDateInput
                    separator={"translucent"}
                    label={t("credit.closingDay")}
                    value={new Date()}
                    onDateChange={() => {}}
                />
                <GDateInput
                    separator="translucent"
                    label={t("credit.dueDay")}
                    value={new Date()}
                    onDateChange={() => {}}
                />
                <GSwitch 
                    separator={"none"}
                    label={t("credit.ignoreWeekends")}
                    value={ignoreWeekends}
                    onValueChange={setIgnoreWeekends}
                />
            </View>
            <SimpleColorPicker
                colors={colorOptions}
                selectedColor={selectedColor}
                onSelect={setSelectedColor}
            />

            
        </ScrollView>
    )
}