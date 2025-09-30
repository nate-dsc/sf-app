import { InputStyles } from "@/components/styles/InputStyles";
import { useTheme } from "@/context/ThemeContext";
import React from 'react';
import { Text, TouchableOpacity, View, type ViewStyle } from 'react-native';

// Type definition for the component's props
type SegmentedControlProps = {
  options: string[];
  selectedValue: number;
  onChange: (selectedIndex: number) => void;
  style?: ViewStyle;
};

export default function SegmentedControl({ options, selectedValue, onChange, style }: SegmentedControlProps) {

  const theme = useTheme()
  const inputStyles = InputStyles(theme)

  return (
    <View style={[inputStyles.segmentContainer, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            inputStyles.segment,
            // Compare the selectedValue (index) with the current item's index
            selectedValue === index && inputStyles.activeSegment,
          ]}
          // Pass the index of the pressed item to the onChange handler
          onPress={() => onChange(index)}
        >
          <Text
            style={[
              inputStyles.segmentText,
              selectedValue === index && inputStyles.activeText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};