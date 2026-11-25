# Informe final — implementación UI/UX (v0.1.0-alpha.2)

> **Sin push, sin tag, sin ramas, sin publicar.** Todo en `main` local.
> **Pruebas automatizadas** (navegador integrado, ventanas emuladas, eventos sintéticos) frente a **pruebas humanas** (Playtest #001; el #002 está pendiente). Nada de lo que sigue está validado en teléfono real.

## Qué se implementó (en el orden pedido)
1. **HUD de combate** (`js/19-hud.js`): vida con cifras, XP con nivel, tiempo, bajas y monedas con iconos, tira de armas/pasivas con nivel, botón de pausa y DASH con anillo de recarga (táctil) o pastilla `DASH · Espacio` (escritorio). Texto de 11–12 px (antes 7 px). Lee de `UI.ctx.players`.
2. **Pausa**: Continuar · Ajustes · Reiniciar · Abandonar, con resumen de la partida y confirmaciones.
3. **Cartas de subida de nivel y cofres**: tres tarjetas iguales con tecla 1–3 visible en escritorio y **línea con el cambio concreto por nivel de cada arma** (p. ej. «+12 de alcance · +2° de apertura · más daño y quemadura»).
4. **Menú principal y navegación**: router con pila (`UI.go/back/home`), «Volver» único, `Esc` retrocede.
5. **Personaje y dificultad**: lista con estados de selección, bloqueo y condición de desbloqueo.
6. **Ajustes**: pestañas Audio, Gráficos, Controles, Accesibilidad (+ vibración).
7. **Victoria/derrota/abandono**: resumen, Reintentar a un toque y Menú.
Además: historia automática solo la primera vez + «Ver historia» en el menú; Taller sin personaje ni sonido duplicados.

## Decisiones del equipo aplicadas
- Abandonar **conserva las monedas legítimas, sin bonificación de victoria**, sin marcar el modo completado.
- Reiniciar **descarta la partida** con confirmación.
- Historia la primera vez; iconos Lucide para navegación y controles; iconos pixel art propios para armas/objetos; tipografía pixelada solo en títulos y cifras de HUD, sistema legible para el resto.
- Cooperativo: **solo preparación de arquitectura** (`docs/ARQUITECTURA-UI.md`); no hay red ni dependencias nuevas.
- **Balance sin tocar** (auditoría intacta para tras el Playtest #002).

## Pruebas automatizadas
| Prueba | Resultado |
|---|---|
| Recorrido de 16 pantallas/estados en 5 tamaños (320×568, 375×812, 812×375, 768×1024, escritorio): cabe en el viewport, sin desbordamiento horizontal, botones ≥ 44 px | **0 problemas** (`docs/capturas/qa-pantallas.js`) |
| Abandono: monedas = las que mostraba el aviso (7 = 7), modo no marcado como completado, sin duplicar al llamar a `endRun`/`die`/`abandonRun` varias veces | Correcto |
| Abandonar tras derrotar al jefe final cuenta como victoria legítima (+100 de bonificación) | Correcto |
| Morir da las mismas monedas que abandonar (sin bonificación) | Correcto |
| Reiniciar: sin monedas ni partida contabilizada | Correcto |
| Esc: atrás en menús, desde ajustes en pausa vuelve a pausa, cierra el diálogo sin reanudar | Correcto tras corregir un fallo (Esc cerraba el diálogo y reanudaba) |
| Multitouch con los nuevos botones: joystick con dedo 1 + dash con dedo 2 en la dirección del movimiento (0,54 rad), anillo de recarga, pausa por botón | Correcto |
| Teclado: Tab recorre los botones con foco visible; 1–3 elige carta; Enter reintenta | Correcto |
| Simulación de 640 s con todas las armas (lanzallamas nv.5) y jefe | Sin excepciones ni NaN; máx. 927 llamadas de dibujo |

## Capturas comparativas (hojas de contacto, 12 pantallas cada una)
En `docs/capturas/alpha2/`: `1-antes-movil-horizontal` / `2-despues-movil-horizontal`, `3-antes-movil-vertical` / `4-despues-movil-vertical`, `5-antes-escritorio` / `6-despues-escritorio`, y `7-despues-cartas-nivel-escritorio` a tamaño real. Se generan con `docs/capturas/hoja-contacto.html?vp=desktop|land|port&v=new|old&base=…`. Son reducciones (el panel de pruebas tiene ~800 px de ancho): sirven para comparar estructura y estilo, no para leer texto pequeño.

## Métricas de legibilidad y navegación (antes → después)
| Métrica | Antes | Después |
|---|---|---|
| Tamaño del texto de cuerpo | 8–9 px (Press Start 2P) | 13–15 px (sistema) |
| Texto del HUD | 7 px | 11–12 px |
| Etiquetas distintas de «volver» | 5 | 1 |
| Pasos para reintentar tras morir | 5 | 1 |
| Rutas duplicadas (personaje, sonido) | 2 | 0 |
| Confirmación al reiniciar/abandonar | no | sí, con lo que se conserva o pierde |

## Problemas y límites conocidos
1. **Sin validación humana.** Especialmente: legibilidad real en el teléfono de Rencorosito, áreas seguras con notch, iOS Safari, y si el HUD estorba en pantallas pequeñas (con cifras de vida muy altas el texto choca con el reloj; no ocurre con valores normales).
2. **Taller y Misiones solo restilizados**, sin la reorganización por pestañas propuesta (no estaban en las prioridades).
3. La **barra de vida del Mamut Rey, los avisos y los números de daño siguen dibujándose en canvas** con la fuente pixelada.
4. Se retiró el tema claro (el juego pasa a un único tema oscuro militar).
5. **Caché en GitHub Pages**: añadido `?v=0.1.0-alpha.2` a scripts y estilos; hay que cambiarlo en cada publicación (ver README).
6. La fuente Press Start 2P sigue cargándose de Google Fonts (como antes).
7. Los iconos de armas y objetos siguen siendo emoji convertidos a pixel art en ejecución; un set propio dibujado a mano queda pendiente.

## Commits (desde `7fba44f`)
`ff853cf` iconos Lucide · `a25f77c` UI/UX parte 1 (sistema visual, HUD, router y pantallas) · `7283f6a` ajustes de vibración/historia/Esc · `de700fc` herramientas de QA · `4400e86` capturas comparativas · (docs de arquitectura) · (versionado de recursos).
Detalle: `git log 7fba44f..HEAD --oneline`.

## Para Codex
- Orden de carga de scripts relevante (ver `index.html`); `title()` se invoca al final de `js/20-pantallas.js`.
- Guardados: mismo `arcane1`; campos nuevos con valor por defecto.
- Antes de publicar: cambiar `?v=` si hubiera más cambios y revisar `docs/TERCEROS.md` (Lucide ISC incluido).
- Nada publicado desde aquí.
