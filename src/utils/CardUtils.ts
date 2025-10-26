
export function getIDfromColor(code: string, theme: any): number {

    const colorOptions = [
        { code: theme.colors.red, id: 0 },
        { code: theme.colors.orange, id: 1 },
        { code: theme.colors.mint, id: 2 },
        { code: theme.colors.green, id: 3 },
        { code: theme.colors.cyan, id: 4 },
        { code: theme.colors.purple, id: 5 },
        { code: theme.colors.indigo, id: 6 },
        { code: theme.colors.gray1, id: 7 },
    ]

    const color = colorOptions.find(item => item.code === code)

    return (color ? color.id : 7)
}

export function getColorFromID(id: number, theme: any): string {

    const colorOptions = [
        { code: theme.colors.red, id: 0 },
        { code: theme.colors.orange, id: 1 },
        { code: theme.colors.mint, id: 2 },
        { code: theme.colors.green, id: 3 },
        { code: theme.colors.cyan, id: 4 },
        { code: theme.colors.purple, id: 5 },
        { code: theme.colors.indigo, id: 6 },
        { code: theme.colors.gray1, id: 7 },
    ]

    const color = colorOptions.find(item => item.id === id)

    return (color ? color.code : theme.colors.gray1)
}