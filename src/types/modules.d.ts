declare module "react-native-gifted-charts" {
    import { ComponentType, ReactNode } from "react"
    import { ViewStyle } from "react-native"

    export type PieChartDataItem = {
        value: number
        color: string
        gradientCenterColor?: string
        text?: string
        textColor?: string
    }

    export type PieChartProps = {
        data: PieChartDataItem[]
        donut?: boolean
        innerRadius?: number
        radius?: number
        sectionAutoFocus?: boolean
        centerLabelComponent?: () => ReactNode
        backgroundColor?: string
        strokeWidth?: number
        strokeColor?: string
        focusOnPress?: boolean
        style?: ViewStyle
    }

    export const PieChart: ComponentType<PieChartProps>
}
