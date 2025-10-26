import CancelSaveButtons from "@/components/buttons/CancelSaveCombo";
import CreditCardView from "@/components/credit-card-items/CreditCardView";
import DayPickerModal from "@/components/credit-card-items/DayPickerModal";
import GPopup from "@/components/grouped-list-components/GroupedPopup";
import GSwitch from "@/components/grouped-list-components/GroupedSwitch";
import GTextInput from "@/components/grouped-list-components/GroupedTextInput";
import GValueInput from "@/components/grouped-list-components/GroupedValueInput";
import SimpleColorPicker from "@/components/pickers/SimpleColorPicker";
import { useStyle } from "@/context/StyleContext";
import { useTransactionDatabase } from "@/database/useTransactionDatabase";
import { NewCard } from "@/types/transaction";
import { getIDfromColor } from "@/utils/CardUtils";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ScrollView, View } from "react-native";



export default function AddCardModal() {

    const {theme, layout} = useStyle()
    const {t} = useTranslation()
    const router = useRouter()

    const { createCard } = useTransactionDatabase()

    const colors = theme.colors

    const today = new Date

    const [selectedColor, setSelectedColor] = useState(colors.gray1)
    const [name, setName] = useState("")
    const [ignoreWeekends, setIgnoreWeekends] = useState(true)
    const [closingDayModalVisible, setClosingDayModalVisible] = useState(false)
    const [dueDayModalVisible, setDueDayModalVisible] = useState(false)
    const [selectedClosingDay, setSelectedClosingDay] = useState(0)
    const [selectedDueDay, setSelectedDueDay] = useState(0)
    const [limit, setLimit] = useState(0)

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

    const handleSave = async () => {
        try {
            const newCard: NewCard = {
                name: name,
                color: getIDfromColor(selectedColor, theme),
                limit: limit,
                closingDay: selectedClosingDay,
                dueDay: selectedDueDay,
                ignoreWeekends: ignoreWeekends
            }
            await createCard(newCard);
            router.back(); // Só volta se salvar com sucesso
        } catch (error) {
            // O erro já foi logado no contexto, mas aqui você pode
            // mostrar uma mensagem para o usuário (ex: um Toast ou Alert)
            console.log("Falha ao salvar:", error);
        }
    }

    const isPrimaryActive =
    name.trim().length > 0 &&
    limit > 0 &&
    selectedClosingDay !== 0 &&
    selectedDueDay !== 0;
    
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
                    onChangeNumValue={(lim) => {setLimit(lim)}}
                    flowType={"inflow"}
                />
                <GPopup
                    separator={"translucent"}
                    label={t("credit.closingDay")}
                    displayValue={selectedClosingDay === 0 ? undefined : selectedClosingDay.toString()}
                    onPress={() => setClosingDayModalVisible(true)}
                />
                <GPopup
                    separator={"translucent"}
                    label={t("credit.closingDay")}
                    displayValue={selectedDueDay === 0 ? undefined : selectedDueDay.toString()}
                    onPress={() => setDueDayModalVisible(true)}
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

            <View>
                <CancelSaveButtons
                cancelAction={() => router.back()}
                primaryAction={() => handleSave()}
                isPrimaryActive={isPrimaryActive} />
            </View>

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={closingDayModalVisible}
                onRequestClose={() => setClosingDayModalVisible(false)}
                style={{
                    justifyContent: "center"
                }}
            >
                <DayPickerModal
                    title={t("credit.closingDay")}
                    selectedDay={selectedClosingDay}
                    onDayPress={setSelectedClosingDay}
                    onBackgroundPress={() => setClosingDayModalVisible(false)}
                />
            </Modal>

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={dueDayModalVisible}
                onRequestClose={() => setDueDayModalVisible(false)}
                style={{
                    justifyContent: "center"
                }}
            >
                <DayPickerModal
                    title={t("credit.dueDay")}
                    selectedDay={selectedDueDay}
                    onDayPress={setSelectedDueDay}
                    onBackgroundPress={() => setDueDayModalVisible(false)}
                />
            </Modal>

            
        </ScrollView>
    )
}