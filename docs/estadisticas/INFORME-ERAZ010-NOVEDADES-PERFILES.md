# Informe: ERAZ-010, Novedades y comparativa de progresión permanente

> Trabajo en `main` local, sin push. Origen comprobado: `origin/main` sigue en `793dbb3` (Alpha.2 publicada).
> **Pruebas automatizadas** = scripts en el navegador integrado y simulador con bot. **Pruebas humanas**: ninguna nueva; las pendientes están al final.

## 1. ERAZ-010 — Ruleta del Taller (commit `cf0d23b`)

### Causa
`spin(mode)` era una única función para tres usos (ruleta del Taller, ruleta gigante del mapa y cofres). Siempre ejecutaba `S='lvl'`, que es el estado de «recompensa dentro de la partida». Desde el Taller eso provocaba tres cosas:
- `draw()` consideraba que había partida (`P && S !== 'menu'`) y pintaba el mundo y el HUD de la **última partida**, con el personaje muerto.
- La ruleta corría en contexto de combate. Además, sus temporizadores no se cancelaban si se cambiaba de pantalla y añadían el botón «Continuar» a lo que hubiera en ese momento.
- El cobro (`M.gold -= 30`) se hacía en el manejador del botón y el premio al final de la animación. Si se salía a mitad, el premio podía no llegar a entregarse.

### Corrección estructural
| Función | Contexto | Reglas |
|---|---|---|
| `workshopSpin()` | Solo menú (`S === 'menu'`) | Cobra 30 monedas y guarda el premio persistente **una vez, antes de la animación**. Pantalla de router `ruleta-taller` con «Volver al Taller». |
| `runSpin('wheel')` | Solo partida activa: `S === 'play'`, jugador vivo y partida sin liquidar | El premio es para esa partida y se entrega una sola vez al revelarse. «Continuar» solo reanuda si la partida sigue viva. |
| `spinAnim()` | Común a ambas | Un giro a la vez (`SPIN.busy`), temporizadores ligados a un token. `UI.show()` llama a `spinCancel()`, así que salir de la pantalla (o pulsar Esc) corta la animación sin efectos tardíos. |

Probabilidades sin cambios: Taller `[22, 30, 28, 20]`, mapa `[12, 28, 34, 26]`. `spin(mode)` se mantiene como envoltorio por compatibilidad, incluido el simulador. No encontré otro bug en las reglas.

### Pruebas (automatizadas: `docs/herramientas/prueba-ruleta.js`)
Perfiles nuevo y existente × antes de jugar, tras derrota, victoria, abandono y reinicio, con doble clic en cada caso:

| Comprobación | Resultado en los 10 casos |
|---|---|
| Estado durante el giro | `S = 'menu'` y pantalla `ruleta-taller` |
| HUD y mundo de la partida anterior | ocultos / no se pintan |
| Cobro con doble clic | 30 (una vez) |
| Premios con doble clic | 1 |
| Guardado en `arcane1` | coincide con el estado en memoria |
| Al terminar | «Volver al Taller» → Taller (monedas actualizadas) → «Volver» → menú principal |

- **Esc a mitad de giro:** vuelve al Taller, cobro 30 y premio 1 ya guardados, y ningún resto de la ruleta aparece más tarde.
- **Ruleta del mapa:** se abre en partida, entrega el premio y «Continuar» reanuda. Tras morir, `spin('wheel')` se rechaza.

## 2. Novedades (commit `4040e9f`)
- **Fuente única:** `js/00-version.js` (`VERSIONES`) alimenta la pantalla y la versión bajo el logo. Cómo actualizarlo y el cache busting están en `docs/PUBLICAR.md`.
- **Versión publicada:** **v0.1.0-alpha.2 · Mobile, Combat & UX · 24 de noviembre de 2026**. La fecha está comprobada en la API pública de GitHub: despliegue `github-pages` del 25-11-2026 00:57 UTC, commit `793dbb3`. El número publicado **no se ha cambiado**.
- **Contenido de la pantalla:**
  - Añadido, Mejorado y Corregido.
  - Problemas conocidos, entre ellos ERAZ-010 «corregido en desarrollo, pendiente de publicar».
  - Historial plegable: la primera publicación (`cd761f9`, sin número de versión registrado) y la maqueta original de Rencorosito.
  - **Bloque separado «En desarrollo · no publicado»** para v0.2.0, con estados Listo, En diseño y Planificado.
