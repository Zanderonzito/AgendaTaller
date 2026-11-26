import { useCallback, useMemo } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
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
import { formatoFechaLarga, hoyISO } from '../utils/date';

type AgendaScreenProps = NativeStackScreenProps<RootStackParamList, 'Agenda'>;

export function AgendaScreen({ navigation }: AgendaScreenProps) {
  const { citas, estadoCarga, error, recargar } = useCitas();

  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar])
  );

  // Cada fecha muestra sus citas activas y, al final, una sección completada.
  const secciones = useMemo(() => {
    const fechas = [...new Set(citas.map((cita) => cita.fecha))].sort();

    return fechas.flatMap((fecha) => {
      const citasDelDia = citas
        .filter((cita) => cita.fecha === fecha)
        .sort((a, b) => a.hora.localeCompare(b.hora));
      const activas = citasDelDia.filter((cita) => cita.estado !== 'completada');
      const completadas = citasDelDia.filter((cita) => cita.estado === 'completada');

      return [
        { fecha, categoria: 'activas' as const, data: activas },
        ...(completadas.length > 0
          ? [{ fecha, categoria: 'completadas' as const, data: completadas }]
          : []),
      ];
    });
  }, [citas]);

  const totalCitas = citas.length;
  const pendientes = citas.filter((cita) => cita.estado === 'pendiente').length;

  const abrirDetalle = (citaId: string) => {
    navigation.navigate('CitaDetalle', { citaId });
  };

  const abrirFormulario = () => {
    navigation.navigate('CitaForm', { fecha: hoyISO() });
  };

  const abrirBuscar = () => navigation.navigate('Buscar');

  const renderHeader = () => (
    <View style={styles.encabezadoLista}>
      <View style={styles.estadisticas}>
        <View style={styles.stat}>
          <Text style={styles.statNumero}>{totalCitas}</Text>
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

  const renderEmpty = () => (
    <EmptyState
      titulo="No hay citas"
      mensaje="Toca + para crear la primera cita de la agenda."
      emoji="📅"
    />
  );

  if (estadoCarga === 'cargando' && citas.length === 0) {
    return (
      <SafeAreaView style={styles.contenedor} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Agenda del taller</Text>
          <Text style={styles.subtitulo}>Citas agrupadas por día</Text>
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
          <Text style={styles.subtitulo}>Citas agrupadas por día</Text>
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
        <Text style={styles.subtitulo}>Citas agrupadas por día</Text>
      </View>

      <SectionList
        sections={secciones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CitaCard cita={item} onPress={abrirDetalle} />}
        renderSectionHeader={({ section }) => (
          <Text
            style={section.categoria === 'completadas' ? styles.subtituloSeccion : styles.tituloFecha}
          >
            {section.categoria === 'completadas'
              ? 'Completadas'
              : formatoFechaLarga(section.fecha)}
          </Text>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        style={styles.listaContenedor}
        stickySectionHeadersEnabled={false}
      />

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
    backgroundColor: colors.primary,
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
    paddingBottom: 100,
  },
  listaContenedor: {
    backgroundColor: colors.background,
  },
  contenido: {
    flex: 1,
    backgroundColor: colors.background,
  },
  encabezadoLista: {
    marginBottom: spacing.md,
  },
  tituloFecha: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  subtituloSeccion: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
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
