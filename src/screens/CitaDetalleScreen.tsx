// =============================================================================
// CitaDetalleScreen — detalle de una cita con cambio de estado y borrado
// =============================================================================
// Muestra toda la información de una cita y permite:
//   - Cambiar el estado (pendiente → confirmada → completada)
//   - Cancelar la cita
//   - Editar la cita (navega al formulario)
//   - Eliminar la cita (con diálogo de confirmación)
// =============================================================================

import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { EstadoCita, RootStackParamList } from '../types';
import { useCitas } from '../hooks/useCitas';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/colors';
import { EstadoBadge } from '../components/EstadoBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import {
  calcularHoraFin,
  formatoFechaLarga,
} from '../utils/date';
import {
  ESTADOS_DISPONIBLES,
  etiquetaEstado,
  formatearPrecio,
  siguienteEstado,
  colorPorEstado,
} from '../utils/helpers';
import { SERVICIOS_POR_ID } from '../data/mockData';

type CitaDetalleScreenProps = NativeStackScreenProps<RootStackParamList, 'CitaDetalle'>;

export function CitaDetalleScreen({ route, navigation }: CitaDetalleScreenProps) {
  const { citaId } = route.params;
  const { citas, estadoCarga, cambiarEstado, eliminarCita, recargar } = useCitas();
  const [mostrarConfirmBorrar, setMostrarConfirmBorrar] = useState(false);
  const [operando, setOperando] = useState(false);

  const cita = citas.find((c) => c.id === citaId);

  // Recarga al montar por si la cita fue editada en otra pantalla
  useEffect(() => {
    recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: cita ? `Cita de ${cita.clienteNombre}` : 'Cita' });
  }, [cita, navigation]);

  // Manejo de estados de carga
  if (estadoCarga === 'cargando' && !cita) {
    return (
      <SafeAreaView style={styles.contenedor} edges={['top']}>
        <LoadingState mensaje="Cargando cita..." />
      </SafeAreaView>
    );
  }
  if (!cita) {
    return (
      <SafeAreaView style={styles.contenedor} edges={['top']}>
        <ErrorState
          mensaje="La cita que buscas no existe o fue eliminada."
          onReintentar={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const horaFin = calcularHoraFin(cita.hora, cita.duracionMinutos);
  const servicio = SERVICIOS_POR_ID[cita.servicioId];
  const sigEstado = siguienteEstado(cita.estado);

  const handleCambiarEstado = async (nuevo: EstadoCita) => {
    setOperando(true);
    try {
      await cambiarEstado(cita.id, nuevo);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al cambiar estado';
      Alert.alert('Error', msg);
    } finally {
      setOperando(false);
    }
  };

  const handleCancelarCita = () => {
    Alert.alert(
      '¿Cancelar esta cita?',
      'La cita quedará marcada como cancelada. No se borrará.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí, cancelar', style: 'destructive', onPress: () => handleCambiarEstado('cancelada') },
      ]
    );
  };

  const handleEliminar = async () => {
    setMostrarConfirmBorrar(false);
    setOperando(true);
    try {
      await eliminarCita(cita.id);
      navigation.goBack();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al borrar';
      Alert.alert('Error', msg);
    } finally {
      setOperando(false);
    }
  };

  const handleLlamar = () => {
    const telefono = cita.clienteTelefono.replace(/[\s\-().]/g, '');
    Linking.openURL(`tel:${telefono}`).catch(() => {
      Alert.alert('No se pudo iniciar la llamada', 'Revisa que el teléfono sea válido.');
    });
  };

  const handleEditar = () => {
    navigation.navigate('CitaForm', { citaId: cita.id });
  };

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera con estado destacado */}
        <View style={[styles.cabecera, { borderLeftColor: colorPorEstado(cita.estado) }]}>
          <View style={styles.cabeceraFila}>
            <View style={styles.cabeceraIzq}>
              <Text style={styles.cliente}>{cita.clienteNombre}</Text>
              <Text style={styles.servicio}>{cita.servicioNombre}</Text>
            </View>
            <EstadoBadge estado={cita.estado} />
          </View>
        </View>

        {/* Información principal */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Cuándo</Text>
          <View style={styles.filaInfo}>
            <Text style={styles.infoEmoji}>📅</Text>
            <View>
              <Text style={styles.infoPrincipal}>{formatoFechaLarga(cita.fecha)}</Text>
              <Text style={styles.infoSecundaria}>
                {cita.hora} – {horaFin} ({cita.duracionMinutos} min)
              </Text>
            </View>
          </View>
        </View>

        {/* Contacto */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Contacto</Text>
          <View style={styles.filaInfo}>
            <Text style={styles.infoEmoji}>📞</Text>
            <View style={styles.infoContenido}>
              <Text style={styles.infoPrincipal}>{cita.clienteTelefono}</Text>
              <Pressable
                onPress={handleLlamar}
                style={styles.botonAccionInline}
                android_ripple={{ color: colors.primaryLight, radius: 200 }}
                accessibilityRole="button"
                accessibilityLabel="Llamar al cliente"
              >
                <Text style={styles.botonAccionInlineTexto}>Llamar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Servicio */}
        {servicio && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Servicio</Text>
            <View style={styles.servicioInfo}>
              <View>
                <Text style={styles.infoPrincipal}>{servicio.nombre}</Text>
                <Text style={styles.infoSecundaria}>
                  {servicio.duracionMinutos} minutos
                </Text>
              </View>
              <Text style={styles.precio}>{formatearPrecio(servicio.precio)}</Text>
            </View>
          </View>
        )}

        {/* Notas */}
        {cita.notas.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.seccionTitulo}>Notas</Text>
            <View style={styles.notasCaja}>
              <Text style={styles.notasTexto}>{cita.notas}</Text>
            </View>
          </View>
        )}

        {/* Cambio de estado */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Cambiar estado</Text>
          <View style={styles.estadosGrid}>
            {ESTADOS_DISPONIBLES.map((est) => {
              const activo = cita.estado === est;
              const color = colorPorEstado(est);
              return (
                <Pressable
                  key={est}
                  style={[
                    styles.estadoBoton,
                    activo && { backgroundColor: color, borderColor: color },
                    !activo && { borderColor: color },
                  ]}
                  onPress={() => handleCambiarEstado(est)}
                  disabled={activo || operando}
                  android_ripple={{ color: color + '22', radius: 200 }}
                  accessibilityRole="button"
                  accessibilityLabel={`Marcar como ${etiquetaEstado(est)}`}
                  accessibilityState={{ selected: activo }}
                >
                  <Text
                    style={[
                      styles.estadoBotonTexto,
                      activo && styles.estadoBotonTextoActivo,
                      { color: activo ? colors.surface : color },
                    ]}
                  >
                    {etiquetaEstado(est)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Acción rápida: avanzar al siguiente estado */}
          {sigEstado && (
            <Pressable
              style={styles.botonAvanzar}
              onPress={() => handleCambiarEstado(sigEstado)}
              disabled={operando}
              android_ripple={{ color: colors.primaryDark, radius: 200 }}
              accessibilityRole="button"
              accessibilityLabel={`Avanzar a ${etiquetaEstado(sigEstado)}`}
            >
              <Text style={styles.botonAvanzarTexto}>
                Avanzar a «{etiquetaEstado(sigEstado)}» →
              </Text>
            </Pressable>
          )}

          {/* Acción rápida: cancelar cita si aún no está cancelada ni completada */}
          {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
            <Pressable
              style={[styles.botonAvanzar, styles.botonCancelar]}
              onPress={handleCancelarCita}
              disabled={operando}
              android_ripple={{ color: colors.danger, radius: 200 }}
              accessibilityRole="button"
              accessibilityLabel="Cancelar cita"
            >
              <Text style={[styles.botonAvanzarTexto, styles.botonCancelarTexto]}>
                Cancelar esta cita
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Botones de acción principales */}
      <View style={styles.acciones}>
        <Pressable
          style={[styles.accion, styles.accionEditar]}
          onPress={handleEditar}
          disabled={operando}
          android_ripple={{ color: colors.primaryLight, radius: 200 }}
          accessibilityRole="button"
          accessibilityLabel="Editar cita"
        >
          <Text style={styles.accionEditarTexto}>Editar</Text>
        </Pressable>
        <Pressable
          style={[styles.accion, styles.accionBorrar]}
          onPress={() => setMostrarConfirmBorrar(true)}
          disabled={operando}
          android_ripple={{ color: colors.dangerLight, radius: 200 }}
          accessibilityRole="button"
          accessibilityLabel="Eliminar cita"
        >
          <Text style={styles.accionBorrarTexto}>Eliminar</Text>
        </Pressable>
      </View>

      {/* Diálogo de confirmación de borrado */}
      <ConfirmDialog
        visible={mostrarConfirmBorrar}
        titulo="¿Eliminar cita?"
        mensaje={`Se borrará permanentemente la cita de ${cita.clienteNombre}. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        onConfirmar={handleEliminar}
        onCancelar={() => setMostrarConfirmBorrar(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  // Cabecera con cliente y estado
  cabecera: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 5,
  },
  cabeceraFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cabeceraIzq: {
    flex: 1,
    paddingRight: spacing.md,
  },
  cliente: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  servicio: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  // Secciones
  seccion: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  seccionTitulo: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  filaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoEmoji: {
    fontSize: fontSize.xl,
    marginRight: spacing.md,
  },
  infoContenido: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoPrincipal: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  infoSecundaria: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // Servicio
  servicioInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  precio: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
  },
  // Botón inline (llamar)
  botonAccionInline: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  botonAccionInlineTexto: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  // Notas
  notasCaja: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  notasTexto: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  // Cambio de estado
  estadosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  estadoBoton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  estadoBotonTexto: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  estadoBotonTextoActivo: {
    fontWeight: fontWeight.extrabold,
  },
  botonAvanzar: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  botonAvanzarTexto: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  botonCancelar: {
    backgroundColor: colors.dangerLight,
    marginTop: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  botonCancelarTexto: {
    color: colors.danger,
  },
  // Acciones
  acciones: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  accion: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  accionEditar: {
    backgroundColor: colors.primaryLight,
  },
  accionBorrar: {
    backgroundColor: colors.dangerLight,
  },
  accionEditarTexto: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  accionBorrarTexto: {
    color: colors.danger,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
