// =============================================================================
// Datos de ejemplo (mock) — usado solo en la primera carga de la app
// =============================================================================
// Cuando la app arranca por primera vez (AsyncStorage vacío), sembramos estas
// citas de ejemplo para que el profesor vea la app con contenido real y no
// con una pantalla vacía. En cargas siguientes, lo que está en AsyncStorage
// tiene prioridad sobre este mock.
// =============================================================================

import type { Cita, Servicio } from '../types';

/**
 * Lista de servicios que ofrece el taller mecánico.
 * Los IDs son estables porque las citas los referencian.
 */
export const SERVICIOS: Servicio[] = [
  { id: 'svc-cambio-aceite', nombre: 'Cambio de aceite', duracionMinutos: 30, precio: 15000 },
  { id: 'svc-revision-frenos', nombre: 'Revisión de frenos', duracionMinutos: 60, precio: 25000 },
  { id: 'svc-alineacion', nombre: 'Alineación y balanceo', duracionMinutos: 45, precio: 20000 },
  { id: 'svc-diagnostico', nombre: 'Diagnóstico eléctrico', duracionMinutos: 60, precio: 22000 },
  { id: 'svc-neumaticos', nombre: 'Cambio de neumáticos', duracionMinutos: 75, precio: 48000 },
  { id: 'svc-lavado-auto', nombre: 'Lavado y encerado', duracionMinutos: 40, precio: 9000 },
  { id: 'svc-revision-general', nombre: 'Revisión general', duracionMinutos: 90, precio: 35000 },
];

/**
 * Genera el ISO timestamp "ahora" en el momento de la primera carga.
 * Se invoca dentro de un function para no fijar la fecha en tiempo de
 * compilación (de otro modo el mock tendría fechas estáticas de hace meses).
 */
function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function mananaISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function enDiasISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Crea el mock inicial de citas. Usa timestamps dinámicos para que siempre
 * haya citas en "hoy" y "mañana", sin importar cuándo el profesor ejecute la
 * app por primera vez.
 */
export function generarMockInicial(): Cita[] {
  const ahora = new Date().toISOString();
  return [
    {
      id: 'cita-001',
      clienteNombre: 'María González',
      clienteTelefono: '+56987654321',
      servicioId: 'svc-cambio-aceite',
      servicioNombre: 'Cambio de aceite',
      fecha: hoyISO(),
      hora: '09:30',
      duracionMinutos: 30,
      estado: 'confirmada',
      notas: 'Toyota Corolla, patente ABCD12.',
      createdAt: ahora,
      updatedAt: ahora,
    },
    {
      id: 'cita-002',
      clienteNombre: 'Pedro Ramírez',
      clienteTelefono: '+56912345678',
      servicioId: 'svc-revision-frenos',
      servicioNombre: 'Revisión de frenos',
      fecha: hoyISO(),
      hora: '11:00',
      duracionMinutos: 60,
      estado: 'pendiente',
      notas: 'Hyundai Tucson, freno hace ruido.',
      createdAt: ahora,
      updatedAt: ahora,
    },
    {
      id: 'cita-003',
      clienteNombre: 'Ana Torres',
      clienteTelefono: '+56955554444',
      servicioId: 'svc-diagnostico',
      servicioNombre: 'Diagnóstico eléctrico',
      fecha: hoyISO(),
      hora: '15:30',
      duracionMinutos: 60,
      estado: 'completada',
      notas: 'Chevrolet Sail, no carga la batería.',
      createdAt: ahora,
      updatedAt: ahora,
    },
    {
      id: 'cita-004',
      clienteNombre: 'Luis Méndez',
      clienteTelefono: '+56988887777',
      servicioId: 'svc-alineacion',
      servicioNombre: 'Alineación y balanceo',
      fecha: mananaISO(),
      hora: '10:00',
      duracionMinutos: 45,
      estado: 'confirmada',
      notas: 'Mazda 3.',
      createdAt: ahora,
      updatedAt: ahora,
    },
    {
      id: 'cita-005',
      clienteNombre: 'Camila Rojas',
      clienteTelefono: '+56999991111',
      servicioId: 'svc-neumaticos',
      servicioNombre: 'Cambio de neumáticos',
      fecha: mananaISO(),
      hora: '14:00',
      duracionMinutos: 75,
      estado: 'pendiente',
      notas: 'Honda CR-V, llantas 215/65 R16.',
      createdAt: ahora,
      updatedAt: ahora,
    },
    {
      id: 'cita-006',
      clienteNombre: 'Jorge Fuentes',
      clienteTelefono: '+56973214569',
      servicioId: 'svc-lavado-auto',
      servicioNombre: 'Lavado y encerado',
      fecha: enDiasISO(2),
      hora: '16:00',
      duracionMinutos: 40,
      estado: 'pendiente',
      notas: 'Kia Sportage, cliente frecuente.',
      createdAt: ahora,
      updatedAt: ahora,
    },
  ];
}

/**
 * Catálogo de servicios expuesto como un mapa id -> Servicio para búsqueda
 * rápida desde el formulario al cambiar el picker.
 */
export const SERVICIOS_POR_ID: Record<string, Servicio> = SERVICIOS.reduce(
  (acc, svc) => {
    acc[svc.id] = svc;
    return acc;
  },
  {} as Record<string, Servicio>
);
