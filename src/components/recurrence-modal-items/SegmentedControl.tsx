/* import { useStyle } from "@/context/StyleContext";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontStyles } from "../styles/FontStyles";
import { MIStyles } from "./MenuItemStyles";




type SegmentedControlProps<T> = {
  options: SCOption<T>[];
  selectedValue: T;
  onChange: (selectedValue: T) => void;
}

export default function SegmentedControl<T>({ options, selectedValue, onChange}: SegmentedControlProps<T>) {

  const {theme} = useStyle()
  const menuStyles = MIStyles(theme)

  return (
    <View style={[menuStyles.segmentContainer]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.label}
          style={[
            menuStyles.segment,
            // Se o valor selecionado for a key da opção atual
            selectedValue === option.value && menuStyles.activeSegment]}
          // Passa a chave da opção pro handler onChange
          onPress={() => onChange(option.value)}
        >
          <Text
            style={[
              FontStyles.body,
              {color: theme.text.tertiaryLabel},
              selectedValue === option.value && menuStyles.textOverTint,
            ]}
            ellipsizeMode="clip"
            numberOfLines={1}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}; */