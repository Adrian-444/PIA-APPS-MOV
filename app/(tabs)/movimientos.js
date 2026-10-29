import { useState } from "react";
import { ScrollView, SectionList, StyleSheet, View } from "react-native";
import { Chip, SegmentedButtons, Text } from "react-native-paper";
import MovimientoCard from "../../components/MovimientoCard";
import { useMovimientos } from "../../context/MovimientosContext";
import categorias from "../../data/categorias.json";
import { fechaDeHoy } from "../../utils/fechas";

export default function Movimientos() {
    const { movimientos } = useMovimientos();

    const [tipo, setTipo] = useState("todos");
    const [categoria, setCategoria] = useState("");

    // Si el tipo es "todos" juntamos las categorías de gastos e ingresos sin repetir
    const nombresCategorias =
        tipo === "todos"
            ? [...new Set([...categorias.gasto, ...categorias.ingreso].map((c) => c.nombre))]
            : categorias[tipo].map((c) => c.nombre);

    const cambiarTipo = (nuevoTipo) => {
        setTipo(nuevoTipo);
        setCategoria("");
    };

    // Un chip seleccionado se puede volver a tocar para quitar el filtro
    const cambiarCategoria = (nombre) => {
        setCategoria(categoria === nombre ? "" : nombre);
    };

    const filtrados = movimientos
        .filter((m) => tipo === "todos" || m.tipo === tipo)
        .filter((m) => categoria === "" || m.categoria === categoria)
        .sort((a, b) => b.fecha.localeCompare(a.fecha));

    // Agrupamos por día: [{ title: "Hoy", data: [...] }, { title: "Ayer", data: [...] }, ...]
    const hoy = fechaDeHoy();
    const ayer = fechaDeHoy(-1);
    const secciones = [];
    filtrados.forEach((m) => {
        let titulo = m.fecha;
        if (m.fecha === hoy) titulo = "Hoy";
        if (m.fecha === ayer) titulo = "Ayer";

        const seccion = secciones.find((s) => s.title === titulo);
        if (seccion) {
            seccion.data.push(m);
        } else {
            secciones.push({ title: titulo, data: [m] });
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.filtros}>
                <SegmentedButtons
                    value={tipo}
                    onValueChange={cambiarTipo}
                    buttons={[
                        { value: "todos", label: "Todos" },
                        { value: "gasto", label: "Gastos" },
                        { value: "ingreso", label: "Ingresos" },
                    ]}
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                    {nombresCategorias.map((nombre) => (
                        <Chip
                            key={nombre}
                            selected={categoria === nombre}
                            showSelectedOverlay
                            onPress={() => cambiarCategoria(nombre)}
                        >
                            {nombre}
                        </Chip>
                    ))}
                </ScrollView>
            </View>

            <SectionList
                sections={secciones}
                keyExtractor={(m) => m.id}
                renderItem={({ item }) => <MovimientoCard movimiento={item} />}
                renderSectionHeader={({ section }) => (
                    <Text variant="titleSmall" style={styles.dia}>{section.title}</Text>
                )}
                ListEmptyComponent={<Text style={styles.vacio}>No hay movimientos con estos filtros.</Text>}
                contentContainerStyle={styles.lista}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F5FA",
    },
    filtros: {
        padding: 16,
        paddingBottom: 0,
        gap: 12,
    },
    chips: {
        gap: 8,
    },
    lista: {
        padding: 16,
    },
    dia: {
        marginTop: 8,
        marginBottom: 8,
    },
    vacio: {
        textAlign: "center",
        marginTop: 32,
    },
});
