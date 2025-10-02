import { SStyles } from "@/components/styles/ScreenStyles"
import { useHeaderHeight } from "@react-navigation/elements"
import { useState } from "react"
import { ScrollView } from "react-native"

export default function Experiment() {

    const [category, setCategory] = useState("")

    const [selectedIndex, setSelectedIndex] = useState(0);
    const segmentOptions = ["Escolha1", "Escolha2"];
    
    const headerHeight = useHeaderHeight()

    return(
        <ScrollView contentContainerStyle={[{paddingTop: headerHeight, marginTop: 4}, SStyles.mainContainer]}>

        </ScrollView>
    )
}