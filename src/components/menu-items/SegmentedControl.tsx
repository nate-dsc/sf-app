import { useTheme } from "@/context/ThemeContext";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontStyles } from "../styles/FontStyles";
import { MIStyles } from "./MenuItemStyles";

// Type definition for the component's props
type SegmentedControlProps = {
  options: string[];
  selectedValue: number;
  onChange: (selectedIndex: number) => void;
};

export default function SegmentedControl({ options, selectedValue, onChange}: SegmentedControlProps) {

  const theme = useTheme()
  const menuStyles = MIStyles(theme.theme)

  return (
    <View style={[menuStyles.segmentContainer]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            menuStyles.segment,
            // Compare the selectedValue (index) with the current item's index
            selectedValue === index && menuStyles.activeSegment,
          ]}
          // Pass the index of the pressed item to the onChange handler
          onPress={() => onChange(index)}
        >
          <Text
            style={[
              FontStyles.body,
              menuStyles.textUnfocused,
              selectedValue === index && menuStyles.textOverTint,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};