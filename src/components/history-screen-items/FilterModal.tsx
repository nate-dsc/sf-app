import { useTheme } from "@/context/ThemeContext"
import { BlurView } from "expo-blur"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { FontStyles } from "../styles/FontStyles"

type FilterModalProps = {
    onBackgroundPress: () => void,
}

export default function FilterModal({onBackgroundPress}: FilterModalProps) {

    const {t} = useTranslation()
    const {theme} = useTheme()

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
            <View style={{
                rowGap: 12,
                backgroundColor: theme.background.group.secondaryBg,
                borderWidth: 1,
                borderColor: theme.background.tertiaryBg,
                padding: 13,
                borderRadius: 34,
                borderCurve: "continuous",
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 32,
                shadowOffset: {width: 0, height: 0}}}
            >

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 100,
                        paddingVertical: 13,
                        backgroundColor: theme.fill.secondary
                    }}>
                        <Text style={[FontStyles.body, {fontWeight: "500", color: theme.text.label}]}>Secondary</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 100,
                        paddingVertical: 13,
                        backgroundColor: theme.colors.blue
                    }}>
                        <Text style={[FontStyles.body, {fontWeight: "500", color: theme.colors.white}]}>Primary</Text>
                    </TouchableOpacity>

                </View>


               
            </View>
        </Pressable>
    )    

}