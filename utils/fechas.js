export function fechaDeHoy(dias = 0) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}
