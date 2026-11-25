# Auditoría de navegación y propuesta UI/UX (ERAZ-006 a 009)

> **Estado: dirección aprobada por el equipo; implementada en v0.1.0-alpha.2 (ver `INFORME-UI-ALPHA2.md` y `ARQUITECTURA-UI.md`).** Pendiente de validación humana en el Playtest #002.
> Maqueta visual: `docs/propuesta-ui/mockup.html` (estática, usa `css/tokens.css`). Capturas: `docs/capturas/propuesta-ui-*.jpg`.
> La auditoría se hizo leyendo el código y recorriendo las pantallas en el navegador (automatizado). Falta la opinión humana de Rencorosito sobre dónde se pierde.

## 1. Mapa de navegación actual

```
Título (Comenzar)
 └─ Lobby ─┬─ Jugar → Modo → Intro (historia, «Saltar») → Partida
           ├─ Personajes
           ├─ Misiones
           ├─ Taller (personaje + ruleta + mejoras + colección + sonido)
           └─ Ajustes
Partida ─ Pausa ─┬─ Continuar
                 ├─ Ajustes (vuelve a Pausa)
                 └─ Salir al lobby   (sin confirmación)
Partida ─ Subida de nivel / Cofre / Ruleta gigante
Partida ─ Derrota / Victoria → «Volver al menú»
```

## 2. Problemas encontrados (con evidencia en el código)
| # | Problema | Dónde | Impacto |
|---|---|---|---|
| U1 | **«Salir al lobby» abandona la partida sin confirmar y sin conceder las monedas ganadas** (`endRun` no se llama) | Pausa | Pérdida de progreso por un toque accidental (ERAZ-008) |
| U2 | **Reiniciar exige 5 pasos**: Menú → Jugar → Modo → Intro → Comenzar. La derrota solo ofrece «Volver al menú» | Derrota | Fricción en cada intento |
| U3 | La **historia con máquina de escribir** se muestra antes de cada partida | Intro | Retrasa cada partida |
| U4 | **El personaje se elige en dos sitios** (pantalla Personajes y cuadrícula dentro de Taller) | Lobby, Taller | Rutas duplicadas/confusas |
| U5 | **El sonido se cambia en dos sitios** («Sonido» en Taller y «Todo el sonido» en Ajustes) | Taller, Ajustes | Duplicidad |
| U6 | **El Taller mezcla cinco funciones en un scroll largo** (volver, personaje, ruleta, mejoras, colección, sonido) y repite en su texto un consejo de juego («Arrastra para moverte») | Taller | Es la pantalla más confusa |
| U7 | **Etiquetas de «volver» inconsistentes**: «← Volver», «← Volver al lobby», «Volver al menú», «Salir al lobby», «Saltar ▶ / ¡Comenzar!» | Todas | Navegación impredecible |
| U8 | **La pausa muestra la ayuda de teclado** o táctil como párrafo; no distingue Reiniciar de Abandonar | Pausa | Texto innecesario, acciones destructivas mezcladas |
| U9 | **El modo bloqueado** solo se explica con texto pequeño y 🔒 | Modo | Estado poco visible |
| U10 | **Tres fuentes y dos paletas**: Press Start 2P (HUD), Impact (títulos), monospace del sistema (cuerpo); marrones/naranja sin relación con el Puesto 7 | Global | Identidad débil (ERAZ-009) |
| U11 | **El HUD usa texto de 13 px y los iconos de armas 24 px** y sin nivel/cooldown legibles | Combate | Poco legible en móvil |
| U12 | **Cartas de nivel sin indicar el efecto por nivel ni la tecla 1-3** | Subida de nivel | La progresión de armas no se percibe (ERAZ-004) |
| U13 | No hay estado visible de **cooldown del dash en táctil** más allá de un número | HUD | — |

Lo que funciona y se conserva: botones ≥ 44 px (min-height ya aplicado), paneles con scroll táctil, pausa automática al ocultar la pestaña, atajos de teclado (1-3, Esc/P, F3, WASD).

## 3. Propuesta

