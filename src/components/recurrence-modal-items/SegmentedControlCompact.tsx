import { useStyle } from "@/context/StyleContext";
import { SCOption } from "@/types/components";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type SegmentedControlProps<T> = {
  options: SCOption<T>[];
  selectedValue: T;
  onChange: (selectedValue: T) => void;
  disabledOptions?: T[];
}

export default function SegmentedControlCompact<T>({ options, selectedValue, onChange, disabledOptions = []}: SegmentedControlProps<T>) {

    const {theme} = useStyle()

    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 0,
            borderRadius: 100,
            borderCurve: "continuous",
            padding: 4,
            backgroundColor: theme.fill.tertiary,
            gap: 0
        }}>
        {options.map((option) => {
            const isDisabled = disabledOptions.some((value) => value === option.value)

            return (
                <TouchableOpacity
                    key={option.label}
                    style={[{
                            flex: 1,
                            flexDirection: "row",
                            paddingVertical: 5,
                            paddingHorizontal: 4,
                            alignContent: "center",
                            justifyContent: "center",
                            borderRadius: 100,
                            borderCurve: "continuous",
                            backgroundColor: "transparent"
                        },
                        selectedValue === option.value && {
                            backgroundColor: theme.segmentedControl.selected,
                            shadowColor: "#000000",
                            shadowRadius: 15,
                            shadowOpacity: 0.06,
                            shadowOffset: {width: 0, height: 2}
                        },
                        isDisabled && {
                            opacity: 0.6,
                        }]
                    }
                    onPress={() => {
                        if (!isDisabled) {
                            onChange(option.value)
                        }
                    }}
                    disabled={isDisabled}
                >
                    <Text
                        style={[
                            { lineHeight: 18, fontSize: 14, color: theme.text.label },
                            selectedValue === option.value && { fontWeight: "600" },
                            isDisabled && { color: theme.text.secondaryLabel },
                        ]}
                        ellipsizeMode="clip"
                        numberOfLines={1}
                    >
                        {option.label}
                    </Text>
                </TouchableOpacity>
            )
        })}
        </View>
    );
};