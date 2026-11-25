# v0.2.0 · Etapa 1 — Combat Analytics y línea base de Alpha.2

> **Todas las cifras de este informe son automatizadas**: simulador con bot (`docs/herramientas/simulador.js`), sin render, `dt = 1/30 s`, perfil limpio (sin mejoras del Taller ni objetos permanentes). El bot es un sustituto de un jugador competente, **no** una prueba humana. La línea base se midió con el balance de Alpha.2 sin tocar (solo se añadió instrumentación).
> «Normal» = modo **Historia** (la dificultad de referencia; el juego aún no tiene un modo llamado «Normal»).

## 0. Sincronización
`main` local = `origin/main` (Alpha.2 publicada). El único cambio de Codex era la línea de créditos del README (`cd761f9`, ya fusionada). No se sobrescribió nada. Sin push.

## 1. Qué se ha construido
| Pieza | Dónde | Qué hace |
|---|---|---|
| Semilla por partida | `js/21-estadisticas.js` | PRNG `mulberry32` sembrado en cada `start()`. `?seed=N` la fija. En el simulador la partida es **exactamente reproducible** (verificado: misma semilla → mismas bajas, XP y daño por arma). En partidas humanas la semilla se registra, pero el render y el `dt` variable impiden la repetición exacta. |
| Estadísticas de combate | `js/21-estadisticas.js` + ganchos en `hit()`, armas, daño recibido, subidas de nivel, cofres, ruleta, reliquias, orbes, obeliscos y portales | Semilla, personaje y modo; nivel, XP, bajas, daño hecho y recibido **por minuto**; daño total, efectivo (sin sobrante) y DPS por arma; bajas por arma; objetivos por activación; daño y bajas por categoría (zombi, bestia, especial, élite, jefe, jefe final); daño recibido por fuente; causa y minuto de muerte; TTK de élites y jefes; elecciones con opciones ofrecidas; recompensas; monedas; muestras cada 10 s de entidades, partículas, draw calls, FPS y p95. |
| Persistencia y exportación | `localStorage['erazStats']` (últimas 30 partidas humanas; **no toca `arcane1`**) | Botón «Exportar estadísticas» (JSON) en la pantalla de resultado; consola: `ERAZ_STATS.last()`, `.all()`, `.exportCSV()`, `.download('csv')`. |
| Comparador | `docs/herramientas/comparar.html` | Tabla de partidas guardadas o exportadas (local, sin red). |
| Simulador | `docs/herramientas/simulador.js` (no se carga en el juego) | `SIM.run({seed, ch, mode, policy, maxT, dt, render})`. Políticas: `equilibrada`, `aleatoria`, `fuego`, `electricidad`, `cazajefes`, `resistencia`. Bot: evalúa 16 direcciones con predicción, esquiva avisos de suelo, ácido, ondas y hinchados, recoge gemas, orbes y cofres, y usa dash. Restaura el guardado al terminar. |

Sin telemetría externa: nada sale del navegador.

## 2. Línea base Alpha.2 (Recluta · Historia · política equilibrada · 10 semillas)
Semillas 11, 22, 33, 44, 55, 66, 77, 88, 99, 111. Límite de 20 min.

| Resultado | Valor |
|---|---|
| Sobreviven hasta el minuto 10 | **10 / 10** |
| Derrotan al Mamut Rey | 1 / 10 (semilla 33, a los 13:29) |
| Tiempo de la partida (mediana · mín–máx) | 10:52 · 10:29–13:29 |
| Causa de las 9 muertes | 7 por ataques del Mamut Rey (onda 5, embestida 1, pisotón 1) y 2 por contacto durante la fase del jefe |
| Nivel final medio | 21,3 |
| **Daño recibido antes del minuto 10** | **51 de media** (vida inicial 100) |

