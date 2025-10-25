import { useStyle } from "@/context/StyleContext"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"

type ColorOption = {
  code: string
  label: string
}

type SimpleColorPickerProps = {
  colors: ColorOption[]
  selectedColor?: string
  onSelect: (color: string) => void
}

export default function SimpleColorPicker({ colors, selectedColor, onSelect }: SimpleColorPickerProps) {

    const {theme} = useStyle()
    
    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 16,
            }}
        >
        {colors.map((item, index) => (
            <View
                key={item.code}
                style={{
                    width: "20%",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    onPress={() => onSelect(item.code)}
                    activeOpacity={0.8}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 50,
                        height: 50,
                        borderRadius: 25
                    }}
                >
                    <View 
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            borderWidth: 2,
                            borderColor: selectedColor === item.code ? theme.colors.blue : theme.text.quaternaryLabel
                        }}
                    >
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                backgroundColor: item.code
                            }}
                        />
                    </View>
                    
                </TouchableOpacity>
                <Text 
                    style={{
                        fontSize: 12,
                        lineHeight: 16,
                        fontWeight: "500",
                        textAlign: "center",
                        color: theme.text.label
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.label}
                </Text>
            </View>
        ))}
        </View>
    )
}