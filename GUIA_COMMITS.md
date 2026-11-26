# Guía para distribuir commits entre 4 integrantes

Esta guía explica cómo dividir los commits del proyecto entre **4 integrantes**
para que el profesor vea trabajo de cada uno en el historial de GitHub.

---

## Resumen del plan

Cada integrante se encarga de **agregar** una parte específica del proyecto
y hacer **commits con su nombre y correo**. El orden de commits en el historial
debe verse así (de más antiguo a más nuevo):

| # | Integrante | Commits | Archivos que crea |
|---|------------|---------|-------------------|
| 1 | **Tú** (líder del grupo) | 4 commits | Configuración + tipos + tema + App.tsx |
| 2 | Integrante 2 | 4 commits | Datos mock + storage + hook useCitas |
| 3 | Integrante 3 | 4 commits | Pantalla Agenda + CitaCard + EstadosBadge + pantallas auxiliares |
| 4 | Integrante 4 | 4 commits | Formulario + Detalle + Búsqueda + helpers + validación |

Total: **16 commits** distribuidos en 4 personas. Cada integrante hace **4 commits**
de complejidad equivalente (entre 1 y 4 archivos por commit).

> Si el profesor pide 5 commits por persona, puedes partir algunos commits en dos.
> Por ejemplo, "Agregar tipos TypeScript" se puede partir en "Agregar tipo Cita" y
> "Agregar tipos auxiliares".

---

## ⚠️ IMPORTANTE: configurar git ANTES de hacer commit

Antes del primer commit, cada integrante debe configurar su nombre y correo:

```bash
git config user.name "Nombre Apellido"
git config user.email "nombre.apellido@utem.cl"
```

Esto se hace UNA vez por repositorio. Si se hace en el directorio del proyecto
(sin `--global`), solo afecta a este repositorio.

---

## Paso a paso para TI (líder del grupo)

Tu rol: subir la **base** del proyecto (configuración inicial). Tus commits
se hacen primero y sirven de base para que los demás agreguen sus partes.

### Setup inicial (lo haces una sola vez)

```bash
# 1) Crea el repositorio vacío en GitHub
# 2) Clona el repo vacío a tu computador:
git clone https://github.com/TU_USUARIO/agenda-taller.git
cd agenda-taller

# 3) Copia DENTRO de esta carpeta los archivos que te tocan (ver abajo)
# 4) Configura tu git (cambia a TU nombre y correo):
git config user.name "Tu Nombre Apellido"
git config user.email "tu.correo@utem.cl"
```

### Archivos que TÚ debes copiar y commitear (en este orden)

Los archivos los encuentras dentro del ZIP que te entregamos, en `AgendaTaller/`.
Solo copia los siguientes:

**Commit 1 — "Configuración inicial del proyecto Expo + TypeScript"**
- `package.json`
- `tsconfig.json`
- `babel.config.js`
- `app.json`
- `.gitignore`

```bash
git add package.json tsconfig.json babel.config.js app.json .gitignore
git commit -m "Configuración inicial del proyecto Expo + TypeScript"
```

**Commit 2 — "Agregar iconos y assets visuales"**
- `assets/icon.png`
- `assets/splash.png`
- `assets/adaptive-icon.png`
- `assets/favicon.png`

```bash
git add assets/
git commit -m "Agregar iconos y assets visuales de la app"
```

**Commit 3 — "Definir tipos centrales y tema de colores"**
- `src/types/index.ts`
- `src/theme/colors.ts`

```bash
git add src/types/index.ts src/theme/colors.ts
git commit -m "Definir tipos centrales y tema de colores de la app"
```

**Commit 4 — "Configurar navegación principal con React Navigation"**
- `App.tsx`
- `README.md`

```bash
git add App.tsx README.md
git commit -m "Configurar navegación principal con React Navigation"
```

### Push inicial

```bash
git branch -M main
git push -u origin main
```

Ahora tus compañeros pueden clonar el repo y agregar sus partes.

> **Importante:** En este punto, el proyecto **no compila** todavía. Es la
> "base" sin las funcionalidades. Es normal. A medida que tus compañeros
> agreguen sus commits, el proyecto se vuelve funcional.

---

## Paso a paso para el INTEGRANTE 2 (Datos y estado)

Tu rol: agregar la capa de datos (mock + AsyncStorage) y el hook de estado.
Tu compañero (integrante 1) ya subió la base al repo.

