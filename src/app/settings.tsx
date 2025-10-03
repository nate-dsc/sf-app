import CSwitch from "@/components/menu-items/CSwitch"
import DatePicker from "@/components/menu-items/DatePicker"
import DescriptionInput from "@/components/menu-items/DescriptionInput"
import { MIStyles } from "@/components/menu-items/MenuItemStyles"
import Redir from "@/components/menu-items/Redir"
import SRedir from "@/components/menu-items/RedirSelect"
import SegmentedControl from "@/components/menu-items/SegmentedControl"
import ValueInput from "@/components/menu-items/ValueInput"
import { FontStyles } from "@/components/styles/FontStyles"
import { SStyles } from "@/components/styles/ScreenStyles"
import { useTheme } from "@/context/ThemeContext"
import { indexToPreference, preferenceToIndex } from "@/utils/ThemeUtils"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView, Text } from "react-native"

export default function SettingsScreen() {

    const router = useRouter()
    const {theme, preference, setPreference} = useTheme()

    const [category, setCategory] = useState("")
    const [selectedIndex, setSelectedIndex] = useState<number>(preferenceToIndex(preference))
    
    const menuStyles = MIStyles(theme)
    
    const paddingTop = useHeaderHeight() + 10

    const segmentOptions = ["Sistema", "Claro", "Escuro"];

    useEffect(() => {setSelectedIndex(preferenceToIndex(preference))}, [preference])

    return(
        <ScrollView contentContainerStyle={[{paddingTop: paddingTop, marginTop: 4}, SStyles.mainContainer]}>
            <Redir iconName="hammer" text="Tests" onPress={() => {router.push("/experiment")}} />

            <Redir text="No icon!" onPress={() => {setCategory("casa")}} />

            <SRedir text="Selecionar!!" selected={category} onPress={() => {}}/>

            <DatePicker text="Data!!"/>

            <CSwitch text="uma switch" />

            <ValueInput leftText="TESTE" />

            <DescriptionInput leftText="teste"/>

            <Text style={[{color: menuStyles.text.color}, FontStyles.title3]}> Tema do aplicativo </Text>

            <SegmentedControl
                options={segmentOptions}
                selectedValue={selectedIndex}
                onChange={(index) => {setSelectedIndex(index); setPreference(indexToPreference(index))}}
            />

        </ScrollView>
    )
}