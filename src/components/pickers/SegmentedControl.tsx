import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';

// Type definition for the component's props
type SegmentedControlProps = {
  options: string[];
  selectedValue: number;
  onChange: (selectedIndex: number) => void;
  style?: ViewStyle;
};

export default function SegmentedControl({ options, selectedValue, onChange, style }: SegmentedControlProps) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.segment,
            // Compare the selectedValue (index) with the current item's index
            selectedValue === index && styles.activeSegment,
          ]}
          // Pass the index of the pressed item to the onChange handler
          onPress={() => onChange(index)}
        >
          <Text
            style={[
              styles.segmentText,
              selectedValue === index && styles.activeText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegment: {
    backgroundColor: '#007AFF',
  },
  segmentText: {
    fontSize: 18,
    color: '#007AFF',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});