import { useStyle } from "@/context/StyleContext"
import { useTranslation } from "react-i18next"
import { Text, View, ViewStyle } from "react-native"
import { FontStyles } from "../styles/FontStyles"


type DistributionProps = {
    value?: number,
    description?: string,
    isOutflow?: boolean,
    style?: ViewStyle
}

export default function DistributionTile({value, description, isOutflow, style}: DistributionProps) {

    const {t} = useTranslation()
    const {theme} = useStyle()

    return(
        <View style={{gap: 6}}>
            <View style={{paddingHorizontal: 16}}>
                <Text style={[FontStyles.title3,{ color: theme.text.label}]}>
                    {t("tiles.distribution")}
                </Text>
            </View>
            <View 
                style={{
                    aspectRatio: 1,
                    backgroundColor: theme.background.elevated.bg,
                    borderWidth: 1,
                    borderColor: theme.background.tertiaryBg,
                    borderRadius: 24,
                    padding: 15
                }}
            >
                <Text
                    style={[{textAlign: "right", color: theme.text.label}, FontStyles.numTitle1]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    placeholder
                </Text>
            </View>
        </View>
    )

}