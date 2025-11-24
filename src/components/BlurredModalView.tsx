import { useStyle } from "@/context/StyleContext";
import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { Pressable, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from "react-native";

type BlurredModalViewProps = {
    onBackgroundPress: () => void,
    children?: ReactNode;
    style?: ViewStyle | ViewStyle[];
};

export default function BlurredModalView({ onBackgroundPress, children, style }: BlurredModalViewProps) {

    const { theme, layout } = useStyle();

    return (
        <Pressable
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "stretch",
                paddingHorizontal: layout.margin.transparentModal,
            }}
            onPress={onBackgroundPress}
        >
            <BlurView
                style={StyleSheet.absoluteFill}
                intensity={10}
                tint="default"
            />
            <TouchableWithoutFeedback>
                <View
                    style={{
                        backgroundColor: theme.background.secondaryBg,
                        padding: 16,
                        borderRadius: 34,
                        borderCurve: "continuous",
                        shadowColor: "#000",
                        shadowOpacity: 0.2,
                        shadowRadius: 32,
                        shadowOffset: {width: 0, height: 0}
                    }}
                >
                    {children}
                </View>
            </TouchableWithoutFeedback>
        </Pressable>
    )
}