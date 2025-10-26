import { useStyle } from "@/context/StyleContext"
import { useTranslation } from "react-i18next"
import { Text, TouchableOpacity, View } from "react-native"

type CancelSaveButtonsProps = {
    cancelAction: () => void,
    primaryAction: () => void,
    isPrimaryActive: boolean
}

export default function CancelSaveButtons({cancelAction, primaryAction, isPrimaryActive}: CancelSaveButtonsProps) {

    const {theme} = useStyle()
    const {t} = useTranslation()

    return(
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
            }}
        >
            <TouchableOpacity
                onPress={cancelAction}
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 100,
                    paddingVertical: 13,
                    backgroundColor: theme.fill.secondary
                }}
            >
                <Text style={{lineHeight: 22, fontSize: 17, fontWeight: "500", color: theme.text.label}}>
                    {t("buttons.cancel")}
                </Text>
            </TouchableOpacity>

            
            <TouchableOpacity
                onPress={primaryAction}
                disabled={!isPrimaryActive}
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 100,
                    paddingVertical: 13,
                    backgroundColor: isPrimaryActive ? theme.buttons.primary.bg : theme.buttons.primary.bgDisabled
                }}
            >
                <Text style={{lineHeight: 22, fontSize: 17, fontWeight: "500", color: isPrimaryActive ? theme.buttons.primary.label : theme.buttons.primary.labelDisabled}}>
                    {t("buttons.save")}
                </Text>
            </TouchableOpacity>

        </View>
    )
}