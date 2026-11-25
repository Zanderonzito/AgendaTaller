// =============================================================================
// Paleta de colores y constantes de tema
// =============================================================================
// Centralizar los colores evita valores hardcoded (tipo '#0d63a5' dispersos
// por toda la app) y permite que un cambio de marca se haga en un solo lugar.
// =============================================================================

export const colors = {
  // Marca principal
  primary: '#0d63a5',
  primaryDark: '#08497c',
  primaryLight: '#eaf4fd',

  // Acentos por estado de cita
  pendiente: '#f59e0b',
  confirmada: '#14b8a6',
  completada: '#16a34a',
  cancelada: '#e11d48',

  // Neutros
  background: '#f2f7fc',
  surface: '#ffffff',
  border: '#dbe7f3',
  textPrimary: '#12283f',
  textSecondary: '#5b7997',
  textMuted: '#9eb3c7',

  // Estado de UI
  error: '#e11d48',
  success: '#16a34a',
  warning: '#f59e0b',

  // Acciones
  danger: '#dc2626',
  dangerLight: '#fef2f2',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;
