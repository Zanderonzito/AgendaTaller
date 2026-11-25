// =============================================================================
// Validación del formulario de cita
// =============================================================================
// Toda la lógica de validación vive aquí, separada del formulario. El
// formulario solo llama a `validarCita(datos)` y recibe un mapa de errores
// por campo. Si el mapa está vacío, los datos son válidos.
// =============================================================================

import type { CitaFormulario, ErroresFormulario } from '../types';
import { hoyISO, isoAFecha, compararFechasISO, fechaAISO } from './date';

/**
 * Valida que el teléfono tenga un formato razonable. Acepta:
 *   - +56 9 1234 5678
 *   - +56912345678
 *   - 9 1234 5678
 *   - 912345678
 *   - 1234567 (teléfono fijo, 7 dígitos)
 *
 * La idea es ser permisivo: el objetivo es detectar errores evidentes (vacío,
 * letras, muy corto) y no impedir formatos legítimos.
 */
function telefonoEsValido(tel: string): boolean {
  const limpio = tel.replace(/[\s\-().]/g, '');
  // Permite +56912345678, 56912345678, 912345678 o 1234567 (fijo)
  return /^(\+?56)?9?\d{7,8}$/.test(limpio);
}

/**
 * Valida el formulario completo de cita.
 * Devuelve un objeto con los errores por campo. Si el objeto está vacío,
 * el formulario es válido y puede enviarse.
 *
 * Importante: esta función es PURA. No toca el estado ni dispara efectos
 * secundarios. Eso la hace fácil de probar y razonar.
 */
export function validarCita(datos: CitaFormulario): ErroresFormulario {
  const errores: ErroresFormulario = {};

  // --- Nombre del cliente ---
  const nombre = datos.clienteNombre.trim();
  if (nombre.length === 0) {
    errores.clienteNombre = 'El nombre del cliente es obligatorio.';
  } else if (nombre.length < 2) {
    errores.clienteNombre = 'El nombre debe tener al menos 2 caracteres.';
  } else if (nombre.length > 60) {
    errores.clienteNombre = 'El nombre no puede superar los 60 caracteres.';
  }

  // --- Teléfono ---
  const telefono = datos.clienteTelefono.trim();
  if (telefono.length === 0) {
    errores.clienteTelefono = 'El teléfono es obligatorio.';
  } else if (!telefonoEsValido(telefono)) {
    errores.clienteTelefono = 'Formato inválido. Ejemplo: +56987654321.';
  }

  // --- Servicio ---
  if (datos.servicioId.length === 0) {
    errores.servicioId = 'Debe seleccionar un servicio.';
  }

  // --- Fecha ---
  if (datos.fecha.length === 0) {
    errores.fecha = 'Debe seleccionar una fecha.';
  } else {
    const fechaSeleccionada = isoAFecha(datos.fecha);
    const hoy = isoAFecha(hoyISO());

    // isNaN(fecha.getTime()) detecta fechas inválidas como '2026-13-40'
    if (isNaN(fechaSeleccionada.getTime())) {
      errores.fecha = 'La fecha seleccionada no es válida.';
    } else if (compararFechasISO(datos.fecha, fechaAISO(hoy)) < 0) {
      errores.fecha = 'La fecha no puede ser anterior a hoy.';
    }
  }

  // --- Hora ---
  if (datos.hora.length === 0) {
    errores.hora = 'Debe seleccionar una hora.';
  } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(datos.hora)) {
    errores.hora = 'La hora debe tener el formato HH:mm.';
  }

  // --- Notas (opcional, pero con límite) ---
  if (datos.notas.length > 200) {
    errores.notas = 'Las notas no pueden superar los 200 caracteres.';
  }

  return errores;
}

/**
 * Devuelve true si el objeto de errores está vacío.
 * Conveniencia para el formulario.
 */
export function esValido(errores: ErroresFormulario): boolean {
  return Object.keys(errores).length === 0;
}
