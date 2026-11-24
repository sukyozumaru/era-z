# Era Z — Plan técnico: Combat Overhaul

Estado: borrador v1. Los números de balance son hipótesis hasta que haya pruebas humanas.

## 1. Estado actual (análisis)

- Un solo `index.html` (~100 KB) con CSS y ~470 líneas de JS minificado a mano. Variables globales de 1–2 letras (`P`, `E`, `B`, `S`, `M`, `T`…).
- Render: Three.js r128 desde CDN (3D voxel) + canvas 2D superpuesto para HUD. Audio procedural con WebAudio.
- Guardado: `localStorage['arcane1']` (objeto `M`). **Esta clave no cambia** para no romper partidas guardadas. Cualquier campo nuevo se añade con valores por defecto (`Object.assign`).
- Generación de enemigos: `spawn()` es el único punto que crea enemigos normales (oleadas en `step`, invocaciones de jefe y portales en `world`). Jefes se crean aparte con `bossSpawn()`. Tope global: 320 en `spawn()`; las oleadas normales se detienen antes, en 230.
- Entidades sin tope: gemas de XP (`G`), proyectiles enemigos (`EB`), efectos (`FX`). Partículas ya tienen tope (`PN=300`).
- Entrada: teclado (WASD/flechas/Espacio/Shift/Esc), joystick virtual por `pointerdown` de **cualquier** tipo (el mouse también mueve al personaje), botones DASH y pausa visibles también en escritorio.
- Vibración: `navigator.vibrate` se llama sin comprobar si es un dispositivo táctil ni si hubo gesto del usuario (aviso en consola de escritorio).
- Ajustes existentes: resolución, calidad de modelos, distancia, partículas (3 niveles), temblor de cámara (sí/no), cámara, volumen.
- Jefes: `bossSpawn()` reutiliza modelos de enemigos escalados, sin ataques propios; invocan 6 enemigos cada 7 s.

## 2. Principios de trabajo

1. Commits pequeños y reversibles (un tema por commit, mensaje en español).
2. Refactor sin cambios de comportamiento antes de tocar mecánicas.
3. Cada etapa termina con informe: cambios, pruebas, pendientes, commits.
4. Resultados **automatizados** (bot, semillas) y **humanos** se reportan por separado y nunca se mezclan.
5. Ningún recurso externo sin licencia verificada. Todo el arte actual es procedural (código); el audio también.
6. Fuera de alcance: multijugador, monetización, biomas nuevos, más armas/personajes/objetos.

## 3. Etapas

### Etapa 1 — Estabilidad y estructura
- Separar `index.html` en `css/style.css` y `js/*.js` (cortes contiguos del código original, mismo orden de carga → mismo comportamiento).
- Presupuesto de entidades centralizado (enemigos, gemas, proyectiles enemigos, efectos).
- Diagnóstico (`F3` o `?debug=1`): FPS, frame time medio y p95, entidades, proyectiles, partículas, draw calls.
- Vibración solo en táctil y tras gesto del usuario.
- Separar entrada táctil y de escritorio (joystick solo táctil/lápiz; DASH grande solo táctil).
- Renombrar a **Era Z** (título, pantalla de inicio). Se conserva Puesto 7, 2089 y anomalías temporales.

### Etapa 2 — Game feel
- Opciones: "Reducir efectos" y "Reducir movimiento de cámara" (además de las existentes).
- Disparos: fogonazo, trazadora, casquillos mínimos. Impactos: chispas por material, números de daño con crítico distinto.
- Críticos: destello breve + sonido propio. Muertes: desmembrado ligero ya existente, mejor feedback de sonido.
- Dash: estela, invulnerabilidad visible, sonido.
- Explosiones y retroceso: onda visual, sacudida escalada por distancia y ajustable.

### Etapa 3 — Enemigos
- Escupidor y Hinchado con silueta propia (rig nuevo con piezas distintas, no recolor).
- Ataques con anticipación visible (telegraph en el suelo + pose de carga) antes de disparar o explotar.
- Separación entre enemigos con rejilla espacial para evitar acumulaciones y reducir coste O(n²).

### Etapa 4 — Jefe: Mamut Rey
- Máquina de estados: acecho → telegrafía → ataque → recuperación.
- Ataques: embestida anticipada, pisotón con onda expansiva, invocación de enemigos.
- Fases por % de vida (100–66, 66–33, 33–0) que cambian frecuencia y combinación.
- Ventanas de recuperación en las que recibe más daño.
- Indicadores en el suelo y barra de vida propia con marcas de fase.

### Etapa 5 — Balance y pruebas
- PRNG con semilla (`?seed=`) para spawns, drops y cartas en modo prueba.
- Registro por partida: duración, XP total, nivel, daño por arma, daño recibido, bajas.
- Bot de prueba con política fija y comparación de builds con mismas semillas.
- Informe separado: "automatizado" vs "humano". Balance solo se cambia con datos.

### Etapa 6 — Identidad
- Revisión de textos y nombre en todo el juego, favicon y metadatos.
- Documento de licencias (CDN: Three.js MIT; fuente Press Start 2P OFL).

## 4. Riesgos
- Partir un JS con globales compartidas: mitigado usando scripts clásicos en el mismo orden.
- Rendimiento en móvil: cualquier efecto nuevo respeta el nivel de partículas y "Reducir efectos".
- Guardados: no se renombra ni se elimina ningún campo de `M`.
