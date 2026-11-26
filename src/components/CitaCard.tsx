// =============================================================================
// CitaCard — tarjeta resumen de una cita para mostrar en listas
// =============================================================================
// Tarjeta con la información clave de una cita: hora, cliente, servicio y
// estado. Toca para abrir el detalle. Es el componente que más se repite
// en la app (aparece en la agenda y en el resultado de búsqueda).
// =============================================================================

import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Cita } from '../types';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/colors';
import { EstadoBadge } from './EstadoBadge';
import { calcularHoraFin } from '../utils/date';
import { inicialesDe } from '../utils/helpers';

interface CitaCardProps {
  cita: Cita;
  onPress: (citaId: string) => void;
}

export function CitaCard({ cita, onPress }: CitaCardProps) {
  const horaFin = calcularHoraFin(cita.hora, cita.duracionMinutos);
  const iniciales = inicialesDe(cita.clienteNombre);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(cita.id)}
      android_ripple={{ color: colors.primaryLight, radius: 240 }}
      accessibilityRole="button"
      accessibilityLabel={`Cita de ${cita.clienteNombre} a las ${cita.hora}`}
      accessibilityHint="Toca para ver el detalle de la cita"
    >
      {/* Columna izquierda: hora */}
      <View style={styles.columnaHora}>
        <Text style={styles.hora}>{cita.hora}</Text>
        <Text style={styles.horaFin}>{horaFin}</Text>
      </View>

      {/* Línea divisoria vertical */}
      <View style={styles.divisor} />

      {/* Contenido principal */}
      <View style={styles.contenido}>
        <View style={styles.filaSuperior}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{iniciales}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.cliente} numberOfLines={1}>
              {cita.clienteNombre}
            </Text>
            <Text style={styles.servicio} numberOfLines={1}>
              {cita.servicioNombre}
            </Text>
          </View>
        </View>
        <View style={styles.filaInferior}>
          <EstadoBadge estado={cita.estado} compact />
          {cita.notas.length > 0 && (
            <Text style={styles.notas} numberOfLines={1}>
              📝 {cita.notas}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    // Sombra sutil en Android e iOS
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  pressed: {
    backgroundColor: colors.primaryLight,
  },
  columnaHora: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hora: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
    letterSpacing: -0.3,
  },
  horaFin: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  divisor: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  contenido: {
    flex: 1,
    justifyContent: 'space-between',
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarTexto: {
    color: colors.surface,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.extrabold,
  },
  info: {
    flex: 1,
  },
  cliente: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  servicio: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 1,
  },
  filaInferior: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notas: {
    flex: 1,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
