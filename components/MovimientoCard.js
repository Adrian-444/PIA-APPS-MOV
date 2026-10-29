import { StyleSheet } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import categorias from "../data/categorias.json";
import { colores } from "../constants/colores";

export default function MovimientoCard({ movimiento }) {
    const esIngreso = movimiento.tipo === "ingreso";
    const categoria = categorias[movimiento.tipo].find((c) => c.nombre === movimiento.categoria);
    const color = esIngreso ? colores.ingreso : colores.gasto;

    return (
        <Card style={styles.card} mode="outlined">
            <Card.Title
                title={movimiento.establecimiento}
                subtitle={`${movimiento.categoria} · ${movimiento.fecha}`}
                left={(props) => (
                    <Avatar.Icon {...props} icon={categoria ? categoria.icono : "cash"} color="#fff" style={{ backgroundColor: color }} />
                )}
                right={() => (
                    <Text variant="titleMedium" style={[styles.cantidad, { color }]}>
                        {esIngreso ? "+" : "-"}${movimiento.cantidad.toLocaleString("es-MX")}
                    </Text>
                )}
            />
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 8,
        backgroundColor: "#fff",
    },
    cantidad: {
        marginRight: 16,
        fontWeight: "bold",
    },
});
