import { FontStyles } from "@/components/styles/FontStyles"
import { Text, TextInput, TextInputProps, View } from "react-native"



export default function ValueInput({...rest}: TextInputProps) {
    return(
        <View style={{flexDirection: "row", alignItems: "baseline"}}>
            <View style={{flex: 1}}>
                <Text style={[{marginLeft: 8}, FontStyles.mainTitleLight]}>Value</Text>
            </View>

            <TextInput
                style={[{flex: 1, backgroundColor: "#e0e0e0", borderRadius: 8, padding: 4}, FontStyles.mainNumDisplayLight]}
                placeholder="0.00"
                placeholderTextColor={"black"}
                inputMode="decimal"
                onChangeText={rest.onChangeText}
                textAlign="right"
            />
        </View>
    )
}