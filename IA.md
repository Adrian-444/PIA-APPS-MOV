# Uso de IA en Cuentas Claras

## Herramienta y forma de trabajo

- **IA:** Claude Code
- **Reglas que le di desde el inicio:** código en JavaScript Y textos en español

---

**Prompt (modo Plan):**

> Estoy haciendo una app de control de gastos e ingresos, es un proyecto de Expo y usa JS. Quiero 4 pantallas: Inicio, Movimientos, Agregar y Resumen, con iconos. Uso expo-router y react-native-paper. ¿Cómo organizo las carpetas?

**Claude (modo Plan):**

> Propongo esta estructura:
>
> - `app/_layout.js`: layout raíz con `PaperProvider` y un `Stack`.
> - `app/(tabs)/_layout.js`: navegador de pestañas con `Tabs` de expo-router e iconos de `MaterialCommunityIcons`.
> - `app/(tabs)/index.js`, `movimientos.js`, `agregar.js`, `resumen.js`: una pantalla por pestaña.
> - `constants/colores.js`: colores de la app (verde para ingresos, rojo para gastos, color principal y fondo).
> - `data/movimientos.json` y `data/categorias.json`: datos de prueba y lista de categorías con su icono.
> - `components/`: tarjetas reutilizables.
>
> Para no repetir el mismo código del icono en cada pestaña, haría una función pequeña `icono(nombre)` que regrese el `tabBarIcon`.

**Claude (modo Agente):**

> - Creó `app/_layout.js` y `app/(tabs)/_layout.js` con las 4 pestañas y la función `icono`.
> - Creó `constants/colores.js`, `data/categorias.json` (categorías de gasto e ingreso con su icono) y `data/movimientos.json` con movimientos de ejemplo.
> - Dejó las 4 pantallas con un texto temporal para probar la navegación.

---

## Estado global y totales

**Prompt (modo Plan):**

> Necesito que los movimientos se compartan entre todas las pantallas, porque cuando agregue uno en la pestaña Agregar tiene que aparecer en Inicio y en Resumen. También quiero que se calcule el total de ingresos, el total de gastos y el balance. Explícame cómo hacerlo sin librerías raras.

**Claude (modo Plan):**

> Se puede con un **Context** de React:
>
> 1. Crear `context/MovimientosContext.js` con un `useState` que empiece con los datos de `movimientos.json`.
> 2. Una función `agregarMovimiento` que le ponga un `id` (con `Date.now()`) y lo agregue al inicio de la lista.
> 3. Calcular los totales con `filter` (por tipo) y `reduce` (para sumar las cantidades). El balance es ingresos menos gastos.
> 4. Exportar un hook `useMovimientos()` para usarlo en cualquier pantalla.
> 5. Envolver la app con `MovimientosProvider` en `app/_layout.js`.
>
> Nota: los datos viven en memoria, así que se pierden al cerrar la app. Más adelante se puede guardar con AsyncStorage.

**Claude (modo Agente):**

- Creó `context/MovimientosContext.js` con `movimientos`, `agregarMovimiento`, `totalIngresos`, `totalGastos` y `balance`.
- Agregó el `MovimientosProvider` en `app/_layout.js`.

```js
const totalIngresos = movimientos.filter(m => m.tipo === "ingreso").reduce((suma, m) => suma + m.cantidad, 0);
const totalGastos = movimientos.filter(m => m.tipo === "gasto").reduce((suma, m) => suma + m.cantidad, 0);
const balance = totalIngresos - totalGastos;
```

---

## Agregar movimiento con foto del ticket

**Prompt (modo Plan):**

> La pantalla de Agregar debe tener: elegir si es gasto o ingreso, la cantidad, la categoría, el establecimiento y poder adjuntar una foto del ticket ya sea con la cámara o desde la galería. Que valide que la cantidad sea mayor a 0 y que haya categoría.

**Claude (modo Plan):**

> - Instalar `expo-image-picker` con `npx expo install expo-image-picker`.
> - `SegmentedButtons` para gasto/ingreso.
> - Las categorías se muestran como `Chip` leyendo `categorias[tipo]` del JSON.
> - Dos botones: **Galería** (`launchImageLibraryAsync`) y **Cámara** (`launchCameraAsync`, pidiendo antes el permiso con `requestCameraPermissionsAsync`). Guardar la `uri` de la imagen en el estado y mostrar una vista previa con opción de quitarla.
> - Validar en `guardar()`; si hay error, mostrarlo con `HelperText`.
> - Al guardar: llamar a `agregarMovimiento`, limpiar el formulario y regresar a Inicio.

**Claude (modo Agente):**

- Instaló `expo-image-picker` y programó `app/(tabs)/agregar.js` con el formulario, las funciones `elegirDeGaleria`, `tomarFoto` y `guardar`.
- Mensajes de error en español: "Escribe una cantidad mayor a 0." y "Selecciona una categoría.".

