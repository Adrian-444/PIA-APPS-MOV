import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colores } from "../../constants/colores";

const icono =
    nombre =>
    ({ color, size }) => <MaterialCommunityIcons name={nombre} color={color} size={size} />;

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: colores.principal }}>
            <Tabs.Screen name="index" options={{ title: "Inicio", tabBarIcon: icono("home") }} />
            <Tabs.Screen
                name="movimientos"
                options={{ title: "Movimientos", tabBarIcon: icono("format-list-bulleted") }}
            />
            <Tabs.Screen name="agregar" options={{ title: "Agregar", tabBarIcon: icono("plus-circle") }} />
            <Tabs.Screen name="resumen" options={{ title: "Resumen", tabBarIcon: icono("chart-donut") }} />
        </Tabs>
    );
}