### Por minuto (media de las 10 partidas)
| Min | Nivel | Bajas acumuladas | Enemigos vivos | Daño recibido acumulado | Vida | DPS efectivo¹ | XP/min¹ | Bajas/min¹ |
|---|---|---|---|---|---|---|---|---|
| 1 | 5,6 | 165 | 152 | 0,3 | 100 | 38 | 98 | 176 |
| 2 | 10,1 | 679 | 231 | 2 | 106 | 196 | 440 | 562 |
| 3 | 12,7 | 1127 | 233 | 9 | 107 | 291 | 751 | 533 |
| 4 | 14,3 | 1500 | 234 | 17 | 101 | 363 | 757 | 448 |
| 5 | 15,8 | 1896 | 235 | 29 | 98 | 530 | 983 | 457 |
| 6 | 17,3 | 2238 | 235 | 39 | 99 | 855 | 1774 | 463 |
| 7 | 18,0 | 2554 | 237 | 41 | 111 | 845 | 1139 | 395 |
| 8 | 19,0 | 2849 | 239 | 43 | 112 | 1125 | 1679 | 419 |
| 9 | 19,6 | 3114 | 242 | 49 | 113 | 1040 | 1306 | 350 |
| 10 | 20,4 | 3394 | 239 | 51 | 116 | 1195 | 1271 | 353 |
¹ Media de 3 semillas (11, 22, 33) del mismo escenario. El DPS efectivo excluye el daño sobrante (overkill).

### Daño causado por categoría de enemigo
Bestias 47,4 % · zombis 22,7 % · élites 14,6 % · especiales 13,8 % · jefe del minuto 5 0,8 % · Mamut Rey 0,8 %.

### Daño recibido por fuente (media por partida, incluida la fase del jefe)
Mamut: onda 182, embestida 40, pisotón 7 · ácido de escupidor 21 · contacto (raptor 8, smilodon 8, b 4, tricerátops 4, resto ≤ 2) · explosión de hinchado 5.
**Antes del minuto 10 solo el ácido y las explosiones de los hinchados hacen daño apreciable.**

### Élites, jefes y recompensas
- Élites: **115,6 por partida** (6 % de las apariciones desde el minuto 4). TTK medio desde el primer golpe: 37,7 s.
- Jefe del minuto 5 (smilodon): murió en 6 de 10 partidas. TTK desde el primer golpe: mediana ~170 s (25–275 s). Suele seguir vivo durante minutos mientras llega lo siguiente.
- Mamut Rey: TTK de 205,6 s en la única victoria.
- Recompensas por partida: 3–9 cofres, 0–2 ruletas gigantes, 0–1 reliquias, 0–3 orbes.

## 3. Comparativa de armas (aislada, nivel 1 / 3 / 5)
Arma sola, `P.dmg = 10`, enemigos inmóviles y sin retroceso, 10 s. DPS contra **un común a 140 px · grupo de 20 a 140 px · élite a 160 px · jefe a 200 px**.

| Arma | Nivel 1 | Nivel 3 | Nivel 5 |
|---|---|---|---|
| Pistola (base) | 13 / 13 / 13 / 13 | = | = |
| Escopeta | 10 / 23 / 10 / 14 | 17 / 38 / 17 / 22 | 14 / 54 / 20 / 37 |
| Granadas | 11 / 165 / 11 / 11 | 11 / 187 / 11 / 11 | 11 / 220 / 11 / 11 |
| Tesla | 11 / 34 / 11 / 11 | 11 / 56 / 11 / 11 | 11 / 78 / 11 / 11 |
| Minigun | 28 / 28 / 28 / 28 | 39 / 40 / 39 / 39 | 50 / 51 / 50 / 50 |
| Molotov | 13 / 94 / 13 / 13 | 20 / 222 / 20 / 20 | 27 / 403 / 27 / 27 |
| Lanzallamas | 0 / 78 / 0 / 0 | 36 / 320 / 0 / 0 | 45 / 680 / 45 / 0 |
| Rifle | 20 / 120 / 20 / 20 | 30 / 180 / 30 / 30 | 40 / 240 / 40 / 40 |
| Tormenta | 54 en todos | 108 en todos | 162 en todos |
| Onda de choque | 0 / 38 / 0 / 0 | 8 / 117 / 0 / 0 | 10 / 194 / 0 / 0 |
| Lanza | 16 / 94 / 16 / 16 | 41 / 265 / 41 / 41 | 50 / 328 / 50 / 50 |
Los ceros del Lanzallamas y la Onda de choque son de alcance (110–158 px y 150 px), no de daño.

