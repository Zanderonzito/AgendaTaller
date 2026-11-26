// =============================================================================
// Utilidades de fecha — formato, comparación y aritmética de días
// =============================================================================
// Trabajar con fechas en JavaScript es propenso a bugs por la conversión
// entre zona horaria local y UTC. Por eso toda manipulación de fecha en
// esta app pasa por aquí. Si hay un bug de zona horaria, se arregla aquí,
// no en cada pantalla.
// =============================================================================

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/**
 * Devuelve la fecha actual en formato ISO 'YYYY-MM-DD' respetando la zona
 * horaria local del dispositivo. NO usamos toISOString() porque ese método
 * convierte a UTC y puede cambiar el día si la hora es temprano o tarde.
 */
export function hoyISO(): string {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

/**
 * Convierte una fecha Date a string ISO 'YYYY-MM-DD' en zona horaria local.
 */
export function fechaAISO(fecha: Date): string {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
}

/**
 * Convierte un string ISO 'YYYY-MM-DD' a un objeto Date local, a las 00:00.
 * Esto evita que `new Date('2026-11-27')` se interprete como UTC y aparezca
 * como el día anterior en zonas horarias negativas.
 */
export function isoAFecha(iso: string): Date {
  const [año, mes, dia] = iso.split('-').map(Number);
  return new Date(año, mes - 1, dia);
}

/**
 * Devuelve la fecha en formato legible: "Lunes, 27 de noviembre de 2026".
 */
export function formatoFechaLarga(iso: string): string {
  const fecha = isoAFecha(iso);
  const diaSemana = DIAS_SEMANA[fecha.getDay()];
  const dia = fecha.getDate();
  const mes = MESES[fecha.getMonth()];
  const año = fecha.getFullYear();
  return `${diaSemana}, ${dia} de ${mes} de ${año}`;
}

/**
 * Devuelve la fecha en formato corto: "Lun 27 nov".
 */
export function formatoFechaCorta(iso: string): string {
  const fecha = isoAFecha(iso);
  const diaSemanaCorto = DIAS_SEMANA[fecha.getDay()].slice(0, 3);
  const dia = fecha.getDate();
  const mesCorto = MESES[fecha.getMonth()].slice(0, 3);
  return `${diaSemanaCorto} ${dia} ${mesCorto}`;
}

/**
 * Suma (o resta, con delta negativo) días a una fecha ISO.
 * Devuelve otro string ISO. No muta el original.
 */
export function sumarDiasISO(iso: string, delta: number): string {
  const fecha = isoAFecha(iso);
  fecha.setDate(fecha.getDate() + delta);
  return fechaAISO(fecha);
}

/**
 * Compara dos fechas ISO. Devuelve:
 *   -1 si a < b
 *    0 si a === b
 *    1 si a > b
 */
export function compararFechasISO(a: string, b: string): -1 | 0 | 1 {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Calcula la hora de finalización de una cita dada la hora de inicio y la
 * duración en minutos. Devuelve 'HH:mm'.
 */
export function calcularHoraFin(horaInicio: string, duracionMinutos: number): string {
  const [h, m] = horaInicio.split(':').map(Number);
  const totalMinutos = h * 60 + m + duracionMinutos;
  const finH = Math.floor(totalMinutos / 60) % 24;
  const finM = totalMinutos % 60;
  return `${String(finH).padStart(2, '0')}:${String(finM).padStart(2, '0')}`;
}

/**
 * Lista de horarios disponibles (cada 30 min) entre las 9:00 y las 19:00.
 * Se usa en el picker de hora del formulario.
 */
export function horariosDisponibles(): string[] {
  const horarios: string[] = [];
  for (let h = 9; h < 19; h++) {
    horarios.push(`${String(h).padStart(2, '0')}:00`);
    horarios.push(`${String(h).padStart(2, '0')}:30`);
  }
  return horarios;
}
