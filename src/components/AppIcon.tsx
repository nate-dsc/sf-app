import { MaterialIcons } from '@expo/vector-icons';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { Platform } from 'react-native';

type AndroidIconName = ComponentProps<typeof MaterialIcons>["name"];

type AppIconProps = SymbolViewProps & {
    androidName: AndroidIconName
}

export function AppIcon({ androidName, ...rest }: AppIconProps) {

    if (Platform.OS === 'ios') {
        return (
        <SymbolView
            {...rest}
        />
        )
    }

    return (
        <MaterialIcons
            name={androidName}
            size={rest.size}
            color={rest.tintColor ?? "white"}
        />
    )
}