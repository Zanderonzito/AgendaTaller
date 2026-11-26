// =============================================================================
// LoadingState — indicador de carga centrado
// =============================================================================
// Componente pequeño para mostrar un ActivityIndicator cuando una pantalla
// está cargando. Mantenerlo aislado evita estilos duplicados.
// =============================================================================

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '../theme/colors';

interface LoadingStateProps {
  mensaje?: string;
}

export function LoadingState({ mensaje = 'Cargando...' }: LoadingStateProps) {
  return (
    <View style={styles.contenedor} accessibilityRole="text" accessibilityLabel={mensaje}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  mensaje: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
});
