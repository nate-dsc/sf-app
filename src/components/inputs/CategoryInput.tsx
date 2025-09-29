import { FontStyles } from "@/components/styles/FontStyles"
import { InputStyles } from "@/components/styles/InputStyles"
import { Pressable, PressableProps, Text, View } from "react-native"



export default function CategoryInput({...rest}: PressableProps) {
    return(
        <View style={[{flexDirection: "row", alignItems: "baseline"}, InputStyles.smallInputField]}>
            <Text
                style={[{flex: 2}, FontStyles.body]}
            >
                Description
            </Text>
            <Pressable style={{flex: 3, alignItems: "flex-end"}} onPress={rest.onPress}>
                <Text
                    style={[FontStyles.body]}
                >
                    Select
                </Text>
            </Pressable>

        </View>
    )
}