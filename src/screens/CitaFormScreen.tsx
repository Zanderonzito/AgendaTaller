// =============================================================================
// CitaFormScreen — crear o editar una cita
// =============================================================================
// Formulario controlado para crear o editar una cita. Todos los campos son
// controlados (value + onChangeText) y se validan antes de enviar.
//
// Conceptos de la Unidad 3 que demuestra:
//   - TextInput controlado (no uncontrolled)
//   - Validación antes de enviar (no en cada tecla)
//   - DatePicker y Picker de React Native
//   - Manejo de los 4 estados de carga al guardar
//   - Diferencia entre "modo crear" y "modo editar" con un mismo componente
// =============================================================================

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CitaFormulario, ErroresFormulario, RootStackParamList } from '../types';
import { useCitas } from '../hooks/useCitas';
import { SERVICIOS } from '../data/mockData';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/colors';
import { horariosDisponibles, isoAFecha, fechaAISO, hoyISO } from '../utils/date';
import { esValido, validarCita } from '../utils/validation';
import { formatearPrecio } from '../utils/helpers';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

type CitaFormScreenProps = NativeStackScreenProps<RootStackParamList, 'CitaForm'>;

const VALOR_INICIAL: CitaFormulario = {
  clienteNombre: '',
  clienteTelefono: '',
  servicioId: '',
  fecha: hoyISO(),
  hora: '09:00',
  notas: '',
};

