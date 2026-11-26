// =============================================================================
// SearchBar — barra de búsqueda controlada
// =============================================================================
// Barra de búsqueda con icono y botón de limpiar. El valor es controlado
// por el padre (el padre pasa `value` y `onChangeText`), siguiendo el
// patrón de formulario controlado que pide la rúbrica (Tema 3).
// =============================================================================

import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar por nombre...',
}: SearchBarProps) {
  return (
    <View style={styles.contenedor} accessibilityRole="search">
      <Text style={styles.icono}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Campo de búsqueda"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.limpiar}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    // Sombra sutil
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  icono: {
    fontSize: fontSize.md,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    padding: 0, // quita padding nativo de Android
  },
  limpiar: {
    fontSize: 22,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    paddingLeft: spacing.sm,
  },
});
