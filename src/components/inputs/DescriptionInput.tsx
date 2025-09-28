import { FontStyles } from "@/components/styles/FontStyles"
import { InputStyles } from "@/components/styles/InputStyles"
import { Text, TextInput, TextInputProps, View } from "react-native"



export default function DescriptionInput({...rest}: TextInputProps) {
    return(
        <View style={[{flexDirection: "row", alignItems: "baseline"}, InputStyles.smallInputField]}>
            <Text
                style={[{flex: 2}, FontStyles.body]}
            >
                Description
            </Text>
            <TextInput
                style={[{flex: 3}, FontStyles.body]}
                inputMode="text"
                placeholder="None"
                placeholderTextColor={"gray"}
                onChangeText={rest.onChangeText}
                textAlign="right"
            />

        </View>
    )
}