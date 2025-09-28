import { FontStyles } from "@/components/styles/FontStyles"
import { InputStyles } from "@/components/styles/InputStyles"
import { Text, TextInput, TextInputProps, View } from "react-native"



export default function ValueInput({...rest}: TextInputProps) {
    return(
        <View style={[{flexDirection: "row", alignItems: "center"}, InputStyles.smallInputField]}>
            <Text
                style={[{flex: 2}, FontStyles.body]}
            >
                Value
            </Text>

            <TextInput
                style={[{flex: 3}, FontStyles.numBody]}
                placeholder="0.00"
                placeholderTextColor={"gray"}
                inputMode="decimal"
                onChangeText={rest.onChangeText}
                textAlign="right"
            />
        </View>
    )
}