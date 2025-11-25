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
    borderWidth: number,
    height: number
}

export default function AddButton({borderWidth, height}: AddButtonProps) {
    const router = useRouter()
    const { theme } = useStyle()

    const scale = useSharedValue(1)

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }))

    return (
        <Pressable
                    onPress={() => router.push("/modalAdd")}
                    onPressIn={() => (scale.value = withSpring(1.1, { damping: 15 }))}
                    onPressOut={() => (scale.value = withSpring(1, { damping: 15 }))}
                >
                    <Animated.View
                        style={[{
                            height: height,
                            aspectRatio: 1,
                            borderRadius: 999,
                            borderWidth: borderWidth,
                            borderColor: "rgba(59, 218, 99, 1)",
                            backgroundColor: theme.colors.green,
                            justifyContent: "center",
                            alignItems: "center",},
                            animStyle
                        ]}
                    >
                        <AppIcon
                            name={"plus"}
                            androidName={"add"}
                            size={35}
                            tintColor={theme.colors.white}
                        />
                    </Animated.View>
                </Pressable>
    )
}