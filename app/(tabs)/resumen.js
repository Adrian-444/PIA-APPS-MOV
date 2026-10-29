import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function Resumen() {
    return (
        <View style={styles.container}>
            <Text variant="titleMedium">Resumen (próximamente)</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7F5FA",
    },
});
