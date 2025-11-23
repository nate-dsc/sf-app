import GButton from "@/components/grouped-list-components/GroupedLabeledButton"
import GroupView from "@/components/grouped-list-components/GroupView"
import { useStyle } from "@/context/StyleContext"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native"

export default function MeasuresScreen() {
    
    const paddingTop = useHeaderHeight() + 10

    const [componentHeight, setComponentHeight] = useState(0)

    const router = useRouter()

    const onLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout
        setComponentHeight(height)
    }

    const [pickedDays, setPickedDays] = useState<number | number[]>(7)

    // The handler function's parameter is typed to match the child's output
    const handleSelectionChange = useCallback((days: number | number[]) => {
        console.log('Selection changed:', days)
        setPickedDays(days)
    },[])

    const {theme, layout} = useStyle()

    return(
        <View
            style={{
                paddingTop: paddingTop,
                marginTop: 4,
                flex: 1,
                padding: 16,
                gap: 12
            }}
        >

            <View onLayout={onLayout} style={styles.measuredComponent}>
                <GroupView>
                    <GButton
                        separator={"none"}
                        label={"Teste"}
                        onPress={() => {console.log("botao apertado")}}
                        buttonLabel="Label"
                        buttonIcon="chevron-forward"
                        isAccented={false}
                    />
                </GroupView>
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
})

/**
 * 
 * <GRedir
                        separator={"translucent"}
                        icon={"hammer"}
                        label={"Teste 1"}
                        onPress={() => {router.push("/experiment")}}
                    />
                    <GRedir
                        separator={"none"}
                        icon={"hammer"}
                        label={"Teste 2"}
                        onPress={() => {router.push("/experiment2")}}
                    />
 */