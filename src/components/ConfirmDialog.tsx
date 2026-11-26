// =============================================================================
// ConfirmDialog — diálogo modal de confirmación
// =============================================================================
// Componente de diálogo reutilizable. Recibe título, mensaje y dos
// callbacks (onConfirmar y onCancelar). Lo usamos para confirmar el borrado
// de una cita. Mantenerlo aislado evita duplicar la lógica modal en cada
// pantalla.
// =============================================================================

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/colors';

interface ConfirmDialogProps {
  visible: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({
  visible,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={styles.overlay}>
        <View style={styles.dialogo} accessibilityRole="alert">
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.mensaje}>{mensaje}</Text>
          <View style={styles.acciones}>
            <Pressable
              style={[styles.boton, styles.botonCancelar]}
              onPress={onCancelar}
              android_ripple={{ color: colors.primaryLight, radius: 200 }}
              accessibilityRole="button"
              accessibilityLabel={textoCancelar}
            >
              <Text style={styles.textoCancelar}>{textoCancelar}</Text>
            </Pressable>
            <Pressable
              style={[styles.boton, styles.botonConfirmar]}
              onPress={onConfirmar}
              android_ripple={{ color: colors.danger, radius: 200 }}
              accessibilityRole="button"
              accessibilityLabel={textoConfirmar}
            >
              <Text style={styles.textoConfirmar}>{textoConfirmar}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 40, 63, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  dialogo: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 380,
  },
  titulo: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  mensaje: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  acciones: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  botonConfirmar: {
    backgroundColor: colors.danger,
  },
  textoCancelar: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  textoConfirmar: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
