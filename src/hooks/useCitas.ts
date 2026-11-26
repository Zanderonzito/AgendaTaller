// =============================================================================
// Hook useCitas — fuente única de estado de la agenda
// =============================================================================
// Cualquier pantalla que necesite leer, crear, editar o borrar citas lo
// hace a través de este hook. Nunca se llama a AsyncStorage directamente
// desde una pantalla. Así el estado está centralizado y los componentes
// son más fáciles de razonar.
//
// El hook expone los cuatro estados de carga que pide la Unidad 3:
//   - idle: la pantalla montó pero aún no pide datos
//   - cargando: hay una operación en curso
//   - exito: la última operación terminó bien
//   - error: la última operación falló, con mensaje accesible
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Cita, CitaFormulario, EstadoCarga, EstadoCita } from '../types';
import { cargarCitas, guardarCitas } from '../data/storage';
import { SERVICIOS_POR_ID } from '../data/mockData';
import { generarId } from '../utils/helpers';

interface UseCitasResultado {
  citas: Cita[];
  estadoCarga: EstadoCarga;
  error: string | null;
  crearCita: (datos: CitaFormulario) => Promise<Cita>;
  actualizarCita: (id: string, datos: CitaFormulario) => Promise<Cita>;
  cambiarEstado: (id: string, nuevoEstado: EstadoCita) => Promise<void>;
  eliminarCita: (id: string) => Promise<void>;
  recargar: () => Promise<void>;
}

export function useCitas(): UseCitasResultado {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [estadoCarga, setEstadoCarga] = useState<EstadoCarga>('idle');
  const [error, setError] = useState<string | null>(null);
  // Ref que guarda el estado actual para evitar carreras entre renders.
  const citasRef = useRef<Cita[]>([]);
  citasRef.current = citas;

  /**
   * Carga inicial al montar el hook. El [] vacío del useEffect asegura que
   * se ejecute una sola vez.
   */
  useEffect(() => {
    recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Vuelve a cargar las citas desde AsyncStorage. Útil para reintentar
   * tras un error o para refrescar tras un cambio externo.
   */
  const recargar = useCallback(async () => {
    setEstadoCarga('cargando');
    setError(null);
    try {
      const cargadas = await cargarCitas();
      setCitas(cargadas);
      setEstadoCarga('exito');
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : 'Error desconocido';
      setError(mensaje);
      setEstadoCarga('error');
    }
  }, []);

  /**
   * Persiste un nuevo array de citas. Encapsula la lógica de "guardar +
   * actualizar estado" para que las operaciones públicas sean más simples.
   */
  const persistir = useCallback(async (nuevas: Cita[]) => {
    setEstadoCarga('cargando');
    setError(null);
    try {
      await guardarCitas(nuevas);
      setCitas(nuevas);
      setEstadoCarga('exito');
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : 'Error desconocido';
      setError(mensaje);
      setEstadoCarga('error');
      // Re-lanzamos para que el llamador pueda saber que falló
      throw e;
    }
  }, []);

  /**
   * Crea una nueva cita a partir de los datos del formulario.
   * Devuelve la cita creada (con su nuevo ID) para que el llamador pueda
   * navegar al detalle, por ejemplo.
   */
  const crearCita = useCallback(
    async (datos: CitaFormulario): Promise<Cita> => {
      const ahora = new Date().toISOString();
      const servicio = SERVICIOS_POR_ID[datos.servicioId];
      if (!servicio) {
        throw new Error('Servicio seleccionado no existe.');
      }

      const nueva: Cita = {
        id: generarId(),
        clienteNombre: datos.clienteNombre.trim(),
        clienteTelefono: datos.clienteTelefono.trim(),
        servicioId: datos.servicioId,
        servicioNombre: servicio.nombre,
        fecha: datos.fecha,
        hora: datos.hora,
        duracionMinutos: servicio.duracionMinutos,
        estado: 'pendiente',
        notas: datos.notas.trim(),
        createdAt: ahora,
        updatedAt: ahora,
      };

      // Agregamos al inicio para que aparezca primero en la lista
      const nuevas = [nueva, ...citasRef.current];
      await persistir(nuevas);
      return nueva;
    },
    [persistir]
  );

  /**
   * Actualiza una cita existente con los datos del formulario.
   * Mantiene el estado actual (no lo resetea a pendiente).
   */
  const actualizarCita = useCallback(
    async (id: string, datos: CitaFormulario): Promise<Cita> => {
      const servicio = SERVICIOS_POR_ID[datos.servicioId];
      if (!servicio) {
        throw new Error('Servicio seleccionado no existe.');
      }

      const actual = citasRef.current.find((c) => c.id === id);
      if (!actual) {
        throw new Error('Cita no encontrada.');
      }

      const actualizada: Cita = {
        ...actual,
        clienteNombre: datos.clienteNombre.trim(),
        clienteTelefono: datos.clienteTelefono.trim(),
        servicioId: datos.servicioId,
        servicioNombre: servicio.nombre,
        fecha: datos.fecha,
        hora: datos.hora,
        duracionMinutos: servicio.duracionMinutos,
        notas: datos.notas.trim(),
        updatedAt: new Date().toISOString(),
      };

      const nuevas = citasRef.current.map((c) => (c.id === id ? actualizada : c));
      await persistir(nuevas);
      return actualizada;
    },
    [persistir]
  );

  /**
   * Cambia solo el estado de una cita (pendiente → confirmada, etc.).
   */
  const cambiarEstado = useCallback(
    async (id: string, nuevoEstado: EstadoCita): Promise<void> => {
      const nuevas = citasRef.current.map((c) =>
        c.id === id
          ? { ...c, estado: nuevoEstado, updatedAt: new Date().toISOString() }
          : c
      );
      await persistir(nuevas);
    },
    [persistir]
  );

  /**
   * Elimina una cita por ID. No pide confirmación: esa lógica es de la
   * pantalla, no del hook.
   */
  const eliminarCita = useCallback(
    async (id: string): Promise<void> => {
      const nuevas = citasRef.current.filter((c) => c.id !== id);
      await persistir(nuevas);
    },
    [persistir]
  );

  return {
    citas,
    estadoCarga,
    error,
    crearCita,
    actualizarCita,
    cambiarEstado,
    eliminarCita,
    recargar,
  };
}
