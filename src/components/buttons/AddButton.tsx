import { useStyle } from "@/context/StyleContext"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
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

    const [menuOpen, setMenuOpen] = useState(false);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const insets = useSafeAreaInsets();

    function openMenu() {
        setMenuOpen(true);
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    function handleOptionPress(path: string) {
        closeMenu();
        //router.navigate(path);
    }

        
    return(
        <>
            <Pressable
                onPress={openMenu}
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

            <Modal
                visible={menuOpen}
                transparent
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <View style={StyleSheet.absoluteFill}>
                {/* área clicável para fechar ao tocar fora */}
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={closeMenu}
                />

                {/* container que posiciona as opções acima da tab bar */}
                <View
                    pointerEvents="box-none"
                    style={[
                    styles.menuPositionContainer,
                    {
                        paddingBottom: 70 + insets.bottom + 8, // sem hardcode de layout
                    },
                    ]}
                >
                    <View style={styles.menuContainer}>
                    <Pressable
                        style={[
                        styles.optionButton,
                        { backgroundColor: theme.colors.red },
                        ]}
                        onPress={() => handleOptionPress("/modalAdd?type=expense")}
                    >
                        <Text style={styles.optionText}>Despesa</Text>
                    </Pressable>

                    <Pressable
                        style={[
                        styles.optionButton,
                        { backgroundColor: theme.colors.blue },
                        ]}
                        onPress={() => handleOptionPress("/modalAdd?type=income")}
                    >
                        <Text style={styles.optionText}>Receita</Text>
                    </Pressable>

                    <Pressable
                        style={[
                        styles.optionButton,
                        { backgroundColor: theme.colors.orange },
                        ]}
                        onPress={() => handleOptionPress("/modalAdd?type=transfer")}
                    >
                        <Text style={styles.optionText}>Transferência</Text>
                    </Pressable>
                    </View>
                </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
  menuPositionContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  menuContainer: {
    gap: 8,
    alignItems: "flex-end",
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
  },
  optionText: {
    color: "white",
    fontWeight: "600",
  },
});