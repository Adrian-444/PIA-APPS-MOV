import { createContext, useContext, useState } from "react";
import movimientosIniciales from "../data/movimientos.json";

const MovimientosContext = createContext();

export function MovimientosProvider({ children }) {
    const [movimientos, setMovimientos] = useState(movimientosIniciales);

    const agregarMovimiento = movimiento => {
        const nuevo = { ...movimiento, id: Date.now().toString() };
        setMovimientos([nuevo, ...movimientos]);
    };

    const totalIngresos = movimientos.filter(m => m.tipo === "ingreso").reduce((suma, m) => suma + m.cantidad, 0);
    const totalGastos = movimientos.filter(m => m.tipo === "gasto").reduce((suma, m) => suma + m.cantidad, 0);
    const balance = totalIngresos - totalGastos;

    return (
        <MovimientosContext.Provider value={{ movimientos, agregarMovimiento, totalIngresos, totalGastos, balance }}>
            {children}
        </MovimientosContext.Provider>
    );
}

export function useMovimientos() {
    return useContext(MovimientosContext);
}
