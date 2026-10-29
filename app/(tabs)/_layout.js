import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "#6750A4" }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="movimientos"
                options={{
                    title: "Movimientos",
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="agregar"
                options={{
                    title: "Agregar",
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="plus-circle" color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="resumen"
                options={{
                    title: "Resumen",
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-donut" color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
