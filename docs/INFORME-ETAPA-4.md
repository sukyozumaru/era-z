# Informe — Etapa 4: Mamut Rey, rendimiento y móvil

> Todas las pruebas de este informe son **automatizadas** (simulación en el navegador integrado de escritorio con ventana emulada). **No hay pruebas humanas ni en teléfono real todavía.**

## Mamut Rey (`js/13-mamut-rey.js`)
- Mega jefe del minuto 10 (`mamut` con `mg`). Máquina de estados `chase → wind → act → rec`.
- Ataques: embestida (línea roja con la trayectoria fijada antes de salir), pisotón (círculo + onda expansiva que se esquiva con dash o saliendo del radio), barrido de colmillos (sector frontal), rugido con invocación (respeta `LIM.enemies`).
- Fases por vida: 100–70 %, 70–35 %, 35–0 %. Cada cambio fuerza un rugido y acelera ritmo, acorta avisos y recuperaciones; la fase 3 lanza dos ondas.
- Ventana de recuperación tras cada ataque: el jefe está «expuesto» (recibe ×1,5), con marco parpadeante en la barra.
- Barra de vida propia con marcas en 70 % y 35 %, color por fase y etiqueta «¡EXPUESTO!».
- Música: capa de bombo a 148 bpm mientras vive; sfx propios (rugido, pisotón, carga, barrido).
- Reutiliza los avisos de suelo `FX k:'t'` (línea, círculo, sector nuevo) y añade `FX k:'w'` (onda).
- El contacto con el jefe pasa a ser un 35 % del daño continuo; el daño importante viene de los ataques anticipados.

### Pruebas
- 120 s simulados con un bot que esquiva: recorrió las 3 fases con la secuencia esperada de estados, sin excepciones; se vieron los 4 tipos de aviso.
- Daños medidos con enemigos aparte (jugador forzado dentro del ataque): embestida 50, pisotón 44, barrido 39 (con `dm` = 55).
- Máximo de enemigos durante el combate: 259 (< 320).
- Matar al jefe activa la victoria (`WON = 1`).

### Pendiente / riesgos
- **Valores no equilibrados con humanos**: daños, duración de avisos y 40 % del tiempo expuesto son estimaciones mías.
- El jefe tiene muchísima vida (18 000 × dificultad); no se tocó el balance.
- La embestida no atraviesa limpiamente todos los obstáculos del mapa.

## Rendimiento (medido, escena de prueba con 230 enemigos, mismas condiciones)
| | llamadas de dibujo | triángulos |
|---|---|---|
| Antes (Etapa 1) | 2024 | 544 k |
| Ahora, calidad media (defecto escritorio) | 1104 | 536 k |
| Ahora, perfil «Bajo consumo» (140 enemigos máx.) | 667 | 312 k |
- Rigs de enemigos fusionados por pieza estática y por extremidad (≈ 14 → ≈ 8 mallas por enemigo); LOD lejano sin cambios.
- Sombras de enemigos en un solo `InstancedMesh`.
- Perfil gráfico: Automático / Alto / Bajo consumo. En táctil el primer arranque (sin guardado) usa calidad, distancia y partículas bajas.
- Sin cambios aparentes en el aspecto de los modelos (captura comparada); no se midió FPS real porque el navegador de pruebas no tiene GPU representativa.
- **Siguientes pasos posibles**: instanciar el LOD lejano, fusionar obstáculos del mapa (~340 mallas), compartir geometrías de gemas/efectos.

## Compatibilidad móvil
- Meta viewport sin zoom, áreas seguras laterales y verticales, sin rebote ni menú contextual, bloqueo de gestos de pellizco y de scroll fuera de menús.
- Paneles `border-box`: caben y desplazan con el dedo en 375×812, 812×375 y 320×568 (comprobado por medición automática; en 320 sin desbordes horizontales).
- Joystick con un único puntero (un segundo dedo ya no lo reinicia); DASH solo táctil; pista de pausa según el tipo de entrada.
- Pausa automática al ocultar la pestaña o al `pagehide`.
- **No verificable aquí**: áreas seguras reales (notch), comportamiento de iOS Safari, rendimiento térmico, vibración y respuesta táctil real. Son los puntos clave para la prueba humana de Rencorosito.

## GitHub (sin publicar nada)
- No se creó ni modificó ningún remoto; el repositorio local no tiene `remote`.
- Añadidos `README.md`, `.nojekyll`, `docs/TERCEROS.md`; rutas relativas verificadas (solo se cargan Three.js y la fuente desde CDN por HTTPS).
- `.claude/` ya no se versiona.
- La licencia del proyecto queda como decisión vuestra.

## Survivor Legacy
Registrado en `docs/SURVIVOR-LEGACY.md` como aprobado y sin implementar; solo contiene lo indicado (armas y objetos exclusivos por personaje, desbloqueo por misiones y logros) y deja explícito lo no definido.

## Commits
`8cbc68f` Mamut Rey · `1124fdf` rendimiento · `7464acc` móvil · `2c2e1bf` Pages/README · `f8fcfdd` Survivor Legacy · `d02f425` limpieza de repo
