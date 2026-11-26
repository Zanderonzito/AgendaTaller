// =============================================================================
// EmptyState — pantalla vacía: no hay resultados o no hay citas
// =============================================================================
// Estado vacío reutilizable. Se usa cuando una lista queda sin elementos,
// ya sea porque no hay citas para ese día o porque la búsqueda no
// encontró nada. Mostrar un estado vacío claro es mejor que una lista
// en blanco (uno de los cuatro estados de carga del material del curso).
// =============================================================================

import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '../theme/colors';

interface EmptyStateProps {
  titulo: string;
  mensaje: string;
  emoji?: string;
}

export function EmptyState({ titulo, mensaje, emoji = '📭' }: EmptyStateProps) {
  return (
    <View style={styles.contenedor} accessibilityRole="text">
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    paddingBottom: spacing.xxl + spacing.xl,
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  titulo: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 22,
  },
});
