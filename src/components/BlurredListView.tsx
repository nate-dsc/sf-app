import { useStyle } from "@/context/StyleContext";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type BlurredListViewProps = {
    title?: string,
    children?: ReactNode;
}

export default function BlurredListView({title, children}: BlurredListViewProps) {

    const {theme} = useStyle()

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "flex-start",
            }}
        >
            {title ? (
                <Text
                    style={{
                        fontSize: 17,
                        fontWeight: "500",
                        paddingHorizontal: 16,
                        color: theme.text.label
                    }}
                >
                    {title}
                </Text>
            ) : null }
            <MaskedView
                style={{ flex: 1}}
                maskElement={
                    <LinearGradient
                        // A máscara define onde o conteúdo será visível (opaco = visível)
                        colors={["transparent", "black", "black", "transparent"]}
                        locations={[0, 0.05, 0.9, 1]}
                        style={StyleSheet.absoluteFill}
                    />
                }
            >
                {children}
            </MaskedView>
        </View>
    );
}