**Peso real en partida** (línea base; cuota media del daño cuando el arma estaba entre las 5 primeras): Rifle 34 % (en 5 de 10 partidas) · Lanza 26 % (6/10) · Tormenta 25 % (5/10) · Molotov 15 % · Tesla 15 % · Minigun 12 % · Lanzallamas 11 % · Granadas 11 % · Escopeta 10 %.
**Explosiones de hinchados que matan a otros enemigos: 14 % de todo el daño, en 10 de 10 partidas.**

## 4. Builds, personajes y dificultades (semillas 11 y 22)
| Prueba | Resultado |
|---|---|
| Políticas fuego · electricidad · cazajefes · resistencia · **aleatoria** | **Las 10 partidas llegan al minuto 10.** Diferencias solo en la fase del jefe: 3 sobreviven hasta el límite de 20 min sin matar al Mamut (fuego, resistencia, aleatoria) y el resto muere ante él entre 10:04 y 13:25. |
| Médica · Francotirador · Demoledor · Cavernícola (semilla 11) | Todos llegan al minuto 10. Francotirador vence en 12:55 y Demoledor en 17:59. Médica y Cavernícola mueren en la fase del jefe. |
| Difícil | 2/2 llegan al minuto 10 y mueren ante el Mamut (10:04 y 10:58). |
| Hardcore | 1/2 llega al minuto 10. La semilla 11 muere a las 6:39 por contacto con el smilodon, la **única muerte antes del jefe** en las 28 partidas. |

Con una política **aleatoria** de cartas se sobrevive igual: hoy **las decisiones de build apenas cuentan hasta el minuto 10**.

## 5. Rendimiento (partida renderizada, semilla 11, entorno de pruebas sin GPU representativa)
| Minuto | Enemigos | Llamadas de dibujo | Triángulos | `draw()` medio / p95 |
|---|---|---|---|---|
| 2,1 | 231 | 1294 | 0,65 M | 4,9 / 5,1 ms |
| 5,1 | 241 | 833 | 0,48 M | 3,8 / 3,2 ms |
| 9,1 | 239 | 672 | 1,07 M | 1,9 / 2,1 ms |
Los FPS y el p95 reales solo se obtienen de partidas humanas: quedan registrados en `erazStats` cada 10 s y se exportan.

**Dependencia del framerate.** Las armas por separado ya dan el mismo daño a 20, 30 y 60 FPS (corregido en Alpha.2), salvo el Rifle, que conserva un residuo del 12 %. Las partidas completas con distinto `dt` no son comparables semilla a semilla, porque cambia la secuencia de números aleatorios.

## 6. Problemas encontrados
1. **Antes del jefe no hay peligro.** Daño recibido medio hasta el minuto 10: 51, con 100 de vida y regeneración.
2. **La población se estanca a partir del minuto 2:10.** El tope `LIM.wave` = 230 se alcanza enseguida. Después solo escalan la vida (`1 + T/140`) y el daño (`1 + T/600`), así que la presión no crece.
3. **La vida de los enemigos ya escala más que la tabla propuesta.** Hoy multiplica por 1,86 en el minuto 2 y por 5,29 en el 10, frente a 1,20 y 2,60 en la hipótesis. El daño, 1,2 → 2,0 frente a 1,10 → 1,65. **Aplicar la tabla tal cual dejaría a los comunes con un 49 % de la vida actual en el minuto 10.**
4. **Los élites no son especiales.** Aparecen unos 116 por partida.
5. **Las armas apuntan al enemigo más cercano**, así que los jefes rodeados de horda apenas reciben daño. El jefe del minuto 5 tarda unos 170 s (≈ 20 de DPS dirigido); el Mamut, unos 205 s (≈ 88 de DPS dirigido). El TTK de los jefes depende hoy más de la elección de objetivo que de su vida.
6. **El fuego amigo enemigo** (explosiones de hinchados) aporta el 14 % del daño del jugador.
7. **La curva de niveles está muy concentrada al principio.** Nivel 10 a los 2 min, luego ~1 por minuto; la XP por minuto crece de 98 a ~1300.
8. **El Mamut Rey es el único filtro real.** Su onda causa 5 de las 9 muertes de la línea base; falta verificarlo con humanos (el bot esquiva peor que una persona con dash).
9. **Rendimiento.** Hasta 1,07 M triángulos (minuto 9) y 1294 llamadas (minuto 2). Cualquier aumento de población debe respetar el perfil de bajo consumo.
10. **Limitaciones de la medición.** Bot ≠ humano; partidas humanas no reproducibles al 100 %; sin datos de FPS reales todavía.

