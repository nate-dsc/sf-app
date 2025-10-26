import { useStyle } from "@/context/StyleContext"
import { useTranslation } from "react-i18next"
import { Text, View } from "react-native"

export default function AddInstallmentModalPlaceholder() {
    const { theme, layout } = useStyle()
    const { t } = useTranslation()

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.background.group.secondaryBg,
                alignItems: "center",
                justifyContent: "center",
                padding: layout.margin.contentArea,
            }}
        >
            <Text
                style={{
                    color: theme.text.label,
                    fontSize: 16,
                    lineHeight: 24,
                    textAlign: "center",
                    fontWeight: "500",
                }}
            >
                {t("modalAddInstallment.placeholder", { defaultValue: "Tela de compra parcelada em desenvolvimento." })}
            </Text>
        </View>
    )
}
