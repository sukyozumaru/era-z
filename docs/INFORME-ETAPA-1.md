# Informe — Etapa 1 (Estabilidad) y arranque de Etapa 2 (Game feel)

## Cambios
- Estructura: `index.html` + `css/style.css` + `js/00…12-*.js`. Cortes contiguos del código original, mismo orden de carga. El original queda en `docs/archive/`.
- Corrección: el `var R3,CAM` dependía de hoisting y se movió a `01-core.js`.
- Presupuestos (`js/00-config.js`): enemigos 320 (oleadas 230), gemas 400 (el XP sobrante se conserva), ácido 48, fx 90, cuerpos 150.
- Diagnóstico: F3 o `?debug=1`; `ERAZ_DIAG.snapshot()` y `ERAZ_DIAG.history` por consola.
- Entrada: joystick solo táctil/lápiz; DASH grande solo táctil; indicador `DASH [Espacio]` en escritorio; vibración solo en táctil y tras gesto.
- Identidad: título y pantalla de inicio "Era Z · Puesto 7 · 2089".
- Ajustes: "Reducir efectos" y "Movimiento de cámara" (Normal/Reducido/Sin temblor). Migración del ajuste antiguo sin perder partidas.
- Game feel: fogonazo, destello y número grande en críticos, estela del dash, sacudida al caer un jefe.
- Bug real corregido: los rayos de la Tormenta eléctrica nunca se veían (altitud NaN; 499 avisos de Three.js).

## Pruebas (todas automatizadas; ninguna humana)
- Carga sin errores tras la separación; simulación de 11 min sin excepciones.
- Migración de un guardado antiguo (oro conservado, `sh:0` → `cm:2`).
- Opciones nuevas cambian y se guardan; la sacudida se anula con "Sin temblor".
- Entrada: mouse no crea joystick; touch sí; teclado vuelve a modo escritorio.
- Diagnóstico mide datos reales.

## Hallazgo de rendimiento (medido, entorno de prueba sin GPU dedicada)
Con 230 enemigos: ~1250 draw calls, ~670 000 triángulos, 31 FPS en el navegador integrado. No es una medida representativa del hardware de los jugadores, pero indica que el coste por enemigo es alto. Es el objetivo de la Etapa 3 (LOD/instanciado).

## Pendiente
- Anticipación de ataques, mejores explosiones y retroceso (Etapa 2 restante).
- Enemigos, jefe, semillas y registro de partida (Etapas 3–5).
- Pruebas humanas de sensación y de dificultad.