---

## Ajustes al formulario de Agregar

**Prompt (modo Plan):**

> Probando el formulario encontré dos cosas: si selecciono una categoría en Gasto y luego cambio a Ingreso, se queda seleccionada la categoría anterior aunque no exista en ingresos. Y si no escribo el establecimiento, el movimiento se guarda sin nombre y en la lista sale vacío.

**Claude (modo Plan):**

> - **Categoría:** el `SegmentedButtons` hoy llama directo a `setTipo`, por eso la categoría no cambia. Propongo una función `cambiarTipo` que cambie el tipo y además limpie la categoría con `setCategoria("")`, para que el usuario tenga que elegir una de las categorías del nuevo tipo.
> - **Establecimiento:** en lugar de hacerlo obligatorio, al guardar se puede usar el nombre de la categoría cuando el campo está vacío, con `establecimiento || categoria`. Así en la lista sale, por ejemplo, "Comida" en vez de un espacio vacío.

**Claude (modo Agente):**

- Agregó `cambiarTipo` en `app/(tabs)/agregar.js` y lo conectó al `onValueChange` del `SegmentedButtons`:

```js
const cambiarTipo = nuevoTipo => {
    setTipo(nuevoTipo);
    setCategoria("");
};
```

- En `guardar()` cambió el campo del movimiento nuevo:

```js
establecimiento: establecimiento || categoria,
```

---

## Acomodo visual del formulario

**Prompt (modo Plan):**

> Ya tengo el formulario de Agregar funcionando, pero se ve todo amontonado: los campos están pegados, las categorías se salen de la pantalla y los botones de Galería y Cámara quedan de distinto tamaño. Quiero que lo acomodes visualmente sin cambiar cómo funciona.

**Claude (modo Plan):**

> Solo hay que cambiar los estilos de `app/(tabs)/agregar.js`:
>
> - Envolver todo en un `ScrollView` con `padding: 16` y el color de fondo de la app, para que no quede pegado a las orillas y se pueda bajar cuando aparece el teclado.
> - Poner un `marginTop` igual a todos los campos y a las etiquetas ("Tipo", "Categoría", "Ticket (opcional)") para que haya el mismo espacio entre cada parte.
> - Las categorías en una fila con `flexWrap: "wrap"` y `gap: 8`, para que bajen a la siguiente línea si no caben.
> - Los botones de Galería y Cámara en una fila, cada uno con `flex: 1`, para que midan lo mismo.
> - La vista previa del ticket a todo el ancho, con altura fija y bordes redondeados.

**Claude (modo Agente):**

- Agregó los estilos en `StyleSheet.create` y los aplicó a cada elemento del formulario:

```js
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
```

---

## Formato de las fechas

**Prompt (modo Plan):**

> Quiero que se vea bien la fecha de los movimientos y que se guarde en el formato correcto. Cuando agrego un gasto en la noche me sale con la fecha de mañana. Y en la lista de movimientos quiero que se agrupen por día y que diga "Hoy" y "Ayer" en lugar de la fecha.

**Claude (modo Plan):**

> El problema de la fecha de mañana es porque `toISOString()` regresa la hora en UTC, y en México (UTC-6) después de las 6 pm ya es el día siguiente en UTC.
>
> Propuesta:
>
> 1. Crear `utils/fechas.js` con una función `fechaDeHoy(dias = 0)` que arme la fecha con la hora **local** (`getFullYear`, `getMonth`, `getDate`) en formato `AAAA-MM-DD`, usando `padStart(2, "0")` para que el mes y el día siempre tengan dos dígitos (por ejemplo `2026-10-05` y no `2026-10-5`).
> 2. El parámetro `dias` permite pedir otro día; con `fechaDeHoy(-1)` obtenemos la fecha de ayer.
> 3. Usar ese formato también porque se puede ordenar como texto con `localeCompare`.
> 4. En Movimientos cambiar la lista por un `SectionList`: recorrer los movimientos, y si la fecha es la de hoy el título de la sección es "Hoy", si es la de ayer "Ayer" y si no, la fecha.

**Claude (modo Agente):**

- Creó `utils/fechas.js`:

```js
export function fechaDeHoy(dias = 0) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}
```

- En `agregar.js` el movimiento nuevo ahora se guarda con `fecha: fechaDeHoy()`.
- En `movimientos.js` agrupó los movimientos por día y los muestra con `SectionList` y encabezados "Hoy", "Ayer" o la fecha.
- Al revisar `movimientos.js` notó que con el filtro "Todos" la categoría "Otros" salía dos veces, porque existe tanto en gastos como en ingresos. Lo corrigió quitando los nombres repetidos con `new Set`:

```js
const nombresCategorias =
    tipo === "todos"
        ? [...new Set([...categorias.gasto, ...categorias.ingreso].map(c => c.nombre))]
        : categorias[tipo].map(c => c.nombre);
```
