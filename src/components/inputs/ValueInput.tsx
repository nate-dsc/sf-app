import { FontStyles } from "@/components/styles/FontStyles"
import { InputStyles } from "@/components/styles/InputStyles"
import { Text, TextInput, TextInputProps, View } from "react-native"



export default function ValueInput({...rest}: TextInputProps) {
    return(
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <View style={{flex: 1}}>
                <Text style={[{marginLeft: 8}, FontStyles.mainTitleLight]}>Value</Text>
            </View>

            <TextInput
                style={[InputStyles.smallInputField, FontStyles.mainNumDisplayLight]}
                placeholder="0.00"
                placeholderTextColor={"black"}
                inputMode="decimal"
                onChangeText={rest.onChangeText}
                textAlign="right"
            />
        </View>
    )
}