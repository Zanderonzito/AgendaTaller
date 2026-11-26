// =============================================================================
// BuscarScreen — búsqueda de citas por nombre del cliente
// =============================================================================
// Pantalla con una barra de búsqueda y una FlatList de resultados. Filtra
// las citas por nombre del cliente, sin importar mayúsculas ni acentos.
//
// Conceptos de la Unidad 3 que demuestra:
//   - filter con normalización de strings (quita acentos y mayúsculas)
//   - FlatList virtualizada
//   - useMemo para no recalcular el filtro en cada render
//   - Estado vacío diferenciado: "no buscaste nada" vs "no hay resultados"
//
// NOTA (corrección del teclado):
//   La barra de búsqueda NO va dentro de ListHeaderComponent. Si se pasa
//   una función creada dentro del componente (renderHeader), FlatList la
//   trata como un componente nuevo en cada render, desmonta el TextInput
//   y se pierde el foco: el teclado se cierra con cada letra. Por eso la
//   SearchBar y el contador se renderizan fuera de la FlatList, arriba.
// =============================================================================

import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../types';
import { useCitas } from '../hooks/useCitas';
import { CitaCard } from '../components/CitaCard';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { colors, fontSize, fontWeight, spacing } from '../theme/colors';

type BuscarScreenProps = NativeStackScreenProps<RootStackParamList, 'Buscar'>;

/**
 * Normaliza un string: quita acentos, diacríticos y pasa a minúsculas.
 * Así buscar "maria" encuentra "María", o "gonzalez" encuentra "GONZÁLEZ".
 */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ''); // quita diacríticos
}

export function BuscarScreen({ navigation }: BuscarScreenProps) {
  const { citas, estadoCarga, error, recargar } = useCitas();
  const [consulta, setConsulta] = useState('');

  /**
   * Filtra las citas por nombre del cliente (sin distinguir mayúsculas
   * ni acentos). Ordena por fecha y hora para que los más recientes
   * aparezcan primero.
   */
  const resultados = useMemo(() => {
    if (consulta.trim().length === 0) return [];

    const q = normalizar(consulta.trim());
    return citas
      .filter((c) => normalizar(c.clienteNombre).includes(q))
      .sort((a, b) => {
        if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
        return b.hora.localeCompare(a.hora);
      });
  }, [citas, consulta]);

  const abrirDetalle = (citaId: string) => {
    navigation.navigate('CitaDetalle', { citaId });
  };

  // Render de estados de carga
  if (estadoCarga === 'cargando' && citas.length === 0) {
    return (
      <SafeAreaView style={styles.contenedor} edges={['top']}>
        <LoadingState mensaje="Cargando..." />
      </SafeAreaView>
    );
  }
  if (estadoCarga === 'error' && citas.length === 0) {
    return (
      <SafeAreaView style={styles.contenedor} edges={['top']}>
        <ErrorState mensaje={error ?? 'Error'} onReintentar={recargar} />
      </SafeAreaView>
    );
  }

  // Render vacío: cambia el mensaje según si el usuario ya escribió o no
  const renderEmpty = () => {
    if (consulta.trim().length === 0) {
      return (
        <EmptyState
          titulo="Busca citas por cliente"
          mensaje="Escribe al menos una letra del nombre del cliente para encontrar sus citas."
          emoji="🔎"
        />
      );
    }
    return (
      <EmptyState
        titulo="Sin coincidencias"
        mensaje={`No encontramos citas de clientes que contengan «${consulta.trim()}». Prueba con otro nombre.`}
        emoji="🤔"
      />
    );
  };

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      {/* Cabecera fija FUERA de la FlatList: así el TextInput no se
          desmonta al escribir y el teclado se mantiene abierto. */}
      <View style={styles.cabecera}>
        <SearchBar value={consulta} onChangeText={setConsulta} />

        {consulta.trim().length > 0 && (
          <Text style={styles.contador}>
            {resultados.length === 0
              ? 'Sin resultados'
              : `${resultados.length} ${resultados.length === 1 ? 'coincidencia' : 'coincidencias'}`}
          </Text>
        )}
      </View>

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CitaCard cita={item} onPress={abrirDetalle} />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        // Para que la lista esté accesible mientras se escribe:
        removeClippedSubviews={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cabecera: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  lista: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  contador: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.sm,
  },
});
