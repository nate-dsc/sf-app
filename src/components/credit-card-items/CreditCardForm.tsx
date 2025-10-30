import CancelSaveButtons from "@/components/buttons/CancelSaveCombo"
import CreditCardView from "@/components/credit-card-items/CreditCardView"
import DayPickerModal from "@/components/credit-card-items/DayPickerModal"
import GPopup from "@/components/grouped-list-components/GroupedPopup"
import GSwitch from "@/components/grouped-list-components/GroupedSwitch"
import GTextInput from "@/components/grouped-list-components/GroupedTextInput"
import GValueInput from "@/components/grouped-list-components/GroupedValueInput"
import SimpleColorPicker from "@/components/pickers/SimpleColorPicker"
import { useStyle } from "@/context/StyleContext"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"

export type CreditCardFormValues = {
    name: string
    color: string
    limit: number
    closingDay: number
    dueDay: number
    ignoreWeekends: boolean
}

type CreditCardFormProps = {
    initialValues?: Partial<CreditCardFormValues>
    onSubmit: (values: CreditCardFormValues) => Promise<void> | void
    onCancel: () => void
    onValidate?: (values: CreditCardFormValues) => Promise<string | null> | string | null
}

function computeDefaultClosingDay() {
    const today = new Date()
    const day = today.getDate()

    if (day < 1) {
        return 1
    }

    if (day > 31) {
        return 31
    }

    return day
}

function computeDefaultDueDay(closingDay: number) {
    const due = closingDay + 7

    if (due > 31) {
        return due - 31
    }

    return due
}

