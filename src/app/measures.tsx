import { SStyles } from "@/components/styles/ScreenStyles";
import { useHeaderHeight } from "@react-navigation/elements";
import { useState } from "react";
import { LayoutChangeEvent, ScrollView, StyleSheet, Text, View } from "react-native";

export default function MeasuresScreen() {
    
    const paddingTop = useHeaderHeight() + 10

    const [componentHeight, setComponentHeight] = useState(0);

    const onLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setComponentHeight(height);
    };

    return(
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer]}>

            <View onLayout={onLayout} style={styles.measuredComponent}>
                
            </View>
            <Text style={styles.heightText}>
                A altura do componente é: {componentHeight.toFixed(2)} pixels
            </Text>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  measuredComponent: {
    backgroundColor: 'red',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  heightText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "red"
  },
});