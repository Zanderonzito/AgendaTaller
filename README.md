# Agenda Taller · App móvil (React Native + Expo)

Proyecto del **Trabajo 3** de *Desarrollo de Aplicaciones Móviles y Web* (UTEM).
Tema elegido: **T03 — Agenda de un taller mecánico o peluquería**.

---

## Qué hace la app

Una app para que un negocio pequeño administre sus citas del día:

- **Vista de agenda por día** con navegación entre días (‹ día ›) y botón para volver a hoy.
- **Crear y editar cita** con formulario controlado y validación.
- **Cambiar el estado** de una cita: pendiente → confirmada → completada (o cancelada).
- **Buscar citas por nombre del cliente** sin distinguir mayúsculas ni acentos.
- **Llamar al cliente** directo desde el detalle.
- **Persistencia local** con AsyncStorage (los datos no se pierden al cerrar la app).

---

## Requisitos previos

Antes de instalar necesitas tener:

1. **Node.js 18 o superior** (verifica con `node --version`).
2. **Expo CLI** (se instala automáticamente al correr `npm install`).
3. **Expo Go** en el celular Android o iOS (descárgalo desde la tienda de tu celular).

No necesitas instalar Android Studio para probar la app en tu celular. Solo necesitas
**Expo Go** y que el celular y tu computador estén en la misma red Wi-Fi.

> Si el profesor pide ver la app en Android Studio, también puedes correr `npx expo start --android`
> con Android Studio y el SDK instalado. Para este trabajo basta con Expo Go.

---

## Cómo instalar y ejecutar (paso a paso)

```bash
# 1) Descomprime el proyecto
unzip AgendaTaller.zip
cd AgendaTaller

# 2) Instala las dependencias (la primera vez toma ~3 minutos)
npm install

# 3) Inicia el servidor de desarrollo
npm start
# (o: npx expo start)
```

Aparecerá un código QR en la terminal. Ábrelo con la app **Expo Go** del celular
(Android: desde la app Expo Go; iOS: desde la app Cámara del iPhone).

La app se cargará en tu celular en segundos.

### Comandos útiles

| Comando | Para qué sirve |
| --- | --- |
| `npm start` | Inicia el servidor de desarrollo (muestra el QR). |
| `npm run android` | Inicia y abre la app en un emulador Android (requiere Android Studio). |
| `npm run ios` | Inicia y abre la app en el simulador iOS (solo macOS con Xcode). |
| `npm run web` | Abre la app en el navegador (modo web de Expo). |
| `npm run type-check` | Verifica el tipado de TypeScript sin ejecutar la app. |

---

## Estructura del proyecto

```
AgendaTaller/
├── App.tsx                     # Punto de entrada: configura la navegación
├── package.json                # Dependencias y scripts npm
├── app.json                    # Configuración Expo (nombre, iconos, splash)
├── tsconfig.json               # Configuración TypeScript (modo estricto)
├── babel.config.js             # Configuración Babel (preset Expo)
├── .gitignore                  # Archivos que git ignora (node_modules, etc.)
├── assets/                     # Iconos e imagen de splash
└── src/
    ├── types/
    │   └── index.ts            # Tipos TypeScript (Cita, EstadoCita, etc.)
    ├── theme/
    │   └── colors.ts           # Paleta de colores y constantes de diseño
    ├── data/
    │   ├── mockData.ts         # Datos de ejemplo (carga inicial)
    │   └── storage.ts         # Capa de AsyncStorage (única en la app)
    ├── hooks/
    │   └── useCitas.ts        # Hook de estado de la agenda
    ├── utils/
    │   ├── date.ts            # Manejo de fechas (sin bugs de zona horaria)
    │   ├── validation.ts      # Validación del formulario
    │   └── helpers.ts         # Helpers generales (IDs, precios, etc.)
    ├── components/
    │   ├── CitaCard.tsx       # Tarjeta de cita (en listas)
    │   ├── EstadoBadge.tsx    # Badge de estado de cita
    │   ├── EmptyState.tsx     # Estado vacío reutilizable
    │   ├── SearchBar.tsx      # Barra de búsqueda controlada
    │   ├── ConfirmDialog.tsx  # Diálogo modal de confirmación
    │   ├── LoadingState.tsx   # Indicador de carga
    │   └── ErrorState.tsx     # Estado de error con botón reintentar
    └── screens/
        ├── AgendaScreen.tsx     # Pantalla principal (agenda por día)
        ├── CitaFormScreen.tsx    # Crear o editar cita
        ├── CitaDetalleScreen.tsx # Detalle de cita con cambio de estado
        └── BuscarScreen.tsx      # Búsqueda por nombre de cliente
```

