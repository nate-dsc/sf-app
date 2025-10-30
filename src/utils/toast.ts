import { Alert, Platform, ToastAndroid } from "react-native"

type ToastType = "success" | "error" | "info"

export function showToast(message: string, _type: ToastType = "info") {
    if (!message) {
        return
    }

    if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.SHORT)
        return
    }

    Alert.alert("", message)
}

