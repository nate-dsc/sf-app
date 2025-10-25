import { useStyle } from "@/context/StyleContext";
import { InputAccessoryView, Keyboard, Text, TouchableOpacity, View } from "react-native";

type DoneACViewProps = {
    acKey: string
}

export default function DoneACView({acKey}: DoneACViewProps) {

    const {theme} = useStyle()

    return(
        <InputAccessoryView nativeID={acKey}>
            <View style={{
                width: '100%',
                paddingBottom: 6,
                paddingHorizontal: 16,
                alignItems: 'flex-end',
            }}>
                <TouchableOpacity onPress={Keyboard.dismiss}>
                    <View style={{paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100, backgroundColor: theme.colors.blue}}>
                        <Text style={{lineHeight: 22, fontSize: 17, color: theme.colors.white}}>
                            Concluído
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </InputAccessoryView>
    )
}