export function CitaFormScreen({ route, navigation }: CitaFormScreenProps) {
  const { citaId, fecha: fechaPreset } = route.params ?? {};
  const esEdicion = Boolean(citaId);

  const { citas, estadoCarga, error, crearCita, actualizarCita, recargar } = useCitas();

  const [formulario, setFormulario] = useState<CitaFormulario>({
    ...VALOR_INICIAL,
    fecha: fechaPreset ?? hoyISO(),
  });
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [tocado, setTocado] = useState<boolean>(false);
  const [mostrarFechaPicker, setMostrarFechaPicker] = useState<boolean>(false);
  const [mostrarHoraPicker, setMostrarHoraPicker] = useState<boolean>(false);
  const [guardando, setGuardando] = useState<boolean>(false);

  // Si es edición, carga los datos de la cita existente en el formulario
  useEffect(() => {
    if (!citaId) return;
    const citaExistente = citas.find((c) => c.id === citaId);
    if (citaExistente) {
      setFormulario({
        clienteNombre: citaExistente.clienteNombre,
        clienteTelefono: citaExistente.clienteTelefono,
        servicioId: citaExistente.servicioId,
        fecha: citaExistente.fecha,
        hora: citaExistente.hora,
        notas: citaExistente.notas,
      });
    } else {
      // La cita no existe: recargar por si fue borrada desde otra pantalla
      recargar();
    }
  }, [citaId, citas, recargar]);

  // Si viene con fecha preset, la aplica
  useEffect(() => {
    if (fechaPreset) {
      setFormulario((prev) => ({ ...prev, fecha: fechaPreset }));
    }
  }, [fechaPreset]);

  // Título dinámico
  useEffect(() => {
    navigation.setOptions({ title: esEdicion ? 'Editar cita' : 'Nueva cita' });
  }, [esEdicion, navigation]);

  /**
   * Helper para actualizar un campo del formulario sin perder el resto.
   * Recibe el nombre del campo y el nuevo valor.
   */
  const actualizarCampo = <K extends keyof CitaFormulario>(
    campo: K,
    valor: CitaFormulario[K]
  ) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    // Si el usuario ya tocó el campo y se muestra el error, revalida en vivo
    if (tocado) {
      const nuevosErrores = validarCita({ ...formulario, [campo]: valor });
      setErrores(nuevosErrores);
    }
  };

  const servicioSeleccionado = useMemo(
    () => SERVICIOS.find((s) => s.id === formulario.servicioId),
    [formulario.servicioId]
  );

  const horarios = useMemo(() => horariosDisponibles(), []);

  /**
   * Guarda el formulario. Primero valida; si hay errores los muestra y
   * no avanza. Si todo OK, crea o actualiza según el modo.
   */
  const handleGuardar = async () => {
    setTocado(true);
    const erroresEncontrados = validarCita(formulario);
    setErrores(erroresEncontrados);

    if (!esValido(erroresEncontrados)) {
      // Mensaje corto para que el usuario sepa que algo falta
      Alert.alert(
        'Revisa el formulario',
        'Hay campos incompletos o inválidos. Revisa los marcados en rojo.',
        [{ text: 'OK' }]
      );
      return;
    }

    setGuardando(true);
    try {
      if (esEdicion && citaId) {
        await actualizarCita(citaId, formulario);
      } else {
        await crearCita(formulario);
      }
      // Vuelve a la pantalla anterior tras guardar
      navigation.goBack();
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : 'Error al guardar';
      Alert.alert('No se pudo guardar', mensaje, [{ text: 'OK' }]);
    } finally {
      setGuardando(false);
    }
  };

  // Render estados de carga
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

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cliente */}
          <View style={styles.campo}>
            <Text style={styles.etiqueta}>Nombre del cliente *</Text>
            <TextInput
              style={[styles.input, errores.clienteNombre && styles.inputError]}
              value={formulario.clienteNombre}
              onChangeText={(v) => actualizarCampo('clienteNombre', v)}
              placeholder="Ej: María González"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              returnKeyType="next"
              maxLength={60}
              accessibilityLabel="Nombre del cliente"
            />
            {errores.clienteNombre && (
              <Text style={styles.errorTexto}>{errores.clienteNombre}</Text>
            )}
          </View>

          {/* Teléfono */}
          <View style={styles.campo}>
            <Text style={styles.etiqueta}>Teléfono *</Text>
            <TextInput
              style={[styles.input, errores.clienteTelefono && styles.inputError]}
              value={formulario.clienteTelefono}
              onChangeText={(v) => actualizarCampo('clienteTelefono', v)}
              placeholder="Ej: +56987654321"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              returnKeyType="next"
              maxLength={15}
              accessibilityLabel="Teléfono del cliente"
            />
            {errores.clienteTelefono && (
              <Text style={styles.errorTexto}>{errores.clienteTelefono}</Text>
            )}
          </View>

          {/* Servicio */}
          <View style={styles.campo}>
            <Text style={styles.etiqueta}>Servicio *</Text>
            <View style={styles.pickerContenedor}>
              {SERVICIOS.map((svc) => {
                const seleccionado = formulario.servicioId === svc.id;
                return (
                  <Pressable
                    key={svc.id}
                    style={[
                      styles.opcionServicio,
                      seleccionado && styles.opcionServicioActiva,
                      errores.servicioId && !seleccionado && styles.inputError,
                    ]}
                    onPress={() => actualizarCampo('servicioId', svc.id)}
                    android_ripple={{ color: colors.primaryLight, radius: 200 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Servicio: ${svc.nombre}`}
                    accessibilityState={{ selected: seleccionado }}
                  >
                    <View style={styles.opcionSuperior}>
                      <Text
                        style={[
                          styles.opcionNombre,
                          seleccionado && styles.opcionNombreActiva,
                        ]}
                      >
                        {svc.nombre}
                      </Text>
                      <Text
                        style={[
                          styles.opcionPrecio,
                          seleccionado && styles.opcionPrecioActiva,
                        ]}
                      >
                        {formatearPrecio(svc.precio)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.opcionDuracion,
                        seleccionado && styles.opcionDuracionActiva,
                      ]}
                    >
                      ⏱ {svc.duracionMinutos} minutos
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errores.servicioId && (
              <Text style={styles.errorTexto}>{errores.servicioId}</Text>
            )}
          </View>

          {/* Fecha y hora */}
          <View style={styles.fila}>
            <View style={[styles.campo, styles.campoMitad]}>
              <Text style={styles.etiqueta}>Fecha *</Text>
              <Pressable
                style={[styles.input, styles.inputBoton, errores.fecha && styles.inputError]}
                onPress={() => setMostrarFechaPicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Seleccionar fecha"
              >
                <Text style={styles.inputBotonTexto}>
                  {formulario.fecha
                    ? new Date(formulario.fecha + 'T00:00:00').toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : 'Seleccionar'}
                </Text>
                <Text style={styles.inputBotonIcono}>▾</Text>
              </Pressable>
              {errores.fecha && <Text style={styles.errorTexto}>{errores.fecha}</Text>}

              {mostrarFechaPicker && (
                <DateTimePicker
                  value={isoAFecha(formulario.fecha)}
                  mode="date"
                  display="default"
                  minimumDate={isoAFecha(hoyISO())}
                  onChange={(e, fecha) => {
                    setMostrarFechaPicker(false);
                    if (e.type === 'set' && fecha) {
                      actualizarCampo('fecha', fechaAISO(fecha));
                    }
                  }}
                />
              )}
            </View>

            <View style={[styles.campo, styles.campoMitad]}>
              <Text style={styles.etiqueta}>Hora *</Text>
              <Pressable
                style={[styles.input, styles.inputBoton, errores.hora && styles.inputError]}
                onPress={() => setMostrarHoraPicker(true)}
                accessibilityRole="button"
                accessibilityLabel="Seleccionar hora"
              >
                <Text style={styles.inputBotonTexto}>{formulario.hora || 'Seleccionar'}</Text>
                <Text style={styles.inputBotonIcono}>▾</Text>
              </Pressable>
              {errores.hora && <Text style={styles.errorTexto}>{errores.hora}</Text>}

              {mostrarHoraPicker && (
                <DateTimePicker
                  value={(() => {
                    const [h, m] = formulario.hora.split(':').map(Number);
                    const d = isoAFecha(formulario.fecha);
                    d.setHours(h, m);
                    return d;
                  })()}
                  mode="time"
                  display="default"
                  onChange={(e, hora) => {
                    setMostrarHoraPicker(false);
                    if (e.type === 'set' && hora) {
                      const hh = String(hora.getHours()).padStart(2, '0');
                      const mm = String(hora.getMinutes()).padStart(2, '0');
                      actualizarCampo('hora', `${hh}:${mm}`);
                    }
                  }}
                />
              )}

              {/* Chips de horarios frecuentes */}
              <View style={styles.horariosChips}>
                {horarios.slice(0, 6).map((h) => (
                  <Pressable
                    key={h}
                    style={[
                      styles.chip,
                      formulario.hora === h && styles.chipActivo,
                    ]}
                    onPress={() => actualizarCampo('hora', h)}
                    accessibilityRole="button"
                    accessibilityLabel={`Hora ${h}`}
                  >
                    <Text
                      style={[
                        styles.chipTexto,
                        formulario.hora === h && styles.chipTextoActivo,
                      ]}
                    >
                      {h}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Notas */}
          <View style={styles.campo}>
            <Text style={styles.etiqueta}>Notas (opcional)</Text>
            <TextInput
              style={[styles.input, styles.inputMultilinea, errores.notas && styles.inputError]}
              value={formulario.notas}
              onChangeText={(v) => actualizarCampo('notas', v)}
              placeholder="Detalles del vehículo, instrucciones del cliente, etc."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              maxLength={200}
              textAlignVertical="top"
              accessibilityLabel="Notas adicionales"
            />
            <Text style={styles.contador}>{formulario.notas.length}/200</Text>
            {errores.notas && <Text style={styles.errorTexto}>{errores.notas}</Text>}
          </View>

          {/* Resumen del servicio seleccionado */}
          {servicioSeleccionado && (
            <View style={styles.resumen}>
              <Text style={styles.resumenTitulo}>Resumen</Text>
              <View style={styles.resumenFila}>
                <Text style={styles.resumenEtiqueta}>Servicio</Text>
                <Text style={styles.resumenValor}>{servicioSeleccionado.nombre}</Text>
              </View>
              <View style={styles.resumenFila}>
                <Text style={styles.resumenEtiqueta}>Duración</Text>
                <Text style={styles.resumenValor}>
                  {servicioSeleccionado.duracionMinutos} minutos
                </Text>
              </View>
              <View style={styles.resumenFila}>
                <Text style={styles.resumenEtiqueta}>Precio</Text>
                <Text style={[styles.resumenValor, styles.resumenPrecio]}>
                  {formatearPrecio(servicioSeleccionado.precio)}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Botones de acción pegados al fondo */}
        <View style={styles.acciones}>
          <Pressable
            style={[styles.boton, styles.botonCancelar]}
            onPress={() => navigation.goBack()}
            disabled={guardando}
            android_ripple={{ color: colors.primaryLight, radius: 200 }}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
          >
            <Text style={styles.botonCancelarTexto}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[styles.boton, styles.botonGuardar, guardando && styles.botonDeshabilitado]}
            onPress={handleGuardar}
            disabled={guardando}
            android_ripple={{ color: colors.primaryDark, radius: 200 }}
            accessibilityRole="button"
            accessibilityLabel={esEdicion ? 'Guardar cambios' : 'Crear cita'}
          >
            <Text style={styles.botonGuardarTexto}>
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear cita'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  campo: {
    marginBottom: spacing.lg,
  },
  campoMitad: {
    flex: 1,
  },
  fila: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  etiqueta: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputMultilinea: {
    minHeight: 80,
    paddingTop: spacing.sm,
  },
  errorTexto: {
    color: colors.error,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  // Picker de servicio
  pickerContenedor: {
    gap: spacing.sm,
  },
  opcionServicio: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  opcionServicioActiva: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  opcionSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  opcionNombre: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  opcionNombreActiva: {
    color: colors.primary,
  },
  opcionPrecio: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
  },
  opcionPrecioActiva: {
    color: colors.primaryDark,
  },
  opcionDuracion: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  opcionDuracionActiva: {
    color: colors.primaryDark,
  },
  // Botón tipo input (para fecha y hora)
  inputBoton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputBotonTexto: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  inputBotonIcono: {
    fontSize: 14,
    color: colors.textMuted,
  },
  // Chips de horarios
  horariosChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipTexto: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  chipTextoActivo: {
    color: colors.surface,
  },
  // Contador de notas
  contador: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  // Resumen
  resumen: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  resumenTitulo: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  resumenFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  resumenEtiqueta: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  resumenValor: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  resumenPrecio: {
    fontSize: fontSize.md,
    color: colors.primary,
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
  boton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: colors.primaryLight,
  },
  botonGuardar: {
    backgroundColor: colors.primary,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonCancelarTexto: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  botonGuardarTexto: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
