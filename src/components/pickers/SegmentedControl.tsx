import { InputStyles } from "@/components/styles/InputStyles";
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
  return (
    <View style={[InputStyles.segmentContainer, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            InputStyles.segment,
            // Compare the selectedValue (index) with the current item's index
            selectedValue === index && InputStyles.activeSegment,
          ]}
          // Pass the index of the pressed item to the onChange handler
          onPress={() => onChange(index)}
        >
          <Text
            style={[
              InputStyles.segmentText,
              selectedValue === index && InputStyles.activeText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};