- **Menú principal:** «Novedades» (icono Lucide `newspaper`) junto a «Historia».
- **Navegación y QA:** `UI.go/UI.back` y Esc probados. El historial usa `<details>` accesibles por teclado. QA: 17 pantallas sin problemas en 375×812 y 812×375.
- **Capturas** en `docs/capturas/novedades/`:
  - `1-escritorio-publicada.jpg` y `2-escritorio-desarrollo-historial.jpg`.
  - `3-movil-menu-principal.jpg`, `4-movil-novedades.jpg` y `5-movil-titulo-version.jpg`.

## 3. Comparativa de progresión permanente

### Método
- **Simulador:** Recluta, Normal (Historia), política de cartas «equilibrada», `dt = 1/30`, semillas 11, 22, 33, 44 y 55 (los veteranos con 2–3 semillas porque todas sus partidas fueron idénticas en resultado), límite de 15 min.
- **Ajustes fijados:** perfil gráfico «Alto» en todas las partidas, porque el perfil cambia el límite de enemigos.
- **Cohortes separadas** por perfil y por movimiento:
  - **quieto**: no se mueve; equivale a un jugador ausente o que no entiende los controles.
  - **novato**: decide cada 0,5 s, solo huye del enemigo más cercano, no esquiva avisos, ácido ni ondas y no usa dash.
  - **competente**: el bot de la Etapa 1.
- **Perfiles** (`docs/herramientas/perfiles.js`). Regla fija de gasto: comprar la mejora permanente más barata mientras cueste ≤ 120 y el resto en ruletas del Taller con las probabilidades reales. Sin reliquias equipadas.

| Perfil | Presupuesto | Mejoras / ruletas | Estadísticas iniciales del Recluta |
|---|---|---|---|
| Nuevo | 0 | — | vida 100 · daño 10 · cadencia 1,3 · velocidad 130 |
| Intermedio | 1000 | 23 mejoras · 1 ruleta (1 objeto) | vida 260 · daño 16 · velocidad 169 · −25 % daño recibido · XP ×1,5 |
| Veterano | 3471 | 24 mejoras · 80 ruletas (59 objetos, 10 armas) | vida 480 · **daño 156,7 (×15,7)** · **cadencia 12,5 (×9,6)** · velocidad 591 · **−87 % daño recibido** · regeneración 14,5/s · críticos 66 % · empieza con 10 armas (Escopeta 3, Tesla 3, Lanzallamas 3, Onda 3, Rifle 2, Lanza 2, Molotov 2, Granadas 1, Minigun 1, Tormenta 1) |

### Resultados
| Cohorte | n | Tiempo (mediana) | Llegan a 10:00 | Victorias | Nivel | Monedas/partida | Monedas/min |
|---|---|---|---|---|---|---|---|
| Nuevo · quieto | 5 | **0:28** (0:28–0:30) | 0 | 0 | 1 | 11 | 24 |
| Nuevo · novato | 5 | **1:31** (0:53–2:22) | 0 | 0 | 6,8 | 223 | 126 |
| Nuevo · competente | 5 | 10:41 (10:25–14:21) | 5 | 0 | 22,2 | 2476 | 212 |
| Intermedio · quieto | 5 | 1:46 (0:37–2:06) | 0 | 0 | 8,6 | 278 | 157 |
| Intermedio · novato | 5 | 2:59 (2:25–3:33) | 0 | 0 | 14,6 | 687 | 227 |
| Intermedio · competente | 5 | 15:00 (12:52–15:00) | 5 | 1 | 25,2 | 2979 | 212 |
| Veterano · quieto | 2 | 10:05 | 2 | **2** | 4,5 | **7211** | 714 |
| Veterano · novato | 2 | 10:01 | 2 | 2 | 34 | 10 126 | 1010 |
| Veterano · competente | 3 | 10:01 | 3 | 3 | 32,7 | **10 956** | 1093 |

