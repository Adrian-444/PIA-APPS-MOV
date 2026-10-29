import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import MovimientoCard from "../../components/MovimientoCard";
import TotalCard from "../../components/TotalCard";
import { useMovimientos } from "../../context/MovimientosContext";
import { colores } from "../../constants/colores";

export default function Inicio() {
    const { movimientos, totalIngresos, totalGastos, balance } = useMovimientos();

    const ultimos = [...movimientos].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
            <Card style={styles.balance}>
                <Card.Content>
                    <Text variant="labelLarge" style={styles.textoBalance}>
                        Balance
                    </Text>
                    <Text variant="displaySmall" style={styles.textoBalance}>
                        ${balance.toLocaleString("es-MX")}
                    </Text>
                </Card.Content>
            </Card>

            <View style={styles.fila}>
                <TotalCard titulo="Ingresos" cantidad={totalIngresos} color={colores.ingreso} />
                <TotalCard titulo="Gastos" cantidad={totalGastos} color={colores.gasto} />
            </View>

            <Text variant="titleMedium" style={styles.subtitulo}>
                Últimos movimientos
            </Text>
            {ultimos.map(m => (
                <MovimientoCard key={m.id} movimiento={m} />
            ))}

            <Button mode="contained" icon="plus" style={styles.boton} onPress={() => router.navigate("/agregar")}>
                Agregar movimiento
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.fondo,
    },
    contenido: {
        padding: 16,
    },
    balance: {
        backgroundColor: colores.principal,
        marginBottom: 12,
    },
    textoBalance: {
        color: "#fff",
    },
    fila: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    subtitulo: {
        marginBottom: 8,
    },
    boton: {
        marginTop: 8,
    },
});
