# Auditoría de armas y propuesta de balance (ERAZ-004 / ERAZ-005)

> **Estado: auditoría + propuesta. No se ha aplicado ningún cambio masivo de balance.**
> Todos los datos son **automatizados** (arma aislada, `P.dmg = 10`, `P.rate = 1,3`, sin críticos, enemigos `a` inmóviles con vida casi infinita, 15 s a 30 FPS). Miden potencial, no partidas reales.

## Escenarios
- **1 obj.**: un enemigo a 100 px. **Lejos**: uno a 300 px.
- **Grupo**: 25 enemigos apilados en 38 px de radio a 100 px (caso extremo).
- **Rodeado**: 24 enemigos en un anillo de 90 px.
- **Jefe**: un enemigo `mam` (radio 48) a 150 px.
Cifras = daño total por segundo.

| Arma (rareza) | Niv. | 1 obj. | Lejos | Grupo | Rodeado | Jefe |
|---|---|---|---|---|---|---|
| Pistola (base) | 1–5 | 13 | 9 | 13 | 13 | 13 |
| Escopeta (1) | 1 / 3 / 5 | 8 / 7 / 8 | 0 | 26 / 44 / 60 | 26 / 44 / 62 | 26 / 44 / 62 |
| Granadas (2) | 1 / 3 / 5 | 12 | 10 | 205 / 248 / 255 | 67 / 78 / 94 | 12 |
| Tesla (2) | 1 / 3 / 5 | 11 | 0 | 32 / 53 / 75 | 32 / 53 / 75 | 11 |
| Minigun (3) | 1 / 3 / 5 | 18 / 18 / 19 | 6 | 28 / 39 / 51 | 28 / 39 / 51 | 28 / 39 / 51 |
| Molotov (1) | 1 / 3 / 5 | 13 / 20 / 27 | 13 / 20 / 27 | 196 / 364 / 673 | 67 / 101 / 188 | 13 / 20 / 27 |
| Lanzallamas (2, nuevo) | 1 / 3 / 5 | 26 / 35 / 45 | 0 | 414 / 576 / 1130 | 129 / 177 / 226 | 0 / 0 / 30* |
| Rifle de precisión (2) | 1 / 3 / 5 | 19 / 28 / 37 | 19 / 28 / 37 | 141 / 172 / 235 | 19 / 28 / 37 | 19 / 28 / 37 |
| Tormenta eléctrica (3) | 1 / 3 / 5 | 52 / 104 / 156 | igual | igual | igual | igual |
| Onda de choque (2) | 1 / 3 / 5 | 1 / 2 / 2 | 0 | 30 / 43 / 57 | 29 / 42 / 54 | 0 |
| Lanza de sílex (1) | 1 / 3 / 5 | 16 / 9 / 11 | 16 / 0 / 0 | 118 / 222 / 288 | 16 / 70 / 87 | 16 / 41 / 50 |
\* Medido antes de corregir la detección de jefes por borde de cuerpo (ver «Defectos»).
Sierra giratoria (orbes) no se midió: solo golpea a menos de 55 px.

## Hallazgos
### Defectos (no son decisiones de balance)
1. **Cadencia dependiente del framerate** (arreglado): pistola +6 %, Minigun nv.5 +20 %, Lanza +21 % a 60 FPS frente a 20 FPS.
2. **Balas que atravesaban enemigos a bajo FPS** (arreglado con colisión barrida): el Rifle de precisión hacía **0 de daño a 20 FPS** y 95 a 60 FPS. En un teléfono con pocos FPS el arma no funcionaba.
3. **Lanza nv.3+ lanza dos lanzas separadas por ángulo**: a 300 px ambas pasan al lado de un único objetivo (0 de daño). Es un defecto de diseño, no se ha tocado.
4. **Lanzallamas y Onda de choque no activaban contra jefes grandes** por medir distancia al centro; el lanzallamas ya está corregido, la Onda de choque no (0 contra jefe a 150 px).
5. **El retroceso es proporcional al daño por impacto y se acumula.** Las armas de disparo rápido (Minigun) se comportan como una ralentización fuerte: un objetivo estático salió disparado de 100 a 387 px en 15 s y el DPS bajó de 28 a 18. Es una mecánica oculta que afecta a todas las armas de muchos impactos.