### 3.1 Arquitectura de navegación
```
Principal ─┬─ JUGAR → Dificultad → (historia solo la 1.ª vez) → Partida
           ├─ Personaje (selección con detalle; hueco para Survivor Legacy)
           ├─ Misiones (con distintivo de «por reclamar»)
           ├─ Taller  [Mejoras | Ruleta | Colección]   (pestañas)
           └─ Ajustes [Audio | Gráficos | Controles | Accesibilidad]  (pestañas)
Pausa ─ Continuar · Ajustes · Reiniciar · Abandonar  (ambas destructivas con confirmación)
Resultado ─ resumen + Reintentar + Menú principal
```
Reglas: una sola ruta para cada función (personaje solo en «Personaje», sonido solo en «Ajustes»); «‹ Volver» siempre abajo-izquierda con el mismo texto; una única acción primaria por pantalla (amarillo advertencia); acciones destructivas en rojo y con confirmación que dice lo que se pierde.

### 3.2 Dirección visual
- **Identidad**: Puesto 7, estética militar industrial postapocalíptica. Verdes militares apagados, grises acero oscuros, **amarillo de advertencia** como único color de acento (con la franja «hazard» solo en cabeceras/primaria).
- **Evitar**: bordes dobles, sombras largas, degradados llamativos, emojis a modo de iconos finales, párrafos largos.
- **Tipografía**: Press Start 2P solo en títulos y números de HUD; cuerpo monoespaciado del sistema (sin dependencia nueva). Escala 11/13/15/18/24/34 px.
- **Iconografía**: un único set coherente (pendiente de elegir; no se incorporará ningún recurso externo sin revisar su licencia). Los emojis de la maqueta son marcadores.
- **Tokens** (ya en `css/tokens.css`): color (`--c-*`), tipografía (`--f-*`, `--fs-*`), espaciado (`--sp-*`), forma (`--r-*`, `--bw`), objetivo táctil (`--tap: 44px`), áreas seguras (`--safe-*`).

### 3.3 HUD de combate
Vida y XP arriba a la izquierda (apiladas), tiempo al centro, pausa arriba a la derecha; armas/pasivas abajo con nivel y cooldown; DASH con anillo de recarga solo en táctil, pastilla `DASH [Espacio]` en escritorio; avisos de jefe en amarillo. Todo respetando `--safe-*`.

### 3.4 Subida de nivel
Tres cartas iguales, con la tecla 1-3 visible y una línea con **el cambio concreto por nivel** (p. ej. «+12 alcance · +2° de apertura · más quemadura»), que además resuelve parte de ERAZ-004.

### 3.5 Componentes centralizados (propuesta técnica)
Un módulo `js/ui/` con `Panel`, `Button` (primario/secundario/peligro/fantasma), `Card` (seleccionada/bloqueada/cooldown), `Tabs`, `Modal` (confirmación), `StatRow`, `Bar`. La interfaz actual crea HTML por cadenas en cada función; las pantallas se migrarán una a una a estos componentes.

### 3.6 Preparación para Survivor Legacy
La pantalla de personaje reserva el panel «arma y objeto exclusivos» y Misiones puede filtrar por personaje. **No se implementa ninguna lógica de Legacy.**

## 4. Plan de implementación progresiva (propuesto)
1. **Hecho en esta entrega (base, sin cambiar el aspecto actual)**: `css/tokens.css`, diálogo de confirmación reutilizable, confirmación al abandonar, «Reintentar» en derrota (ver informe).
2. Pausa + Resultado (U1, U2, U8).
3. Lobby/Principal y Dificultad (U3, U7, U9).
4. Personaje + Taller por pestañas (U4, U5, U6).
5. Ajustes por pestañas y perfil móvil visible.
6. HUD y cartas de nivel (U11, U12, U13) y cambio de paleta global.
Cada paso: commit independiente, prueba automática de navegación (todas las rutas alcanzan «Volver», ningún panel desborda en 320×568, 375×812 y 812×375) y comprobación en teléfono por Rencorosito.

## 5. Decisiones (resueltas por el equipo)
- Abandonar conserva monedas legítimas sin bonificación de victoria; reiniciar descarta con confirmación.
- La historia se muestra la primera vez y se puede volver a ver desde el menú.
- Iconos: Lucide para navegación y controles, pixel art propio para armas y objetos.
- Tipografía: pixelada solo para títulos; legible para el resto.

(Texto original de la consulta:)
- ¿Aprobáis la arquitectura de navegación y la paleta (verde militar + amarillo advertencia)?
- ¿Abandonar una partida debe conceder las monedas ganadas hasta ese momento, o perderlas (como hoy)? La propuesta advierte de la pérdida; hay que decidirlo.
- ¿La historia solo la primera vez o siempre con «Saltar»?
- ¿Qué set de iconos preferís (dibujo propio en voxel/pixel, o uno con licencia comprobada)?
