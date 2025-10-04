import { useTheme } from "@/context/ThemeContext";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontStyles } from "../styles/FontStyles";
import { MIStyles } from "./MenuItemStyles";


export type SCOption = {
  key: string,
  value: string
}

type SegmentedControlProps = {
  options: SCOption[];
  selectedValue: string;
  onChange: (selectedIndex: string) => void;
}

export default function SegmentedControl({ options, selectedValue, onChange}: SegmentedControlProps) {

  const theme = useTheme()
  const menuStyles = MIStyles(theme.theme)

  return (
    <View style={[menuStyles.segmentContainer]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            menuStyles.segment,
            // Se o valor selecionado for a key da opção atual
            selectedValue === option.key && menuStyles.activeSegment,
          ]}
          // Passa a chave da opção pro handler onChange
          onPress={() => onChange(option.key)}
        >
          <Text
            style={[
              FontStyles.body,
              menuStyles.textUnfocused,
              selectedValue === option.key && menuStyles.textOverTint,
            ]}
          >
            {option.value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};