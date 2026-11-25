// =============================================================================
// Helpers generales
// =============================================================================
// Funciones pequeñas y reutilizables que no pertenecen a ningún módulo
// específico. Se mantienen aquí para no duplicarlas en distintos archivos.
// =============================================================================

import type { EstadoCita } from '../types';
import { colors } from '../theme/colors';

/**
 * Genera un ID único con prefijo y timestamp. No usamos crypto.randomUUID
 * porque no está disponible en todas las versiones de React Native.
 *
 * Formato: 'cita-1732584000000-abc12'
 */
export function generarId(prefijo: string = 'cita'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 7);
  return `${prefijo}-${timestamp}-${random}`;
}

/**
 * Devuelve el color (hex) asociado a un estado de cita. Se usa en badges,
 * bordes y barras de estado en toda la app.
 */
export function colorPorEstado(estado: EstadoCita): string {
  switch (estado) {
    case 'pendiente':
      return colors.pendiente;
    case 'confirmada':
      return colors.confirmada;
    case 'completada':
      return colors.completada;
    case 'cancelada':
      return colors.cancelada;
    default:
      return colors.textMuted;
  }
}

/**
 * Etiqueta legible en español para cada estado.
 */
export function etiquetaEstado(estado: EstadoCita): string {
  switch (estado) {
    case 'pendiente':
      return 'Pendiente';
    case 'confirmada':
      return 'Confirmada';
    case 'completada':
      return 'Completada';
    case 'cancelada':
      return 'Cancelada';
    default:
      return 'Desconocido';
  }
}

/**
 * Formatea un número como precio en pesos chilenos: $15.000
 * Sin decimales, separador de miles con punto.
 */
export function formatearPrecio(pesos: number): string {
  return '$' + pesos.toLocaleString('es-CL');
}

/**
 * Devuelve las iniciales de un nombre (máximo 2). Útil para avatares.
 * "María González" -> "MG"
 */
export function inicialesDe(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

/**
 * Lista de estados disponibles para el selector de cambio de estado.
 * La usamos tanto en el detalle como en el formulario de edición.
 */
export const ESTADOS_DISPONIBLES: EstadoCita[] = [
  'pendiente',
  'confirmada',
  'completada',
  'cancelada',
];

/**
 * Próximo estado lógico al confirmar una cita. Sigue el flujo:
 *   pendiente -> confirmada -> completada
 * Las canceladas no avanzan.
 */
export function siguienteEstado(estado: EstadoCita): EstadoCita | null {
  switch (estado) {
    case 'pendiente':
      return 'confirmada';
    case 'confirmada':
      return 'completada';
    case 'completada':
    case 'cancelada':
      return null;
    default:
      return null;
  }
}