export default function CreditCardForm({ initialValues, onSubmit, onCancel, onValidate }: CreditCardFormProps) {
    const { theme, layout } = useStyle()
    const { t } = useTranslation()
    const router = useRouter()

    const colors = theme.colors
    const headerHeight = useHeaderHeight()

    const resolvedInitialClosingDay = initialValues?.closingDay ?? computeDefaultClosingDay()
    const resolvedInitialDueDay = initialValues?.dueDay ?? computeDefaultDueDay(resolvedInitialClosingDay)

    const [selectedColor, setSelectedColor] = useState(initialValues?.color ?? colors.gray1)
    const [name, setName] = useState(initialValues?.name ?? "")
    const [ignoreWeekends, setIgnoreWeekends] = useState(initialValues?.ignoreWeekends ?? true)
    const [closingDayModalVisible, setClosingDayModalVisible] = useState(false)
    const [dueDayModalVisible, setDueDayModalVisible] = useState(false)
    const [selectedClosingDay, setSelectedClosingDay] = useState(resolvedInitialClosingDay)
    const [selectedDueDay, setSelectedDueDay] = useState(resolvedInitialDueDay)
    const [limit, setLimit] = useState(initialValues?.limit ?? 0)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const colorOptions = [
        { code: colors.red, label: t("credit.red", { defaultValue: "Vermelho" }) },
        { code: colors.orange, label: t("credit.orange", { defaultValue: "Laranja" }) },
        { code: colors.mint, label: t("credit.mint", { defaultValue: "Menta" }) },
        { code: colors.green, label: t("credit.green", { defaultValue: "Verde" }) },
        { code: colors.cyan, label: t("credit.cyan", { defaultValue: "Ciano" }) },
        { code: colors.purple, label: t("credit.purple", { defaultValue: "Roxo" }) },
        { code: colors.indigo, label: t("credit.indigo", { defaultValue: "Índigo" }) },
        { code: colors.gray1, label: t("credit.gray", { defaultValue: "Cinza" }) },
    ]

    const handleShowError = (message: string) => {
        setErrorMessage(message)
        Alert.alert(
            t("credit.errors.title", { defaultValue: "Não foi possível salvar" }),
            message,
        )
    }

    const handleSave = async () => {
        if (submitting) {
            return
        }

        const trimmedName = name.trim()

        if (!trimmedName) {
            handleShowError(t("credit.errors.emptyName", { defaultValue: "Informe um nome para o cartão." }))
            return
        }

        if (!limit || limit <= 0) {
            handleShowError(t("credit.errors.invalidLimit", { defaultValue: "Informe um limite maior que zero." }))
            return
        }

        if (!selectedClosingDay || !selectedDueDay) {
            handleShowError(t("credit.errors.missingDay", { defaultValue: "Selecione os dias de fechamento e vencimento." }))
            return
        }

        const values: CreditCardFormValues = {
            name: trimmedName,
            color: selectedColor,
            limit,
            closingDay: selectedClosingDay,
            dueDay: selectedDueDay,
            ignoreWeekends,
        }

        setSubmitting(true)

        try {
            if (onValidate) {
                const validationResult = await onValidate(values)
                if (validationResult) {
                    handleShowError(validationResult)
                    return
                }
            }

            await onSubmit(values)
            setErrorMessage(null)
        } catch (error) {
            console.error("Failed to submit credit card form", error)
            handleShowError(t("credit.errors.generic", { defaultValue: "Não foi possível salvar o cartão. Tente novamente." }))
        } finally {
            setSubmitting(false)
        }
    }

    const isPrimaryActive = !submitting && name.trim().length > 0 && limit > 0 && selectedClosingDay > 0 && selectedDueDay > 0

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                paddingTop: headerHeight + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: layout.margin.sectionGap * 2,
                gap: layout.margin.sectionGap,
            }}
        >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <CreditCardView color={selectedColor} name={name} />
            </View>

            <View
                style={{
                    paddingHorizontal: layout.margin.contentArea,
                    borderRadius: layout.radius.groupedView,
                    backgroundColor: theme.fill.secondary,
                }}
            >
                <GTextInput
                    separator={"translucent"}
                    label={t("credit.name", { defaultValue: "Nome" })}
                    value={name}
                    onChangeText={setName}
                    acViewKey={"credit-card-name"}
                    maxLength={20}
                />
                <GValueInput
                    separator={"translucent"}
                    label={t("credit.limit", { defaultValue: "Limite" })}
                    acViewKey={"credit-card-limit"}
                    onChangeNumValue={setLimit}
                    flowType={"inflow"}
                    valueInCents={limit}
                />
                <GPopup
                    separator={"translucent"}
                    label={t("credit.closingDay", { defaultValue: "Fechamento" })}
                    displayValue={selectedClosingDay === 0 ? undefined : selectedClosingDay.toString()}
                    onPress={() => setClosingDayModalVisible(true)}
                />
                <GPopup
                    separator={"translucent"}
                    label={t("credit.dueDay", { defaultValue: "Vencimento" })}
                    displayValue={selectedDueDay === 0 ? undefined : selectedDueDay.toString()}
                    onPress={() => setDueDayModalVisible(true)}
                />
                <GSwitch
                    separator={"none"}
                    label={t("credit.ignoreWeekends", { defaultValue: "Ignorar fins de semana" })}
                    value={ignoreWeekends}
                    onValueChange={setIgnoreWeekends}
                />
            </View>

            <SimpleColorPicker colors={colorOptions} selectedColor={selectedColor} onSelect={setSelectedColor} />

            <TouchableOpacity
                onPress={() => router.push("/(credit)/creditHelp")}
                style={{ alignSelf: "center" }}
            >
                <Text style={{ color: theme.colors.blue, fontSize: 15 }}>
                    {t("credit.form.helpLink", { defaultValue: "Precisa de ajuda com cartões de crédito?" })}
                </Text>
            </TouchableOpacity>

            {errorMessage ? (
                <Text style={{ color: colors.red, textAlign: "center" }}>{errorMessage}</Text>
            ) : null}

            <View>
                <CancelSaveButtons cancelAction={onCancel} primaryAction={handleSave} isPrimaryActive={isPrimaryActive} />
            </View>

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={closingDayModalVisible}
                onRequestClose={() => setClosingDayModalVisible(false)}
                style={{ justifyContent: "center" }}
            >
                <DayPickerModal
                    title={t("credit.closingDay", { defaultValue: "Fechamento" })}
                    selectedDay={selectedClosingDay}
                    onDayPress={(day) => {
                        setSelectedClosingDay(day)
                        if (!initialValues?.dueDay) {
                            setSelectedDueDay((current) => {
                                if (current === resolvedInitialDueDay) {
                                    return computeDefaultDueDay(day)
                                }
                                return current
                            })
                        }
                    }}
                    onBackgroundPress={() => setClosingDayModalVisible(false)}
                />
            </Modal>

            <Modal
                animationType={"fade"}
                transparent={true}
                visible={dueDayModalVisible}
                onRequestClose={() => setDueDayModalVisible(false)}
                style={{ justifyContent: "center" }}
            >
                <DayPickerModal
                    title={t("credit.dueDay", { defaultValue: "Vencimento" })}
                    selectedDay={selectedDueDay}
                    onDayPress={setSelectedDueDay}
                    onBackgroundPress={() => setDueDayModalVisible(false)}
                />
            </Modal>
        </ScrollView>
    )
}