**Causas de muerte:**
- **Nuevo quieto:** contacto con zombis básicos `a`.
- **Nuevo novato:** zombi rápido `b`, que aparece a los 0:25 (3 de 5), y ácido (2 de 5).
- **Intermedio novato:** ácido de escupidor en 5 de 5.
- **Competentes:** el Mamut Rey.

### Lectura
1. **El hallazgo de Codex se reproduce.** Un Recluta nuevo que no esquiva muere entre 0:28 y 2:22, como los 42 s de su auditoría. El mismo perfil con un bot competente llega al minuto 10 siempre. **La dificultad depende sobre todo de la habilidad en los primeros 2 minutos**, y entre ambos extremos no hay término medio.
2. **El veterano gana sin moverse.** Mata al Mamut Rey en 5–7 s y la dificultad deja de existir. La causa es que **los objetos de la ruleta se acumulan sin límite** y cada copia aplica su efecto completo; por ejemplo, 59 objetos dan ×15,7 de daño y −87 % de daño recibido. A esto se suman las armas permanentes desde el segundo 0.
3. **Bola de nieve económica.** Una partida de veterano da 7200–11 400 monedas, entre 2 y 3 veces todo su presupuesto acumulado. Nuevo e intermedio ganan unas 210 monedas/min.
4. **Abandonar pronto no es un exploit para nuevo ni intermedio.** Las monedas por minuto si se abandona son casi lineales: 1 min ≈ 75–108, 2 min ≈ 386–405, 3 min ≈ 642–712 y 5 min ≈ 1128–1233, es decir, unas 190–250/min, frente a unas 212/min completando. El problema es el contrario: **ganar solo añade 100 monedas** (Historia) sobre unas 2500, así que terminar la partida apenas se recompensa.
5. **Las monedas escalan con las bajas**, no con el progreso: el veterano obtiene ~840/min a los 5 min.
6. **El perfil gráfico cambia la dificultad.** «Bajo consumo», el automático en móvil, limita las oleadas a 140 enemigos frente a 230. Las partidas de teléfono no son comparables con las de escritorio. Las estadísticas registran ahora el perfil y los límites.

### Cambios de medición incluidos en este commit
- **Partículas con aleatoriedad propia (`CR`).** Antes, el número de partículas, que depende de los ajustes gráficos, consumía la misma secuencia aleatoria que la partida. Por eso **la misma semilla daba partidas distintas según los gráficos**, y ahora no: verificado con partículas 0, 1 y 2 y «Reducir efectos». No cambia el balance, pero **las cifras exactas por semilla de la Etapa 1 no son repetibles con esta versión**; las tendencias sí se mantienen.
- **Nuevos campos en las estadísticas:**
  - monedas que daría abandonar en cada minuto;
  - perfil gráfico y límites de enemigos de la partida;
  - monedas correctas en «tiempo límite» (antes usaba el valor de la partida anterior).
- **Simulador:** movimientos `quieto` y `novato`, perfiles `{profile, profileName}` y perfil gráfico fijado en «Alto».

**No se ha tocado** ningún coste, probabilidad, estadística permanente ni escalado de enemigos.

## 4. Propuesta revisada para el Temporal Director
Sigue sin implementarse.

### 4.1 Encaje del jefe del minuto 5
Hoy `bossSpawn` crea un jefe cada 5 min (smilodon a las 5:00 y Mamut a las 10:00, y sigue después). Su TTK mediano medido es de ~170 s, así que un jefe a las 5:00 seguiría vivo a las 6:00.

