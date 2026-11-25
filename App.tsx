// =============================================================================
// App.tsx — punto de entrada de la aplicación
// =============================================================================
// Configura el contenedor de navegación y registra las pantallas.
// Pantallas:
//   - Agenda      : pantalla principal (lista de citas del día)
//   - CitaForm    : crear o editar cita
//   - CitaDetalle : ver y modificar el estado de una cita
//   - Buscar      : búsqueda por nombre del cliente
//
// La navegación es un NativeStack (apila pantallas con botón de atrás).
// =============================================================================

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './src/types';
import { AgendaScreen } from './src/screens/AgendaScreen';
import { CitaFormScreen } from './src/screens/CitaFormScreen';
import { CitaDetalleScreen } from './src/screens/CitaDetalleScreen';
import { BuscarScreen } from './src/screens/BuscarScreen';
import { colors, fontSize, fontWeight } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Agenda"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTitleStyle: {
            color: '#fff',
            fontSize: fontSize.lg,
            fontWeight: fontWeight.extrabold,
          },
          headerTintColor: '#fff',
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Agenda"
          component={AgendaScreen}
          options={{ title: 'Agenda', headerShown: false }}
        />
        <Stack.Screen
          name="CitaForm"
          component={CitaFormScreen}
          options={{ title: 'Cita' }}
        />
        <Stack.Screen
          name="CitaDetalle"
          component={CitaDetalleScreen}
          options={{ title: 'Detalle' }}
        />
        <Stack.Screen
          name="Buscar"
          component={BuscarScreen}
          options={{ title: 'Buscar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