---

## Conceptos de la Unidad 3 que demuestra este proyecto

| Concepto | Dónde está en el código |
| --- | --- |
| **JavaScript moderno (ES6+)** | Toda la app: `const/let`, arrow functions, spread, destructuring, template strings. |
| **Asincronía (async/await)** | `src/hooks/useCitas.ts` y `src/data/storage.ts` (con try/catch). |
| **React Native (componentes nativos)** | Toda la app: `View`, `Text`, `TextInput`, `FlatList`, `Pressable`, `Modal`. |
| **Despliegue** | Compilar y probar en un teléfono físico con Expo Go (verificación en equipo real). |
| **FlatList para listas largas** | `AgendaScreen.tsx` y `BuscarScreen.tsx`. |
| **Filtrado con `filter`** | `AgendaScreen.tsx` (filtra por día) y `BuscarScreen.tsx` (filtra por nombre). |
| **Formularios controlados con TextInput** | `CitaFormScreen.tsx` (todos los campos son `value` + `onChangeText`). |
| **Validación antes de enviar** | `CitaFormScreen.tsx` + `utils/validation.ts` (valida al enviar, no en cada tecla). |
| **Manejo de los 4 estados de carga** | `useCitas.ts` (`idle`, `cargando`, `exito`, `error`) y todas las pantallas. |
| **Navegación entre pantallas** | `App.tsx` con React Navigation (NativeStack). |
| **Estado compartido** | `useCitas.ts` se instancia en cada pantalla y comparte el estado vía `citasRef`. |
| **Persistencia local** | `data/storage.ts` con AsyncStorage. |
| **Arquitectura por capas** | Tipos → Datos → Hooks → Componentes/Pantallas. Ningún archivo de pantalla llama a `AsyncStorage` directamente (ver T17 de la rúbrica). |

---

## Pruebas en un teléfono físico (lo que pide la rúbrica)

La rúbrica dice textualmente:

> *Evidencia de ejecución en equipo real — Capturas o grabación en un teléfono físico, no solo en el emulador.*

Pasos para probar en tu celular:

1. Instala **Expo Go** desde Google Play (Android) o la App Store (iOS).
2. En tu computador: `cd AgendaTaller && npm install && npm start`.
3. En tu celular: abre Expo Go y escanea el QR que aparece en la terminal.
4. La app cargará en tu celular en 10–30 segundos.
5. Toma screenshots y graba un video mostrando las 4 pantallas:
   - Agenda del día con citas existentes
   - Formulario de nueva cita con validación (prueba dejando campos vacíos)
   - Cambio de estado de una cita
   - Búsqueda por nombre

> La app ya viene con datos de ejemplo precargados (citas para hoy y mañana).
> Si quieres borrar todos los datos y volver al estado inicial, desinstala
> Expo Go y vuelve a instalarla, o usa `AsyncStorage.removeItem('@agenda_taller/citas_v1')`.

---

## Solución de problemas

### "Unable to resolve module" o error de dependencias
Borra `node_modules` y el cache de Expo, luego reinstala:
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### El QR no carga en el celular
- Verifica que el celular y el computador estén en la **misma red Wi-Fi**.
- Si estás en una red empresarial o con firewall, prueba con la opción **Tunnel**:
  en la terminal donde corre `npm start`, presiona `s` para cambiar a modo Tunnel.
  Esto requiere una conexión a internet activa.

### "Command failed: npx expo"
Actualiza Node a la versión 18+:
```bash
node --version
# Si es menor a 18, actualiza desde https://nodejs.org
```

### TypeScript marca errores en el editor
Ejecuta `npm run type-check` desde el directorio del proyecto. Si no hay errores
en la terminal, el editor solo necesita reiniciarse para que tome la configuración.

---

## Créditos y licencia

Proyecto académico para el curso **Desarrollo de Aplicaciones Móviles y Web**,
Universidad Tecnológica Metropolitana (UTEM), Prof. Carlos Muñoz S., 2026.

Todo el código es propio y se entrega bajo licencia MIT (puedes reusarlo libremente).
