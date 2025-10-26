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
                alignItems: "center",
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
                        rowGap: layout.margin.innerSectionGap,
                        backgroundColor: theme.background.group.secondaryBg,
                        borderWidth: layout.border.thin,
                        borderColor: theme.background.tertiaryBg,
                        padding: layout.spacing.md,
                        borderRadius: layout.radius.modal,
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