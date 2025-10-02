import CSwitch from "@/components/menu-items/CSwitch"
import DatePicker from "@/components/menu-items/DatePicker"
import DescriptionInput from "@/components/menu-items/DescriptionInput"
import Redir from "@/components/menu-items/Redir"
import SRedir from "@/components/menu-items/RedirSelect"
import SegmentedControl from "@/components/menu-items/SegmentedControl"
import ValueInput from "@/components/menu-items/ValueInput"
import { SStyles } from "@/components/styles/ScreenStyles"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView } from "react-native"

export default function SettingsScreen() {

    const router = useRouter()

    const [category, setCategory] = useState("")

    const [selectedIndex, setSelectedIndex] = useState(0);
    const segmentOptions = ["Escolha1", "Escolha2","Escolha3"];
    
    const paddingTop = useHeaderHeight() + 10

    return(
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer]}>
            <Redir iconName="hammer" text="Tests" onPress={() => {router.push("/experiment")}} />

            <Redir text="No icon!" onPress={() => {setCategory("casa")}} />

            <SRedir text="Selecionar!!" selected={category} onPress={() => {}}/>

            <DatePicker text="Data!!"/>

            <CSwitch text="uma switch" />

            <ValueInput leftText="TESTE" />

            <DescriptionInput leftText="teste"/>

            <SegmentedControl
                options={segmentOptions}
                selectedValue={selectedIndex}
                onChange={setSelectedIndex}
            />

        </ScrollView>
    )
}