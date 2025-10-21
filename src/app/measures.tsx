import GDateInput from "@/components/grouped-list-components/GroupedDateInput";
import { SStyles } from "@/components/styles/ScreenStyles";
import { useTheme } from "@/context/ThemeContext";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";

export default function MeasuresScreen() {
    
    const paddingTop = useHeaderHeight() + 10

    const [componentHeight, setComponentHeight] = useState(0);

    const router = useRouter()

    const onLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setComponentHeight(height);
    };

    const [pickedDays, setPickedDays] = useState<number | number[]>(7);

    // The handler function's parameter is typed to match the child's output
    const handleSelectionChange = useCallback((days: number | number[]) => {
      console.log('Selection changed:', days);
      setPickedDays(days);
    },[]);

    const {theme} = useTheme()

    return(
        <View style={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer]}>

            <View onLayout={onLayout} style={styles.measuredComponent}>
                <View style={{paddingHorizontal: 16, borderRadius: 26, backgroundColor: theme.fill.secondary}}>
                    <GDateInput
                        separator={"translucent"}
                        label={"Data inicial"}
                        value={new Date()}
                        onDateChange={()=>{}}
                    />
                    <GDateInput
                        separator="none"
                        label="Data final"
                        value={new Date()}
                        onDateChange={()=>{}}
                    />
                </View>
            </View>
            <Text style={styles.heightText}>
                A altura do componente é: {componentHeight.toFixed(2)} pixels
            </Text>

        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  measuredComponent: {
    backgroundColor: 'yellow',
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