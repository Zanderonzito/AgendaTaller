// =============================================================================
// Tipos centrales de la aplicación
// =============================================================================
// Este archivo define los tipos TypeScript que se usan en toda la app.
// Mantener los tipos en un solo lugar permite que cualquier pantalla o
// componente los importe sin acoplarse a la implementación concreta.
// =============================================================================

/**
 * Estados posibles de una cita.
 * - pendiente: cita creada pero no confirmada por el negocio
 * - confirmada: el negocio aceptó la cita
 * - completada: la atención ya terminó
 * - cancelada: la cita se canceló (por el cliente o el negocio)
 */
export type EstadoCita = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

/**
 * Tipo de servicio que ofrece el negocio.
 * El campo `duracionMinutos` se usa para estimar el fin de la cita.
 */
export interface Servicio {
  id: string;
  nombre: string;
  duracionMinutos: number;
  precio: number;
}

/**
 * Entidad principal: una cita de la agenda.
 */
export interface Cita {
  id: string;
  clienteNombre: string;
  clienteTelefono: string;
  servicioId: string;
  servicioNombre: string;
  fecha: string; // formato ISO: 'YYYY-MM-DD'
  hora: string; // formato 24h: 'HH:mm'
  duracionMinutos: number;
  estado: EstadoCita;
  notas: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/**
 * Datos del formulario al crear/editar una cita.
 * Es lo que el formulario controlado mantiene en su estado antes de validar.
 */
export interface CitaFormulario {
  clienteNombre: string;
  clienteTelefono: string;
  servicioId: string;
  fecha: string;
  hora: string;
  notas: string;
}

/**
 * Errores de validación por campo. Cada clave es el nombre del campo y
 * el valor es el mensaje de error. Un objeto vacío significa sin errores.
 */
export type ErroresFormulario = Partial<Record<keyof CitaFormulario, string>>;

/**
 * Parámetros que recibe cada pantalla vía React Navigation.
 */
export type RootStackParamList = {
  Agenda: undefined;
  CitaForm: { citaId?: string; fecha?: string };
  CitaDetalle: { citaId: string };
  Buscar: undefined;
};

/**
 * Tipos de los cuatro estados de carga que toda pantalla asíncrona debe
 * manejar explícitamente, según el material de la Unidad 3.
 */
export type EstadoCarga = 'idle' | 'cargando' | 'exito' | 'error';
