import { light } from "@/constants/Colors"
import { TextProps } from "react-native"


export const TypographyProps = (theme: typeof light) => ({
    popupTitle: {
        style: {
            lineHeight: 22,
            fontSize: 17,
            fontWeight: "600",
            color: theme.text.label
        },
        numberOfLines: 1,
        ellipsizeMode: "tail",
    } satisfies TextProps,
    bodyLabel: {
        style: {
            flex: 1,
            lineHeight: 22,
            fontSize: 17,
            color: theme.text.label
        },
        numberOfLines: 1,
        ellipsizeMode: "tail",
    } satisfies TextProps,
})