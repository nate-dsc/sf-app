import GroupView from "@/components/grouped-list-components/GroupView"
import { FontStyles } from "@/components/styles/FontStyles"
import { SStyles } from "@/components/styles/ScreenStyles"
import { useStyle } from "@/context/StyleContext"
import { useHeaderHeight } from "@react-navigation/elements"
import { useLocalSearchParams, useNavigation } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import { useSQLiteContext } from "expo-sqlite"

type TableColumn = {
    name: string
    type: string
    notnull: number
    dflt_value: unknown
    pk: number
}

type TableRow = Record<string, unknown>

function formatValue(value: unknown) {
    if (value === null || value === undefined) {
        return "NULL"
    }

    if (typeof value === "string") {
        return value
    }

    if (typeof value === "number" || typeof value === "boolean") {
        return String(value)
    }

    return JSON.stringify(value)
}

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export default function SettingsDatabaseTableScreen() {
    const { theme } = useStyle()
    const { t } = useTranslation()
    const navigation = useNavigation()
    const database = useSQLiteContext()
    const { table } = useLocalSearchParams<{ table?: string | string[] }>()

    const tableName = useMemo(() => {
        if (!table) return null
        return Array.isArray(table) ? table[0] : table
    }, [table])

    const [columns, setColumns] = useState<TableColumn[]>([])
    const [rows, setRows] = useState<TableRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const paddingTop = useHeaderHeight() + 10

    useEffect(() => {
        if (tableName) {
            navigation.setOptions({ title: tableName })
        }
    }, [navigation, tableName])

    useEffect(() => {
        let isMounted = true

        async function loadTableData() {
            if (!tableName) {
                if (isMounted) {
                    setLoading(false)
                    setColumns([])
                    setRows([])
                    setError(t("settings.database.missingTable", { defaultValue: "Nenhuma tabela selecionada." }))
                }
                return
            }

            setLoading(true)
            setError(null)

            try {
                const safeName = quoteIdentifier(tableName)
                const tableInfo = await database.getAllAsync<TableColumn>(`PRAGMA table_info(${safeName})`)
                const tableRows = await database.getAllAsync<TableRow>(`SELECT * FROM ${safeName}`)

                if (isMounted) {
                    setColumns(tableInfo)
                    setRows(tableRows)
                }
            } catch (error) {
                console.error(`Erro ao carregar dados da tabela ${tableName}`, error)
                if (isMounted) {
                    setColumns([])
                    setRows([])
                    setError(t("settings.database.tableLoadError", { defaultValue: "Não foi possível carregar os dados da tabela." }))
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadTableData()

        return () => {
            isMounted = false
        }
    }, [database, tableName, t])

    return (
        <ScrollView
            style={{ backgroundColor: theme.background.bg }}
            contentContainerStyle={[{ paddingTop, marginTop: 4 }, SStyles.mainContainer, { gap: 16 }]}
        >
            {loading ? (
                <View style={{ alignItems: "center", gap: 8 }}>
                    <ActivityIndicator size="large" color={theme.colors.blue} />
                    <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>
                        {t("settings.database.loadingTable", { defaultValue: "Carregando dados da tabela..." })}
                    </Text>
                </View>
            ) : error ? (
                <Text style={[FontStyles.body, { color: theme.colors.red }]}>{error}</Text>
            ) : (
                <>
                    <View style={{ gap: 12 }}>
                        <Text style={[FontStyles.title2, { color: theme.text.label }]}>
                            {t("settings.database.columnsHeader", { defaultValue: "Colunas" })}
                        </Text>
                        {columns.length === 0 ? (
                            <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>
                                {t("settings.database.noColumns", { defaultValue: "Nenhuma coluna encontrada." })}
                            </Text>
                        ) : (
                            <GroupView style={{ paddingVertical: 4 }}>
                                {columns.map((column, index) => {
                                    const details: string[] = []

                                    if (column.pk) {
                                        details.push("PK")
                                    }

                                    if (column.notnull) {
                                        details.push("NOT NULL")
                                    }

                                    if (column.dflt_value !== null && column.dflt_value !== undefined) {
                                        details.push(`${t("settings.database.default", { defaultValue: "DEFAULT" })} ${column.dflt_value}`)
                                    }

                                    return (
                                        <View
                                            key={column.name}
                                            style={{
                                                paddingVertical: 12,
                                                borderBottomWidth: index === columns.length - 1 ? 0 : 1,
                                                borderBottomColor: theme.separator.translucent,
                                                gap: 4,
                                            }}
                                        >
                                            <Text style={[FontStyles.headline, { color: theme.text.label }]}>
                                                {column.name}
                                            </Text>
                                            <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>
                                                {column.type || t("settings.database.unknownType", { defaultValue: "Tipo desconhecido" })}
                                            </Text>
                                            {details.length > 0 ? (
                                                <Text style={[FontStyles.footnote, { color: theme.text.secondaryLabel }]}>
                                                    {details.join(" • ")}
                                                </Text>
                                            ) : null}
                                        </View>
                                    )
                                })}
                            </GroupView>
                        )}
                    </View>

                    <View style={{ gap: 12 }}>
                        <Text style={[FontStyles.title2, { color: theme.text.label }]}>
                            {t("settings.database.rowsHeader", { defaultValue: "Registros" })}
                        </Text>
                        {rows.length === 0 ? (
                            <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>
                                {t("settings.database.noRows", { defaultValue: "Nenhum registro encontrado." })}
                            </Text>
                        ) : (
                            <GroupView style={{ paddingVertical: 4 }}>
                                {rows.map((row, index) => (
                                    <View
                                        key={`row-${index}`}
                                        style={{
                                            paddingVertical: 12,
                                            borderBottomWidth: index === rows.length - 1 ? 0 : 1,
                                            borderBottomColor: theme.separator.translucent,
                                            gap: 8,
                                        }}
                                    >
                                        <Text style={[FontStyles.headline, { color: theme.text.label }]}>
                                            {t("settings.database.rowIndex", { defaultValue: "Registro" })} #{index + 1}
                                        </Text>
                                        <View style={{ gap: 8 }}>
                                            {Object.entries(row).map(([key, value]) => (
                                                <View key={`${index}-${key}`} style={{ gap: 2 }}>
                                                    <Text style={[FontStyles.subhead, { color: theme.text.secondaryLabel }]}>
                                                        {key}
                                                    </Text>
                                                    <Text style={[FontStyles.body, { color: theme.text.label }]}>
                                                        {formatValue(value)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </GroupView>
                        )}
                    </View>
                </>
            )}
        </ScrollView>
    )
}
