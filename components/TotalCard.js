import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

export default function TotalCard({ titulo, cantidad, color }) {
    return (
        <Card style={styles.card} mode="contained">
            <Card.Content>
                <Text variant="labelLarge">{titulo}</Text>
                <Text variant="titleLarge" style={{ color, fontWeight: "bold" }}>
                    ${cantidad.toLocaleString("es-MX")}
                </Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
    },
});