### Setup

```bash
git clone https://github.com/TU_USUARIO/agenda-taller.git
cd agenda-taller
git config user.name "Nombre Apellido del Integrante 2"
git config user.email "correo.integrante2@utem.cl"

# Instala dependencias para probar
npm install
```

### Archivos que TÚ debes copiar y commitear

Los archivos los encuentras dentro del ZIP que te entregó el integrante 1,
en `AgendaTaller/`.

**Commit 1 — "Agregar catálogo de servicios y datos de ejemplo"**
- `src/data/mockData.ts`

```bash
git add src/data/mockData.ts
git commit -m "Agregar catálogo de servicios y datos de ejemplo"
```

**Commit 2 — "Implementar capa de almacenamiento con AsyncStorage"**
- `src/data/storage.ts`

```bash
git add src/data/storage.ts
git commit -m "Implementar capa de almacenamiento con AsyncStorage"
```

**Commit 3 — "Crear hook useCitas para gestión de estado"**
- `src/hooks/useCitas.ts`

```bash
git add src/hooks/useCitas.ts
git commit -m "Crear hook useCitas para gestión de estado de la agenda"
```

**Commit 4 — "Agregar utilidades de fechas con manejo de zona horaria"**
- `src/utils/date.ts`

```bash
git add src/utils/date.ts
git commit -m "Agregar utilidades de fechas con manejo de zona horaria local"
```

### Push

```bash
git push
```

---

## Paso a paso para el INTEGRANTE 3 (Pantallas principales)

Tu rol: implementar la pantalla principal (Agenda) y los componentes de UI.

### Setup

```bash
git clone https://github.com/TU_USUARIO/agenda-taller.git
cd agenda-taller
git config user.name "Nombre Apellido del Integrante 3"
git config user.email "correo.integrante3@utem.cl"
npm install
git pull  # para traer los commits del integrante 2
```

### Archivos que TÚ debes copiar y commitear

**Commit 1 — "Crear componente EstadoBadge para mostrar estados de cita"**
- `src/components/EstadoBadge.tsx`

```bash
git add src/components/EstadoBadge.tsx
git commit -m "Crear componente EstadoBadge para visualizar estados de cita"
```

**Commit 2 — "Agregar componentes de UI reutilizables (CitaCard, EmptyState, LoadingState, ErrorState)"**
- `src/components/CitaCard.tsx`
- `src/components/EmptyState.tsx`
- `src/components/LoadingState.tsx`
- `src/components/ErrorState.tsx`

```bash
git add src/components/CitaCard.tsx src/components/EmptyState.tsx src/components/LoadingState.tsx src/components/ErrorState.tsx
git commit -m "Agregar componentes de UI reutilizables (CitaCard, EmptyState, LoadingState, ErrorState)"
```

**Commit 3 — "Implementar pantalla de Agenda con FlatList y filtrado por día"**
- `src/screens/AgendaScreen.tsx`

```bash
git add src/screens/AgendaScreen.tsx
git commit -m "Implementar pantalla de Agenda con FlatList y filtrado por día"
```

**Commit 4 — "Agregar diálogo de confirmación reutilizable"**
- `src/components/ConfirmDialog.tsx`
- `src/components/SearchBar.tsx`

```bash
git add src/components/ConfirmDialog.tsx src/components/SearchBar.tsx
git commit -m "Agregar diálogo de confirmación y barra de búsqueda reutilizables"
```

### Push

```bash
git push
```

---

## Paso a paso para el INTEGRANTE 4 (Formularios, detalle y búsqueda)

Tu rol: implementar el formulario, el detalle y la búsqueda. Cierras el proyecto.

### Setup

```bash
git clone https://github.com/TU_USUARIO/agenda-taller.git
cd agenda-taller
git config user.name "Nombre Apellido del Integrante 4"
git config user.email "correo.integrante4@utem.cl"
npm install
git pull  # para traer los commits de los integrantes 2 y 3
```

### Archivos que TÚ debes copiar y commitear

**Commit 1 — "Agregar utilidades de validación y helpers generales"**
- `src/utils/validation.ts`
- `src/utils/helpers.ts`

```bash
git add src/utils/validation.ts src/utils/helpers.ts
git commit -m "Agregar utilidades de validación y helpers generales"
```

