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
import { SectionList } from 'react-native';
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
  formatoFechaLarga,
  hoyISO,
} from '../utils/date';
import { useCallback } from 'react';

type AgendaScreenProps = NativeStackScreenProps<RootStackParamList, 'Agenda'>;

export function AgendaScreen({ navigation }: AgendaScreenProps) {
  const { citas, estadoCarga, error, recargar } = useCitas();

  // Recarga cada vez que la pantalla recibe foco (p.ej. al volver del
  // formulario después de crear una cita). useFocusEffect se limpia solo.
  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar])
  );

  // Agrupa cronológicamente las citas y excluye las que ya fueron completadas.
  const secciones = useMemo(() => {
    const activas = citas.filter((c) => c.estado !== 'completada');
    const fechas = [...new Set(activas.map((c) => c.fecha))].sort();
    return fechas.map((fecha) => ({
      fecha,
      title: fecha,
      data: activas
        .filter((c) => c.fecha === fecha)
        .sort((a, b) => a.hora.localeCompare(b.hora)),
    }));
  }, [citas]);

  const abrirDetalle = (citaId: string) => {
    navigation.navigate('CitaDetalle', { citaId });
  };

  const abrirFormulario = () => navigation.navigate('CitaForm', { fecha: hoyISO() });

  const abrirBuscar = () => {
    navigation.navigate('Buscar');
  };

  // Encabezado de la lista: accesos rápidos
  const renderHeader = () => (
    <View style={styles.encabezadoLista}>
      <View style={styles.estadisticas}>
        <View style={styles.stat}>
          <Text style={styles.statNumero}>{secciones.reduce((n, s) => n + s.data.length, 0)}</Text>
          <Text style={styles.statEtiqueta}>Activas</Text>
        </View>
        <View style={styles.statDivisor} />
        <View style={styles.stat}>
          <Text style={styles.statNumero}>{citas.filter((c) => c.estado === 'pendiente').length}</Text>
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

  // Lista vacía
  const renderEmpty = () => (
    <EmptyState
      titulo="No hay citas activas"
      mensaje="Las citas completadas no aparecen aquí. Toca + para crear una nueva cita."
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

      <SectionList
        sections={secciones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CitaCard cita={item} onPress={abrirDetalle} />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.tituloFecha}>{formatoFechaLarga(section.fecha)}</Text>
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
  encabezadoLista: { marginBottom: spacing.md },
  tituloFecha: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
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
