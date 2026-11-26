// =============================================================================
// AgendaScreen — pantalla principal: agenda por día
// =============================================================================
// Muestra las citas de un día concreto, con navegación entre días (anterior
// y siguiente) y un botón para crear una nueva cita.
//
// Conceptos de la Unidad 3 que demuestra esta pantalla:
//   - FlatList para listas largas (virtualización)
//   - filter para quedarse solo con las citas del día seleccionado
//   - Manejo explícito de los 4 estados de carga (idle, cargando, exito, error)
//   - useCitas como fuente única de estado
//   - Navegación hacia el detalle y el formulario
// =============================================================================

import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../types';
import { useCitas } from '../hooks/useCitas';
import { CitaCard } from '../components/CitaCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/colors';
import {
  compararFechasISO,
  formatoFechaLarga,
  hoyISO,
  sumarDiasISO,
} from '../utils/date';
import { useCallback, useState } from 'react';

type AgendaScreenProps = NativeStackScreenProps<RootStackParamList, 'Agenda'>;

export function AgendaScreen({ navigation }: AgendaScreenProps) {
  const { citas, estadoCarga, error, recargar } = useCitas();
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(hoyISO());

  // Recarga cada vez que la pantalla recibe foco (p.ej. al volver del
  // formulario después de crear una cita). useFocusEffect se limpia solo.
  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar])
  );

  /**
   * Filtra las citas del día seleccionado y las ordena por hora.
   * useMemo evita recalcular si ni citas ni fechaSeleccionada cambiaron.
   */
  const citasDelDia = useMemo(() => {
    return citas
      .filter((c) => c.fecha === fechaSeleccionada)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }, [citas, fechaSeleccionada]);

  // Estadísticas para la barra superior
  const totalHoy = citasDelDia.length;
  const pendientes = citasDelDia.filter((c) => c.estado === 'pendiente').length;

  const irADiaAnterior = () => setFechaSeleccionada((f) => sumarDiasISO(f, -1));
  const irADiaSiguiente = () => setFechaSeleccionada((f) => sumarDiasISO(f, 1));
  const irAHoy = () => setFechaSeleccionada(hoyISO());

  const esHoy = compararFechasISO(fechaSeleccionada, hoyISO()) === 0;

  const abrirDetalle = (citaId: string) => {
    navigation.navigate('CitaDetalle', { citaId });
  };

  const abrirFormulario = () => {
    navigation.navigate('CitaForm', { fecha: fechaSeleccionada });
  };

  const abrirBuscar = () => {
    navigation.navigate('Buscar');
  };

  // Encabezado de la lista: barra de fecha + estadísticas
  const renderHeader = () => (
    <View>
      {/* Navegación entre días */}
      <View style={styles.barraDias}>
        <Pressable
          onPress={irADiaAnterior}
          style={styles.botonDia}
          android_ripple={{ color: colors.primaryLight, radius: 100 }}
          accessibilityRole="button"
          accessibilityLabel="Día anterior"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.flechaDia}>‹</Text>
        </Pressable>

        <Pressable
          onPress={irAHoy}
          style={styles.fechaCentro}
          accessibilityRole="button"
          accessibilityLabel="Ir a hoy"
        >
          <Text style={styles.fechaTexto}>{formatoFechaLarga(fechaSeleccionada)}</Text>
          {!esHoy && <Text style={styles.fechaVolver}>Toca para volver a hoy</Text>}
        </Pressable>

        <Pressable
          onPress={irADiaSiguiente}
          style={styles.botonDia}
          android_ripple={{ color: colors.primaryLight, radius: 100 }}
          accessibilityRole="button"
          accessibilityLabel="Día siguiente"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.flechaDia}>›</Text>
        </Pressable>
      </View>

      {/* Estadísticas del día */}
      <View style={styles.estadisticas}>
        <View style={styles.stat}>
          <Text style={styles.statNumero}>{totalHoy}</Text>
          <Text style={styles.statEtiqueta}>Citas</Text>
        </View>
        <View style={styles.statDivisor} />
        <View style={styles.stat}>
          <Text style={styles.statNumero}>{pendientes}</Text>
          <Text style={styles.statEtiqueta}>Pendientes</Text>
        </View>
        <View style={styles.statDivisor} />
        <Pressable
          onPress={abrirBuscar}
          style={styles.statBoton}
          android_ripple={{ color: colors.primaryLight, radius: 200 }}
          accessibilityRole="button"
          accessibilityLabel="Buscar por nombre"
        >
          <Text style={styles.statEmoji}>🔍</Text>
          <Text style={styles.statEtiqueta}>Buscar</Text>
        </Pressable>
      </View>
    </View>
  );

  // Lista vacía dentro del header
  const renderEmpty = () => (
    <EmptyState
      titulo="No hay citas este día"
      mensaje="Este día no tiene citas agendadas. Toca el botón + para crear la primera."
      emoji="📅"
    />
  );

  // Render principal según estado de carga
  if (estadoCarga === 'cargando' && citas.length === 0) {
    return (
      <SafeAreaView style={styles.contenedor} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Agenda del taller</Text>
          <Text style={styles.subtitulo}>Citas del día</Text>
        </View>
        <View style={styles.contenido}>
          <LoadingState mensaje="Cargando agenda..." />
        </View>
      </SafeAreaView>
    );
  }

  if (estadoCarga === 'error' && citas.length === 0) {
    return (
      <SafeAreaView style={styles.contenedor} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Agenda del taller</Text>
          <Text style={styles.subtitulo}>Citas del día</Text>
        </View>
        <View style={styles.contenido}>
          <ErrorState mensaje={error ?? 'Error desconocido'} onReintentar={recargar} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Agenda del taller</Text>
        <Text style={styles.subtitulo}>Citas del día</Text>
      </View>

      <FlatList
        data={citasDelDia}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CitaCard cita={item} onPress={abrirDetalle} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        style={styles.listaContenedor}
      />

      {/* Botón flotante de nueva cita */}
      <Pressable
        style={styles.fab}
        onPress={abrirFormulario}
        android_ripple={{ color: colors.primaryDark, radius: 200 }}
        accessibilityRole="button"
        accessibilityLabel="Crear nueva cita"
      >
        <Text style={styles.fabTexto}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.primary, // Área superior (status bar) en color marca
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  titulo: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: colors.surface,
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: fontSize.sm,
    color: colors.primaryLight,
    marginTop: 2,
  },
  lista: {
    padding: spacing.lg,
    paddingBottom: 100, // espacio para el FAB
  },
  listaContenedor: {
    backgroundColor: colors.background,
  },
  contenido: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Barra de navegación de días
  barraDias: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  botonDia: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
  },
  flechaDia: {
    fontSize: 32,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
    lineHeight: 36,
  },
  fechaCentro: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  fechaTexto: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  fechaVolver: {
    fontSize: fontSize.xs,
    color: colors.primary,
    marginTop: 2,
  },
  // Estadísticas
  estadisticas: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivisor: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  statBoton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  statNumero: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
  },
  statEtiqueta: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statEmoji: {
    fontSize: fontSize.xl,
  },
  // FAB
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabTexto: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    marginTop: -2,
  },
});
