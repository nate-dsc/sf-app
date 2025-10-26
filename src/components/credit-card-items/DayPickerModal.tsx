import { useStyle } from "@/context/StyleContext"
import { BlurView } from "expo-blur"
import { useTranslation } from "react-i18next"
import { Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"
import SingleDayPicker from "./SingleDayPicker"

type DayPickerModalProps = {
    title: string,
    selectedDay: number,
    onDayPress: (day: number) => void,
    onBackgroundPress: () => void,
}

export default function DayPickerModal({title, selectedDay, onDayPress, onBackgroundPress}: DayPickerModalProps) {

    const {t} = useTranslation()
    const {theme} = useStyle()

    const handleDayPress = (day: number) => {
        onDayPress(day)
        onBackgroundPress()
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
                <View style={{paddingHorizontal: 16}}>
                    <Text
                        style={{
                            lineHeight: 22,
                            fontSize: 17,
                            fontWeight: "600",
                            color: theme.text.label
                        }}
                    >
                        {title}
                    </Text>
                </View>

                <SingleDayPicker
                    selectedDay={selectedDay}
                    onDayPress={handleDayPress}
                />
               
            </View>
            </TouchableWithoutFeedback>
        </Pressable>
    )    

}