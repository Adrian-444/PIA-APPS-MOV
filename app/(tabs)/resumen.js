import { ScrollView, StyleSheet, View } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";
import TotalCard from "../../components/TotalCard";
import { useMovimientos } from "../../context/MovimientosContext";
import { colores } from "../../constants/colores";

function totalesPorCategoria(movimientos, tipo, total) {
    const delTipo = movimientos.filter(m => m.tipo === tipo);

    const grupos = [];
    delTipo.forEach(m => {
        const grupo = grupos.find(g => g.categoria === m.categoria);
        if (grupo) {
            grupo.total += m.cantidad;
        } else {
            grupos.push({ categoria: m.categoria, total: m.cantidad });
        }
    });

    return grupos.map(g => ({ ...g, porcentaje: g.total / total })).sort((a, b) => b.total - a.total);
}

function Desglose({ titulo, total, grupos, color }) {
    return (
        <Card style={styles.card} mode="outlined">
            <Card.Title title={titulo} subtitle={`Total: $${total.toLocaleString("es-MX")}`} />
            <Card.Content>
                {grupos.length === 0 && <Text>Sin movimientos.</Text>}
                {grupos.map(g => (
                    <View key={g.categoria} style={styles.renglon}>
                        <View style={styles.textos}>
                            <Text>{g.categoria}</Text>
                            <Text>
                                ${g.total.toLocaleString("es-MX")} ({Math.round(g.porcentaje * 100)}%)
                            </Text>
                        </View>
                        <ProgressBar progress={g.porcentaje} color={color} style={styles.barra} />
                    </View>
                ))}
            </Card.Content>
        </Card>
    );
}

export default function Resumen() {
    const { movimientos, totalIngresos, totalGastos, balance } = useMovimientos();

    const gastos = totalesPorCategoria(movimientos, "gasto", totalGastos);
    const ingresos = totalesPorCategoria(movimientos, "ingreso", totalIngresos);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
            <Desglose titulo="Total gastado" total={totalGastos} grupos={gastos} color={colores.gasto} />
            <Desglose titulo="Total ingresos" total={totalIngresos} grupos={ingresos} color={colores.ingreso} />
            <View style={styles.fila}>
                <TotalCard titulo="Balance" cantidad={balance} color={balance >= 0 ? colores.ingreso : colores.gasto} />
            </View>
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
    card: {
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    renglon: {
        marginBottom: 12,
    },
    textos: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    barra: {
        height: 8,
        borderRadius: 4,
    },
    fila: {
        flexDirection: "row",
    },
});
