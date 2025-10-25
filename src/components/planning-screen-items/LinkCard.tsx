import { useStyle } from "@/context/StyleContext"
import { Ionicons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

type LinkCardProps = {
    label?: string,
    icon?: IoniconName,
    color?: string,
    onPress?: () => void,
}

export default function LinkCard({label, icon, color, onPress}: LinkCardProps) {

    const {theme} = useStyle()

    return(
        <TouchableOpacity onPress={onPress}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: color ?? theme.colors.black,
                    borderRadius: 24,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 16,
                }}
                
            >
                <View style={{paddingTop: 16}}>
                    <Ionicons name={icon ?? "help-outline"} size={36} color={theme.colors.white}/>
                </View>
                <View style={{paddingBottom: 16}}>
                    <Text 
                        style={{fontSize: 18, fontWeight: "500", color: theme.colors.white}}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )

}