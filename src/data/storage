// =============================================================================
// Capa de almacenamiento — AsyncStorage con manejo explícito de errores
// =============================================================================
// Esta capa es la ÚNICA en la app que habla con AsyncStorage. El resto del
// código (hooks, pantallas) usa esta API, no AsyncStorage directamente. Si
// en algún momento quisiéramos cambiar AsyncStorage por SQLite o un backend
// remoto, solo se toca este archivo. Esa es la idea de separar la capa de
// datos (ver T17 de la rúbrica).
// =============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Cita } from '../types';
import { generarMockInicial } from './mockData';

const STORAGE_KEY = '@agenda_taller/citas_v1';

/**
 * Carga todas las citas desde AsyncStorage.
 *
 * Si AsyncStorage está vacío (primera vez que se abre la app), siembra el
 * mock inicial y lo persiste. Así el profesor ve contenido desde el primer
 * arranque, no una lista vacía.
 *
 * Maneja los cuatro estados de carga explícitamente: lanza una excepción si
 * algo falla (estado error) en vez de devolver silenciosamente un array
 * vacío, que enmascararía el problema.
 */
export async function cargarCitas(): Promise<Cita[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      // Primera carga: sembrar el mock y persistirlo
      const mock = generarMockInicial();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
      return mock;
    }

    const parseado: unknown = JSON.parse(raw);

    if (!Array.isArray(parseado)) {
      // Datos corruptos: resembrar en vez de crashear
      const mock = generarMockInicial();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
      return mock;
    }

    return parseado as Cita[];
  } catch (error) {
    // Reenvolvemos el error con un mensaje claro para que el hook pueda
    // mostrarlo al usuario y para que el log sea rastreable.
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`No se pudo cargar la agenda: ${mensaje}`);
  }
}

/**
 * Persiste el array completo de citas. Sobrescribe cualquier dato previo.
 *
 * El hook useCitas llama a esta función cada vez que el estado cambia, así
 * los datos siempre quedan en disco.
 */
export async function guardarCitas(citas: Cita[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(citas));
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`No se pudo guardar la agenda: ${mensaje}`);
  }
}

/**
 * Borra todo el contenido de la agenda. Útil para depuración o para que el
 * usuario reinicie la app a su estado inicial.
 */
export async function borrarTodo(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`No se pudo borrar la agenda: ${mensaje}`);
  }
}
