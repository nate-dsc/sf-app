import { AppIcon } from "@/components/AppIcon"
import GRedir from "@/components/grouped-list-components/GroupedRedirect"
import GroupView from "@/components/grouped-list-components/GroupView"
import { FontStyles } from "@/components/styles/FontStyles"
import { useStyle } from "@/context/StyleContext"
import { useHeaderHeight } from "@react-navigation/elements"
import { useRouter } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"

type TableInfo = {
    name: string
    count: number
}

function quoteIdentifier(value: string) {
    return `"${value.replace(/"/g, '""')}"`
}

export default function SettingsDatabaseScreen() {
    const { theme, layout } = useStyle()
    const { t } = useTranslation()
    const router = useRouter()
    const database = useSQLiteContext()

    const [tables, setTables] = useState<TableInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true

        async function loadTables() {
            setLoading(true)
            setError(null)

            try {
                const result = await database.getAllAsync<{ name: string }>(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
                )

                const tablesWithCount: TableInfo[] = []

                for (const table of result) {
                    try {
                        const safeName = quoteIdentifier(table.name)
                        const row = await database.getFirstAsync<{ total: number }>(`SELECT COUNT(*) as total FROM ${safeName}`)
                        tablesWithCount.push({
                            name: table.name,
                            count: row?.total ?? 0,
                        })
                    } catch (innerError) {
                        console.error(`Erro ao contar registros da tabela ${table.name}`, innerError)
                        tablesWithCount.push({
                            name: table.name,
                            count: 0,
                        })
                    }
                }

                if (isMounted) {
                    setTables(tablesWithCount)
                }
            } catch (error) {
                console.error("Erro ao carregar tabelas do banco", error)
                if (isMounted) {
                    setError(t("settings.database.loadError", { defaultValue: "Não foi possível carregar as tabelas." }))
                    setTables([])
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadTables()

        return () => {
            isMounted = false
        }
    }, [database, t])

    return (
        <ScrollView
            contentContainerStyle={{
                paddingTop: useHeaderHeight() + layout.margin.contentArea,
                paddingHorizontal: layout.margin.contentArea,
                paddingBottom: 120,
                gap: layout.margin.sectionGap
            }}
        >
            <Text style={[FontStyles.title2, { color: theme.text.label }]}>
                {t("settings.database.tablesHeader", { defaultValue: "Tabelas do banco" })}
            </Text>

            {loading ? (
                <View style={{ alignItems: "center", gap: 8 }}>
                    <ActivityIndicator size="large" color={theme.colors.blue} />
                    <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>
                        {t("settings.database.loadingTables", { defaultValue: "Carregando tabelas..." })}
                    </Text>
                </View>
            ) : error ? (
                <Text style={[FontStyles.body, { color: theme.colors.red }]}>{error}</Text>
            ) : tables.length === 0 ? (
                <Text style={[FontStyles.body, { color: theme.text.secondaryLabel }]}>
                    {t("settings.database.noTables", { defaultValue: "Nenhuma tabela encontrada." })}
                </Text>
            ) : (
                <GroupView
                    forceHorizontalPadding={true}
                    bgType="overBackground"
                >
                    {tables.map((table, index) => (
                        <GRedir
                            key={table.name}
                            separator={index === tables.length - 1 ? "none" : "translucent"}
                            leadingIcon={
                                <AppIcon
                                    name={"square.grid.2x2"}
                                    androidName={"grid-view"}
                                    size={29}
                                    tintColor={theme.text.label}
                                />
                            }
                            leadingLabel={`${table.name} (${table.count})`}
                            onPress={() =>
                                router.push({
                                    pathname: "/settingsDatabaseTable",
                                    params: { table: table.name },
                                })
                            }
                        />
                    ))}
                </GroupView>
            )}
        </ScrollView>
    )
}
