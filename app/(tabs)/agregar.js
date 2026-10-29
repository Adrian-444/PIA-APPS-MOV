import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, HelperText, SegmentedButtons, Text, TextInput } from "react-native-paper";
import { useMovimientos } from "../../context/MovimientosContext";
import categorias from "../../data/categorias.json";

export default function Agregar() {
    const { agregarMovimiento } = useMovimientos();

    const [tipo, setTipo] = useState("gasto");
    const [cantidad, setCantidad] = useState("");
    const [categoria, setCategoria] = useState("");
    const [establecimiento, setEstablecimiento] = useState("");
    const [ticket, setTicket] = useState(null);
    const [error, setError] = useState("");

    const cambiarTipo = (nuevoTipo) => {
        setTipo(nuevoTipo);
        setCategoria(""); // las categorías cambian según el tipo
    };

    const elegirDeGaleria = async () => {
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.5,
        });
        if (!resultado.canceled) {
            setTicket(resultado.assets[0].uri);
        }
    };

    const tomarFoto = async () => {
        const permiso = await ImagePicker.requestCameraPermissionsAsync();
        if (!permiso.granted) {
            setError("Necesitas dar permiso a la cámara para tomar la foto del ticket.");
            return;
        }
        const resultado = await ImagePicker.launchCameraAsync({ quality: 0.5 });
        if (!resultado.canceled) {
            setTicket(resultado.assets[0].uri);
        }
    };

    const guardar = () => {
        const numero = Number(cantidad);
        if (!numero || numero <= 0) {
            setError("Escribe una cantidad mayor a 0.");
            return;
        }
        if (!categoria) {
            setError("Selecciona una categoría.");
            return;
        }

        agregarMovimiento({
            tipo,
            categoria,
            establecimiento: establecimiento || categoria,
            cantidad: numero,
            fecha: new Date().toISOString().slice(0, 10),
            ticket,
        });

        // Limpiamos el formulario y regresamos a Inicio
        setCantidad("");
        setCategoria("");
        setEstablecimiento("");
        setTicket(null);
        setError("");
        router.navigate("/");
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
            <Text variant="labelLarge" style={styles.etiqueta}>Tipo</Text>
            <SegmentedButtons
                value={tipo}
                onValueChange={cambiarTipo}
                buttons={[
                    { value: "gasto", label: "Gasto", icon: "arrow-down" },
                    { value: "ingreso", label: "Ingreso", icon: "arrow-up" },
                ]}
            />

            <TextInput
                label="Cantidad"
                value={cantidad}
                onChangeText={setCantidad}
                keyboardType="numeric"
                mode="outlined"
                left={<TextInput.Affix text="$" />}
                style={styles.input}
            />

            <Text variant="labelLarge" style={styles.etiqueta}>Categoría</Text>
            <View style={styles.chips}>
                {categorias[tipo].map((c) => (
                    <Chip
                        key={c.nombre}
                        icon={c.icono}
                        selected={categoria === c.nombre}
                        showSelectedOverlay
                        onPress={() => setCategoria(c.nombre)}
                    >
                        {c.nombre}
                    </Chip>
                ))}
            </View>

            <TextInput
                label={tipo === "gasto" ? "Establecimiento" : "¿De dónde viene?"}
                value={establecimiento}
                onChangeText={setEstablecimiento}
                mode="outlined"
                style={styles.input}
            />

            <Text variant="labelLarge" style={styles.etiqueta}>Ticket (opcional)</Text>
            <View style={styles.fila}>
                <Button mode="outlined" icon="image" onPress={elegirDeGaleria} style={styles.botonTicket}>
                    Galería
                </Button>
                <Button mode="outlined" icon="camera" onPress={tomarFoto} style={styles.botonTicket}>
                    Cámara
                </Button>
            </View>
            {ticket && (
                <View>
                    <Image source={{ uri: ticket }} style={styles.ticket} />
                    <Button icon="close" onPress={() => setTicket(null)}>Quitar ticket</Button>
                </View>
            )}

            <HelperText type="error" visible={error !== ""}>
                {error}
            </HelperText>

            <Button mode="contained" icon="check" onPress={guardar}>
                Agregar
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F5FA",
    },
    contenido: {
        padding: 16,
    },
    etiqueta: {
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        marginTop: 16,
    },
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    fila: {
        flexDirection: "row",
        gap: 12,
    },
    botonTicket: {
        flex: 1,
    },
    ticket: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginTop: 12,
        resizeMode: "cover",
    },
});
