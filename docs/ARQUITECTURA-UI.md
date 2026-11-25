# Arquitectura de la interfaz (alpha.2)

## Piezas
| Archivo | Responsabilidad |
|---|---|
| `css/tokens.css` | Variables de diseño: color, tipografía, espaciado, forma, objetivo táctil (`--tap: 44px`), áreas seguras |
| `css/style.css` | Sistema visual (panel, botones, tarjetas, pestañas, barras, HUD). Solo usa tokens |
| `css/components.css` | Diálogo de confirmación |
| `js/18-iconos.js` | `icon('nombre', tamaño)`: SVG de **Lucide** (ISC) incrustados. Iconos de armas/objetos: propios (pixel art) |
| `js/17-ui.js` | `confirmDlg({...})`, `coinsAtStake()` |
| `js/19-hud.js` | HUD de combate en DOM (vida, XP, tiempo, bajas, monedas, armas, DASH, pausa) |
| `js/20-pantallas.js` | Router `UI` y pantallas |

## Router
`UI.def(nombre, render, {state})` registra; `UI.go(nombre, params)` apila la actual; `UI.back()` vuelve; `UI.home()` va al menú principal; `UI.refresh()` repinta. `Esc` retrocede en menús; las pantallas no llaman a otras directamente salvo mediante el router, así que **«Volver» es siempre el mismo comportamiento**.

Pantallas: `titulo`, `principal`, `dificultad`, `historia`, `personajes`, `ajustes` (pestañas Audio/Gráficos/Controles/Accesibilidad), `misiones`, `taller` (estas dos mantienen su contenido anterior, restilizado), `pausa`, `resultado` (victoria, derrota, abandono). Cartas de nivel y cofres son superposiciones de partida (`levelUp()`, `pick3()`).

## Cooperativo y modos futuros (solo preparación; no hay red)
Decisión del equipo: cooperativo de 2 jugadores con salas privadas, luego 4; PvP y PvPvE como expansiones. Lo hecho para no cerrar esa puerta:
- `UI.ctx = {mode:'solo', players:[{id:'local'}], pauseFreezes:true}`: el HUD y la pausa se escriben contra esta descripción de sesión, no contra «el jugador».
- Nuevas pantallas (sala privada, lista de jugadores, selección por jugador) se añaden con `UI.def` sin tocar el resto.
- La pausa distingue `pauseFreezes`; en cooperativo la pausa no debería congelar la simulación.
- Las pantallas de resultado leen los datos de la partida desde un único sitio (`gain`, `K`, `T`, `P.lvl`, `RIn`), fáciles de sustituir por un resumen por jugador.

### Dependencias de un solo jugador que siguen en el motor (a resolver antes de implementar red)
1. Estado global singular: `P` (jugador), `E`, `B`, `EB`, `G`, `FX`, `K`, `T`, `BG`… y `start()` crea un único jugador.
2. Entrada local global: `jx`, `jy`, `keys`, `jo` y el `dash()` leen del dispositivo local.
3. `step(dt)` mezcla simulación y efectos locales (HUD, `sfx`, `HF`, `SHK`).
4. `endRun`/`M` (monedas, estadísticas, desbloqueos) asumen un único perfil por partida.
5. Aleatoriedad con `Math.random()` (sin semilla): la Etapa 5 de semillas es requisito para cualquier modelo determinista.
6. Cámara y HUD siguen a `P`.
Nada de esto se ha tocado en esta entrega.

## Decisiones aplicadas en esta entrega
- Abandonar conserva las monedas ganadas **sin bonificación de victoria** y no marca el modo como completado; `RUN_DONE` impide liquidar dos veces; si el jefe final ya cayó, abandonar cuenta como victoria legítima.
- Reiniciar descarta la partida, con confirmación y sin monedas.
- La historia se muestra automáticamente la primera vez (`M.seen`); quien ya había jugado (`M.st.runs > 0`) no la ve de nuevo; siempre disponible desde «Ver historia».
- Tipografía: Press Start 2P solo en títulos y cifras del HUD; texto, botones y estadísticas en la fuente del sistema.
- Iconos: Lucide para navegación y controles; iconos pixel art propios para armas y objetos.

## Compatibilidad de guardados
`localStorage['arcane1']` conserva su formato. Campos nuevos con valor por defecto al cargar: `M.set.pf`, `M.set.rf`, `M.set.cm`, `M.set.vib`, `M.seen`.
