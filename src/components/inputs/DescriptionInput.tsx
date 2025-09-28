import { FontStyles } from "@/components/styles/FontStyles"
import { Text, TextInput, TextInputProps, View } from "react-native"



export default function DescriptionInput({...rest}: TextInputProps) {
    return(
        <View style={{flexDirection: "row", alignItems: "baseline"}}>
            <View style={{flex: 1}}>
                <Text style={[{marginLeft: 8}, FontStyles.mainTitleLight]}>Description</Text>
            </View>

            <TextInput
                style={[{flex: 1, backgroundColor: "#e0e0e0", borderRadius: 8, padding: 4, paddingVertical: 6}, FontStyles.secondaryBody]}
                inputMode="text"
                onChangeText={rest.onChangeText}
                textAlign="left"
            />
        </View>
    )
}