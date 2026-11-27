// =============================================================================
// Capa de almacenamiento: AsyncStorage con manejo explÃ­cito de errores
// =============================================================================
// Esta capa es el Ãºnico lugar de la app que se comunica con AsyncStorage.
// Las pantallas y hooks usan estas funciones para leer y guardar las citas.
// =============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Cita } from '../types';
import { generarMockInicial } from './mockData';

const STORAGE_KEY = '@agenda_taller/citas_v1';

/**
 * Carga las citas guardadas. Si es la primera ejecuciÃ³n, crea y guarda los
 * datos iniciales para mostrar ejemplos en la agenda.
 */
export async function cargarCitas(): Promise<Cita[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      const mock = generarMockInicial();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
      return mock;
    }

    const parseado: unknown = JSON.parse(raw);
    if (!Array.isArray(parseado)) {
      const mock = generarMockInicial();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
      return mock;
    }

    return parseado as Cita[];
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`No se pudo cargar la agenda: ${mensaje}`);
  }
}

/** Persiste el array completo de citas. */
export async function guardarCitas(citas: Cita[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(citas));
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`No se pudo guardar la agenda: ${mensaje}`);
  }
}

/** Borra todas las citas guardadas localmente; útil para reiniciar la agenda. */
export async function borrarTodo(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`No se pudo borrar la agenda: ${mensaje}`);
  }
}
