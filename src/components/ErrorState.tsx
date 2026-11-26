// =============================================================================
// ErrorState — pantalla de error con botón de reintentar
// =============================================================================
// Estado de error reutilizable. Muestra el mensaje y un botón para
// reintentar la operación. Es uno de los cuatro estados de carga que
// pide la rúbrica (idle / cargando / exito / error).
// =============================================================================

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/colors';

interface ErrorStateProps {
  mensaje: string;
  onReintentar?: () => void;
}

export function ErrorState({ mensaje, onReintentar }: ErrorStateProps) {
  return (
    <View style={styles.contenedor} accessibilityRole="text">
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.titulo}>Algo salió mal</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
      {onReintentar && (
        <Pressable
          style={styles.boton}
          onPress={onReintentar}
          android_ripple={{ color: colors.primaryDark, radius: 200 }}
          accessibilityRole="button"
          accessibilityLabel="Reintentar"
        >
          <Text style={styles.botonTexto}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  titulo: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
  },
  mensaje: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: '85%',
    lineHeight: 22,
  },
  boton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  botonTexto: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
