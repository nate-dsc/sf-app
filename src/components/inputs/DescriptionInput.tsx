import { FontStyles } from "@/components/styles/FontStyles"
import { InputStyles } from "@/components/styles/InputStyles"
import { Text, TextInput, TextInputProps, View } from "react-native"



export default function DescriptionInput({...rest}: TextInputProps) {
    return(
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <View style={{flex: 1}}>
                <Text style={[{marginLeft: 8}, FontStyles.mainTitleLight]}>Description</Text>
            </View>

            <TextInput
                style={[InputStyles.smallInputField, FontStyles.secondaryBody]}
                inputMode="text"
                onChangeText={rest.onChangeText}
                textAlign="left"
            />
        </View>
    )
}