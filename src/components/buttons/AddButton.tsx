import { useStyle } from "@/context/StyleContext"
import { useRouter } from "expo-router"
import { Pressable } from "react-native"
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated"
import { AppIcon } from "../AppIcon"


type AddButtonProps = {
    size?: number,
    //onPress?: () => void
}

export default function AddButton({size=40}: AddButtonProps) {

    const router = useRouter()
    const {theme} = useStyle()
    const iconSize = size - 2

    const scale = useSharedValue(1);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    
    return(
        <Pressable
            onPress={() => router.navigate("/modalAdd")}
            //onPressIn={() => (scale.value = withSpring(1.2))}
            //onPressOut={() => (scale.value = withSpring(1))}
            onPressIn={() => (scale.value = withSpring(1.1, { damping: 15 }))} 
            onPressOut={() => (scale.value = withSpring(1, { damping: 15 }))} 
        >
            <Animated.View
                style={[{
                    height: 60,
                    aspectRatio: 1,
                    borderRadius: 999,
                    zIndex: 1,
                    backgroundColor: theme.colors.green,
                    borderWidth: 1,
                    borderColor: "#3ADD63",
                    justifyContent: "center",
                    alignItems: "center",

                    shadowColor: "#000",
                    shadowRadius: 10,
                    shadowOffset: {width: 0, height: 10},
                    shadowOpacity: 0.15,},
                    animStyle
                ]}
            >
                <AppIcon
                    name="plus"
                    androidName="add"
                    size={35}
                    tintColor={theme.colors.white}
                />
            </Animated.View>
        </Pressable>
    )

}