## 7. Recomendaciones cuantitativas para el Temporal Director (Normal)
Todas son hipótesis para validar con el simulador y el Playtest #002. **No se ha aplicado nada.**

1. **Reloj.** Usar el tiempo de juego `T` (solo avanza en `step()`): ya se detiene en pausa, cartas, cofres y ruletas.
2. **Población objetivo**, y no un tope fijo (escritorio; ×0,6 en bajo consumo; siempre ≤ `LIM.enemies` − 30 plazas reservadas para encuentros obligatorios):

| 0:00 | 1:00 | 2:00 | 3:00 | 4:00 | 5:00 (horda) | 6:00 | 7:00 | 8:00 | 9:00 (crítica) | 10:00 |
|---|---|---|---|---|---|---|---|---|---|---|
| 40 | 80 | 110 | 140 | 160 | 260 durante 45 s | 170 | 190 | 200 | 280 durante 60 s | 120 + invocaciones |

3. **Presupuesto de amenaza por segundo** con costes por tipo, para que la dificultad venga de la composición y no de la vida.
   - Costes: zombi 1, rápido 1,5, raptor 2, smilodon 3, tricerátops 5, mamut 8, especial 4; un élite vale ×5.
   - Ritmo: 2,5 /s (0:00) → 4 (2:00) → 5,5 (4:00) → 6,5 (6:00) → 8 (8:00) → 10 (9:00).
   - Referencia actual: el jugador elimina unos 6 enemigos/s desde el minuto 3.
4. **Multiplicadores.**
   - **Opción A (tabla del equipo):** baja la vida a la mitad respecto a hoy en el minuto 10. Exige casi duplicar la amenaza por composición.
   - **Opción B (calibrada a la vida actual):** vida 1,0 / 1,5 / 2,1 / 2,8 / 3,5 / 4,2 y daño 1,0 / 1,15 / 1,3 / 1,5 / 1,7 / 1,85 (minutos 0, 2, 4, 6, 8, 10).
   - Recomiendo medir ambas con las mismas semillas.
5. **Objetivo de dificultad para el bot competente en Normal.**
   - Daño recibido antes del minuto 10: 150–300 (hoy 51).
   - La política aleatoria debería morir antes del minuto 10 en ≥ 50 % de las semillas (hoy 0 %).
   - Las builds coherentes deberían llegar al Mamut en ≥ 80 %.
6. **Élites.**
   - Garantizados a las 2:00 y a las 4:00.
   - Aleatorios solo con presupuesto: máximo 1 activo antes del minuto 5 y 2 después; **8–15 por partida** (hoy unos 116).
   - Vida para un TTK de 8–15 s con el DPS a un objetivo de ese minuto.
7. **Minijefes de las 6:00 y las 8:00.**
   - TTK objetivo: 40–60 s.
   - Antes de fijar su vida, decidir la **prioridad de objetivo** (que el Rifle o el arma cazajefes apunten a élites y jefes). Sin eso, el TTK lo decide la horda, no el jefe.
   - Con el DPS dirigido actual (≈ 20–90), la vida estaría entre 2500 y 4000.
8. **Mamut Rey.** Volver a medir su TTK tras el cambio de objetivo; hoy es de 205 s con 18 000 de vida.
9. **Fuego amigo.** Quitar o reducir el daño de las explosiones de hinchado a otros enemigos (14 % del daño del jugador).
10. **Medición continua.** Cada propuesta del Director se compara con esta línea base con el mismo comando:
    ```js
    SIM.run({seed: s, ch: 0, mode: 0, policy: 'equilibrada', maxT: 1200})
    // semillas 11, 22, 33, 44, 55, 66, 77, 88, 99 y 111
    ```

## 8. Próximo paso
Revisar estas cifras con Rencorosito y, a ser posible, pedirle que exporte 2–3 partidas humanas con «Exportar estadísticas» (Normal) para comparar el bot con un humano y obtener FPS reales del teléfono. Después, Etapa 2 (Temporal Director).