| Opción | Cronología 4:00–8:00 | Riesgo |
|---|---|---|
| **A (recomendada)** | 4:00 élite garantizado · 5:00 horda masiva · **6:00 minijefe 1 = el jefe actual del minuto 5, trasladado y con identidad propia** · 8:00 minijefe 2 | Un solo jefe cada vez. El jefe actual deja de ser genérico. |
| B | 4:00 élite · **5:00 minijefe 1 (el actual)** · 6:00 grupo de élites · 8:00 minijefe 2 · horda a las 4:30 | Mantiene la costumbre del minuto 5, pero la horda y el élite quedan muy juntos. |
| C | Mantener el jefe de 5:00 **y** añadir minijefes a las 6:00 y 8:00 | Con TTK de ~170 s se solaparían dos jefes. Desaconsejada. |

En cualquier opción, **el Director debe ser la única fuente de jefes y minijefes**, sustituyendo el temporizador `NB` de `bossSpawn` para no duplicar eventos.

### 4.2 Calibración por cohortes
**El Director no debe escalar con la build**, siguiendo la filosofía del equipo. Por eso la referencia de Normal tiene que ser una cohorte concreta. Propongo:

| Cohorte | Objetivo en Normal |
|---|---|
| Nuevo · novato | Sobrevivir ≥ 3–4 min (hoy 1:31) |
| Nuevo · competente | Llegar al Mamut ≥ 80 % y ganar 10–30 % |
| Intermedio · competente | Llegar ≥ 90 % y ganar 30–50 % |
| Veterano | **Solo se puede acotar limitando la progresión permanente** (fuera del Director): tope de copias de cada objeto, rendimientos decrecientes, armas permanentes a nivel 1 o como opción inicial en lugar de todas. |

### 4.3 Primeros 2 minutos (las muertes de los nuevos)
- **Enemigos rápidos:** mover el zombi rápido `b` de 0:25 a 1:00, como en vuestro cronograma.
- **Población:** objetivo de 40 enemigos al inicio y 80 al minuto 1; hoy hay 152 vivos al minuto 1.
- **Escupidores:** retrasarlos (hoy a 1:40) o limitar su número antes del minuto 3. El ácido mata a 5 de 5 intermedios novatos.

### 4.4 Lo que se mantiene de la Etapa 1
- **Población objetivo por minuto** con 30 plazas reservadas para encuentros obligatorios.
- **Presupuesto de amenaza** por tipo de enemigo.
- **Élites:** 8–15 por partida, no los ~116 actuales.
- **Prioridad de objetivo** para el arma cazajefes antes de fijar la vida de los minijefes.
- **Tabla de vida:** **no aplicar la tabla inicial**; el escalado actual ya es ×5,3 en el minuto 10.

### 4.5 Recompensas (Etapa 5, para tener en cuenta)
- **Bonificación de victoria:** proporcional a la partida (hoy 100 monedas sobre ~2500).
- **Monedas por bajas:** revisar que no escalen sin límite con el poder de la build.

## 5. Riesgos y pruebas humanas pendientes
- **El bot no es un humano.** «Novato» y «quieto» son modelos extremos.
  - Necesitamos **partidas exportadas** («Exportar estadísticas») de Rencorosito y de alguien que no conozca el juego, en Normal, con perfil nuevo.
  - Esas partidas sirven para situar a los humanos entre «novato» y «competente» y obtener FPS reales.
- **Perfiles:** el veterano usa una regla de gasto mía. Un jugador real puede preferir mejoras o equipar reliquias. Conviene conocer un perfil real de veterano (exportando `arcane1` con su permiso) para no calibrar contra un caso irreal.
- **Bajo consumo en móvil:** juega con menos enemigos. Comparar partidas de móvil con las de escritorio exige separarlas por perfil, que ya se registra.
- **Ruleta (ERAZ-010):** probada solo con eventos sintéticos. Falta probarla con dedo en el teléfono, sobre todo el doble toque rápido y la salida a mitad de giro.
- **Novedades:** revisar la redacción con el equipo, y confirmar el nombre de la primera publicación si existió como «alpha.1».
