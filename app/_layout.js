import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { MovimientosProvider } from "../context/MovimientosContext";

export default function RootLayout() {
    return (
        <PaperProvider>
            <MovimientosProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </MovimientosProvider>
        </PaperProvider>
    );
}