### Progresión por nivel (¿se nota?)
- **Se nota**: Molotov, Rifle, Tormenta, Lanzallamas (nuevo), Granadas (en grupo).
- **Apenas/no se nota en un objetivo**: Escopeta (solo sube el número de perdigones, que fallan por dispersión), Tesla (solo suben los saltos), Minigun (solo cadencia, la dispersión desperdicia impactos), Onda de choque (daño por objetivo bajísimo), Pistola (no tiene niveles).
- **Empeora al subir**: Lanza (nv.1 → nv.3 baja el DPS contra un objetivo, 16 → 9).

### Fortalezas y debilidades hoy
- **Granadas, Molotov, Lanzallamas**: dominan grupos densos; no sirven contra jefes (12–30 DPS) ni a distancia.
- **Tormenta**: independiente de posición, tamaño y densidad: la mejor contra jefes y objetivos individuales. Es legendaria (3), razonable.
- **Rifle**: único con DPS decente a larga distancia y contra jefes (rareza 2).
- **Escopeta, Tesla, Onda de choque, Minigun**: sin nicho claro; todas por debajo de la pistola contra un objetivo/jefe, y no destacan en grupos frente a las que sí.
- **Pistola base 13 DPS** es peor que casi cualquier arma contra grupos y similar contra jefes: el jefe (18 000 de vida × dificultad) exige >20 min con armas de área.

## Propuesta (sin aplicar; para decidir con Rencorosito tras el playtest #002)
Principios: cada arma con un rol y una debilidad explícitos; cada nivel debe sentirse (alcance, área, cadencia o efecto nuevo, no solo +%); nada se toca sin repetir esta medición.

| Arma | Rol propuesto | Debilidad | Cambio propuesto |
|---|---|---|---|
| Pistola | Fiable a distancia, cualquier objetivo | Bajo DPS | Dar niveles o sinergias (más proyectiles/cadencia). |
| Escopeta | Burst cercano, empuja | Muy corto alcance | Reducir dispersión por nivel; +1 perdigón visible por nivel. |
| Granadas | Explosión en área contra grupos | Lenta, nula contra jefes/dispersos | Radio y pequeño daño a jefes por nivel. |
| Tesla | Cadena entre dispersos | Poco daño al primero | Subir daño del primer salto y alcance de cadena por nivel. |
| Minigun | DPS sostenido a objetivo y jefe | Retroceso/dispersión | Dispersión decreciente; retroceso normalizado por tiempo (ver abajo). |
| Molotov | Zona de denegación | Lenta, no persigue | Mantener; es de las que mejor escala. |
| Lanzallamas | Control de hordas a corta distancia | No alcanza lejos; poco contra jefes | Revisar tras playtest; posible tope de objetivos por tick. |
| Rifle | Perforante a distancia, jefes | Cadencia | Mantener; ya tiene buena progresión. |
| Tormenta | Daño garantizado a cualquier enemigo | Aleatorio, no controla área | Mantener. |
| Onda de choque | Despejar cuando te rodean (empuja) | Daño bajo | Subir daño base ×3 y corregir detección en jefes. |
| Lanza | Perforante contra filas | Fallar objetivos sueltos | Lanzas **paralelas** (no angulares) para no perder precisión. |

Cambios transversales a valorar:
1. **Retroceso normalizado por tiempo** (p. ej. limitar el impulso acumulado por segundo) para que el Minigun no sea una ralentización oculta.
2. **Medir contra jefes con radio** en todas las armas.
3. Un **harness de pruebas fijo** (este mismo escenario) como parte de la Etapa 5, con semillas, para comparar antes/después de cada cambio.

## Preguntas para el playtest humano #002
- ¿Qué armas se sienten «útiles» y cuáles «de relleno»?
- ¿El lanzallamas nuevo se lee bien y es satisfactorio? ¿Demasiado fuerte en hordas?
- ¿Se nota la mejora al subir de nivel cada arma?
- ¿Se nota que los enemigos retroceden con el Minigun/Escopeta?
