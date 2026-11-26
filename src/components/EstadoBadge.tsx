// =============================================================================
// EstadoBadge — etiqueta de color según el estado de la cita
// =============================================================================
// Componente pequeño y presentacional. No sabe nada de AsyncStorage ni de
// navegación: solo recibe un estado y se pinta a sí mismo.
// =============================================================================

import { StyleSheet, Text, View } from 'react-native';
import type { EstadoCita } from '../types';
import { colorPorEstado, etiquetaEstado } from '../utils/helpers';
import { fontSize, fontWeight, radius, spacing } from '../theme/colors';

interface EstadoBadgeProps {
  estado: EstadoCita;
  compact?: boolean;
}

export function EstadoBadge({ estado, compact = false }: EstadoBadgeProps) {
  const color = colorPorEstado(estado);
  const etiqueta = etiquetaEstado(estado);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + '22', borderColor: color },
        compact && styles.compact,
      ]}
      accessibilityLabel={`Estado: ${etiqueta}`}
      accessibilityRole="text"
    >
      <View style={[styles.punto, { backgroundColor: color }]} />
      <Text style={[styles.texto, { color }, compact && styles.textoCompact]}>
        {etiqueta}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 1,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  punto: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginRight: spacing.xs,
  },
  texto: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.3,
  },
  textoCompact: {
    fontSize: 10,
  },
});
