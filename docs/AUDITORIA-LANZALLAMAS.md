# Auditoría y rediseño del lanzallamas (ERAZ-002 / ERAZ-003)

> Mediciones **automatizadas** (simulación, `P.dmg = 10`, `P.rate = 1,3`, sin críticos). No sustituyen al playtest humano.
> Capturas: `docs/capturas/lanzallamas-anterior.jpg` y `docs/capturas/lanzallamas-nuevo.jpg` (misma escena: 16 zombis agrupados delante del jugador, nivel 3).

## Qué estaba mal (diagnóstico, no «demasiado fuerte/débil»)
1. **El efecto no coincidía con el daño.** Se dibujaba un cono sólido y estrecho (≈26° de apertura) —el «triángulo»— mientras el daño se aplicaba en un cono de ≈82°.
2. **Se expulsaba a sí mismo el objetivo.** Cada impacto aplicaba retroceso proporcional al daño; con 5,5 impactos/s el enemigo se alejaba hasta el borde del alcance. Resultado medido: contra un enemigo fuerte al nivel 5 el objetivo se quedaba parado a ~131 px (alcance 160) y contra uno grande (`c`) al nivel 1 oscilaba justo en el límite (128 px de alcance, 39 % del tiempo dentro).
3. **Casi no escalaba.** DPS contra un objetivo, nivel 1 → nivel 5: 19,5 → 21,9 (**+12 %**).
4. **Ruido visual.** Un número de daño «10» por enemigo y por impacto (decenas de números superpuestos).
5. **Cadencia fija de 0,18 s sin carga de arma** y sin ningún efecto residual.

## Rediseño
- Rol: **control de hordas a corta distancia** (alcance 110 → 158 px, cono 56° → 72°), débil contra un único objetivo y contra jefes.
- Daño por **ticks fijos de 0,1 s** con acumulador: idéntico a 20, 30 o 60 FPS (medido: 22,2 DPS en los tres casos).
- **Cono de daño = cono visible**, calculado con el radio del enemigo.
- **Sin retroceso** (el enemigo no sale del alcance).
- **Quemadura residual**: 2,2 s (+0,3 s por nivel) que se refresca mientras sigue dentro; daño en ticks de 0,25 s; mitad de efecto en jefes.
- Números de daño agregados cada 0,5 s por enemigo.
- Visual: llamas con cubos voxel, mezcla aditiva y brasas, en **un único `InstancedMesh`** con pool fijo (200 partículas, 60 en bajo consumo, la mitad con «Reducir efectos»), sin crear objetos por fotograma. 1 llamada de dibujo.
- Escalado por nivel: alcance +12 px, apertura +2°, daño directo +20 %, quemadura +15 % y más duración.

## Resultados (automatizados)
| Métrica | Antes | Ahora |
|---|---|---|
| DPS contra 1 enemigo, nv.1 → nv.5 | 19,5 → 21,9 (+12 %) | 14,9 → 30,7 (+106 %, incluye tiempo de aproximación) |
| Retroceso que saca al objetivo del alcance | sí | no |
| DPS a 20 / 30 / 60 FPS | (cono con impactos por frame de caché) | 22,2 / 22,2 / 22,2 |
| Dibujo del efecto | 1 malla por impacto | 1 llamada, pool fijo |
| Daño en un grupo apretado (25 enemigos), nv.1 / nv.5 | — | 414 / 1130 DPS totales |

## Pendiente y riesgos
- **Posible exceso en grupos muy apretados**: el DPS total contra 25 enemigos superpuestos es el mayor de todas las armas (ver `AUDITORIA-BALANCE.md`). En la práctica la separación entre enemigos reparte el grupo; hace falta playtest para ver si es excesivo.
- Contagio de quemadura entre enemigos y combustión al morir quedan como opciones para niveles altos, **no implementadas**.
- La estética de las llamas (tamaño y color) es mi interpretación; falta la opinión de Rencorosito.
