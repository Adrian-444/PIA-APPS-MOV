import { createContext, useContext, useState } from "react";
import movimientosIniciales from "../data/movimientos.json";

// el contexto permite que todas las pantallas lean y modifiquen la misma lista de movimientos
const MovimientosContext = createContext();

export function MovimientosProvider({ children }) {
    const [movimientos, setMovimientos] = useState(movimientosIniciales);

    const agregarMovimiento = movimiento => {
        const nuevo = { ...movimiento, id: Date.now().toString() };
        setMovimientos([nuevo, ...movimientos]);
    };

    return (
        <MovimientosContext.Provider value={{ movimientos, agregarMovimiento }}>{children}</MovimientosContext.Provider>
    );
}

export function useMovimientos() {
    return useContext(MovimientosContext);
}
