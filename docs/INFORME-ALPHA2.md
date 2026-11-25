# Informe — v0.1.0-alpha.2 (en desarrollo): Mobile, Combat & UX Overhaul

> **Sin push, sin tag, sin publicar.** Todo está en commits locales de `main`.
> **Pruebas automatizadas** = simulación y medición en el navegador integrado (escritorio, ventanas emuladas). **Pruebas humanas** = Playtest #001 de Rencorosito (`docs/PLAYTEST-001.md`). No se ha hecho aún el segundo playtest humano; ningún punto de este informe se da por validado en teléfono real.

## Estado por ticket
| Ticket | Estado | Comentario |
|---|---|---|
| ERAZ-001 Multitouch | Implementado, **automatizado** | Pendiente de confirmar en teléfono |
| ERAZ-002/003 Lanzallamas | Rediseñado, **automatizado** | Pendiente de opinión humana (aspecto y sensación) |
| ERAZ-004/005 Progresión y balance | **Auditoría + propuesta; sin aplicar** | Se corrigieron solo defectos (framerate, tunneling) |
| ERAZ-006–009 UI/UX | **Auditoría + propuesta + base técnica** | La interfaz actual no se ha reemplazado; espera aprobación |

## ERAZ-001 — Multitouch
- Cada puntero se gestiona por `pointerId`: el primer toque fuera de botones y paneles es el joystick; los toques en DASH y Pausa actúan en su propio `pointerdown` (ya no dependen de `click`, que los navegadores móviles pueden suprimir mientras otro dedo está pulsado).
- `pointerup`, `pointercancel` y `lostpointercapture` solo cierran el joystick si pertenecen a su dedo; ratón nunca crea joystick; controles de PC intactos.
- Dash en la dirección del movimiento (joystick o teclado); si estás quieto, en la última dirección de movimiento; si nunca te moviste, hacia donde miras. El movimiento continúa tras el dash.
- Prueba (eventos sintéticos): joystick con dedo 1; dash con dedo 2 → dirección = ángulo del joystick (0,54 rad), joystick sigue activo, movimiento continúa (+56/+33 px por 10 pasos igual que antes); un tercer dedo no secuestra el joystick; `pointercancel` de otro id y de un dedo de dash no lo afectan; `lostpointercapture` propio lo cierra; ratón no crea joystick; en PC, A + Espacio dispara el dash a 3,14 rad.
- **Limitación**: no se probó con dedos reales ni con iOS Safari.

## ERAZ-002/003 — Lanzallamas
Ver `docs/AUDITORIA-LANZALLAMAS.md`. Resumen: el cono visible no coincidía con el daño, el retroceso sacaba al objetivo del alcance y escalaba solo +12 % de nv.1 a nv.5. Ahora: ticks fijos de 0,1 s (22,2 DPS idénticos a 20/30/60 FPS), cono = efecto, sin retroceso, quemadura residual, llamas en un `InstancedMesh` con pool fijo (60 partículas en bajo consumo). DPS contra un objetivo nv.1→nv.5: 14,9→30,7.
Capturas: `docs/capturas/lanzallamas-anterior.jpg` (cono sólido, «10» por impacto) y `docs/capturas/lanzallamas-nuevo.jpg` (llamas voxel y números agregados).

## ERAZ-004/005 — Auditoría de armas
Ver `docs/AUDITORIA-BALANCE.md`. Correcciones de defectos aplicadas (no son balance):
- Cadencia independiente del framerate (pistola, Minigun, Lanza): ratios 60 FPS/20 FPS pasan de 1,06/1,20/1,21 a 1,00/1,00/0,98.
- Colisión de balas barrida: el **Rifle de precisión pasó de 0 a 85 de daño por segundo a 20 FPS** (a 60 FPS: 95). En teléfonos con pocos FPS el arma no funcionaba.
- Lanzallamas detecta jefes por el borde del cuerpo.
Propuesta de balance **sin aplicar**, con preguntas para el playtest #002.

## ERAZ-006–009 — UI/UX
Ver `docs/PROPUESTA-UI-UX.md` (13 problemas con evidencia, arquitectura de navegación, dirección visual, plan por fases y decisiones que necesito) y la maqueta `docs/propuesta-ui/mockup.html` (capturas `docs/capturas/propuesta-ui-*.jpg`).
Base técnica entregada (sin cambiar el aspecto actual): `css/tokens.css`, `css/components.css`, `js/17-ui.js` (`confirmDlg`), **Reiniciar y Abandonar con confirmación que muestra las monedas que se pierden**, y **«Reintentar»** en derrota/victoria (Enter lo activa). Captura: `docs/capturas/confirmacion-abandonar.jpg`.

## Métricas
| Métrica | Valor |
|---|---|
| Simulación de 640 s con todas las armas (lanzallamas nv.5), jefe incluido | sin excepciones, sin NaN |
| Llamadas de dibujo máximas en esa simulación (perfil por defecto) | 666 |
| Flujos de UI probados (Reiniciar, Abandonar, cancelar, Esc, Reintentar, Enter) | todos correctos |

## Problemas pendientes
1. Playtest humano #002 (dash con joystick, lanzallamas, armas por nivel, menús).
2. Decisiones de UI/UX (lista al final de `PROPUESTA-UI-UX.md`), en especial si abandonar concede monedas.
3. Balance: propuesta sin aplicar; posible exceso del lanzallamas en grupos muy apretados; Onda de choque y Lanza (nv.3+) con defectos de diseño documentados.
4. La interfaz sigue con la paleta marrón/naranja; el cambio a verde militar es parte de la fase de implementación aprobada.
5. Registro de dispositivo del Playtest #001 sin completar.

## Integración con Codex (entrega, sin publicar)
- Rama: `main`, commits independientes (`git log ceffcb5..HEAD`):
  `88a4108` PLAYTEST-001 · `5ab6052` multitouch · `1623464` lanzallamas · `c99c5ea` limpieza · `d17a8d6` fixes framerate/tunneling · `c7fe5b1` auditorías · `4aafdb3` propuesta UI · `006f669` base UI y confirmaciones.
- Archivos nuevos: `js/16-lanzallamas.js`, `js/17-ui.js`, `css/tokens.css`, `css/components.css`, `docs/*`. **El orden de carga de los scripts en `index.html` importa.**
- **Guardados**: `localStorage['arcane1']` sin cambios de formato; solo se añadió `M.set.pf` (perfil gráfico) con valor por defecto al cargar.
- **Enlace del juego**: ninguna ruta ni nombre de archivo de entrada cambió (`index.html` en la raíz, rutas relativas).
- Pendiente de Codex/Gabo: revisar, aprobar, `git push` y publicar. No se creó remoto, rama ni tag.
- Prueba local rápida: `python3 -m http.server 8000` y abrir `http://localhost:8000/?debug=1`.