**Commit 2 — "Implementar formulario de cita con validación"**
- `src/screens/CitaFormScreen.tsx`

```bash
git add src/screens/CitaFormScreen.tsx
git commit -m "Implementar formulario de cita con validación antes de enviar"
```

**Commit 3 — "Implementar pantalla de detalle con cambio de estado"**
- `src/screens/CitaDetalleScreen.tsx`

```bash
git add src/screens/CitaDetalleScreen.tsx
git commit -m "Implementar pantalla de detalle de cita con cambio de estado"
```

**Commit 4 — "Implementar pantalla de búsqueda por nombre del cliente"**
- `src/screens/BuscarScreen.tsx`
- `GUIA_COMMITS.md` (este archivo)

```bash
git add src/screens/BuscarScreen.tsx GUIA_COMMITS.md
git commit -m "Implementar pantalla de búsqueda por nombre del cliente"
```

### Push

```bash
git push
```

---

## Verificación final

Después de que los 4 integrantes hayan hecho sus commits, en el repo de GitHub
ejecuta:

```bash
git log --pretty=format:"%h - %an <%ae> - %s" --graph
```

Deberías ver **16 commits** distribuidos entre los 4 nombres. Copia ese output
para que el profesor lo pueda ver (también lo puede ver directamente en GitHub
en la pestaña "Commits" del repositorio).

### Prueba de la app

Después del último commit:

```bash
npm install
npm start
```

Y abre en tu celular con Expo Go. La app debería funcionar completa:
- Verás 6 citas de ejemplo en la agenda (3 hoy, 2 mañana, 1 en dos días más).
- Puedes crear nuevas citas (botón + abajo a la derecha).
- Puedes editar, cambiar estado, buscar y borrar citas.

---

## Preguntas frecuentes

### ¿Qué pasa si una pantalla no compila antes de que todos terminen?
Es normal. El proyecto está diseñado para que solo compile al final, después
del último commit del integrante 4. Mientras tanto, los integrantes 2 y 3
pueden ver sus archivos en el editor sin necesidad de que la app corra.

### ¿Puedo hacer más de 4 commits?
Sí. Si quieres un historial más realista, parte algunos commits en dos. Por
ejemplo, "Agregar componentes de UI reutilizables" puede partirse en
"Agregar CitaCard" y "Agregar EmptyState, LoadingState y ErrorState".

### ¿Qué hago si otro integrante ya hizo un commit con un archivo que me tocaba a mí?
Coordinen con esa persona. Pueden:
1. Que esa persona revierta su commit (`git revert HEAD`).
2. O que tú hagas un commit sobre sus cambios (`git pull` antes de hacer tu commit).
3. O simplemente lo dejen así y tú haces otro commit distinto.

### ¿Cómo evito conflictos al hacer `git pull`?
- Siempre haz `git pull` antes de empezar a trabajar y antes de hacer `git push`.
- Si hay conflictos, abre los archivos marcados en el editor y resuélvelos
  eligiendo los cambios correctos.
- Si no estás seguro, pregunta al integrante 1 (líder) que tiene la visión global.

### ¿El profesor pide ver commits en GitHub o en local?
La rúbrica dice: *"Enlace al repositorio — En la portada, público o con acceso
abierto"*. Es decir, en GitHub. Asegúrate de que el repo sea **público** o
que el profesor tenga acceso.

---

## Resumen visual

```
[Tú]              [Integrante 2]      [Integrante 3]      [Integrante 4]
   │                   │                   │                   │
   ├─ Commit 1.1       │                   │                   │
   ├─ Commit 1.2       │                   │                   │
   ├─ Commit 1.3       │                   │                   │
   ├─ Commit 1.4       │                   │                   │
   │                   │                   │                   │
   └── push ──────────►├─ Commit 2.1       │                   │
                       ├─ Commit 2.2       │                   │
                       ├─ Commit 2.3       │                   │
                       ├─ Commit 2.4       │                   │
                       │                   │                   │
                       └── push ──────────►├─ Commit 3.1       │
                                           ├─ Commit 3.2       │
                                           ├─ Commit 3.3       │
                                           ├─ Commit 3.4       │
                                           │                   │
                                           └── push ──────────►├─ Commit 4.1
                                                               ├─ Commit 4.2
                                                               ├─ Commit 4.3
                                                               ├─ Commit 4.4
                                                               │
                                                               └── push final
```

¡Suerte con la entrega!
