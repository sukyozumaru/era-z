# Informe — Etapa 3 (Enemigos), parcial

## Cambios
- Escupidor: silueta propia (torso encorvado, cuello largo, saco de ácido, espinas dorsales). Anticipación de 0,7 s: se echa hacia atrás, el saco se hincha, aparece una línea roja en el suelo con la dirección fijada y luego dispara. El proyectil es esquivable porque la dirección se fija al empezar.
- Hinchado: silueta propia (vientre esférico con pústulas luminosas, cabeza hundida, brazos cortos). Si el jugador está a menos de 60 enciende la mecha 1,1 s: pulsa y muestra un círculo rojo que es el radio real de la explosión (75). Estalla aunque nadie lo mate; si lo matan antes, estalla en el sitio como antes.
- Separación entre enemigos con rejilla espacial (celda 96). Los jefes no se desplazan por empujones.
- Telegraph genérico en el sistema de efectos (`FX k:'t'`, forma círculo o línea) reutilizable para el Mamut Rey.

## Pruebas (automatizadas)
- Windups ocurren (28 fotogramas de anticipación del Escupidor en la prueba), el telegraph se dibuja (captura comprobada) y el Hinchado inflige daño al estallar.
- 300 enemigos amontonados en 60×60: 4065 pares solapados antes, 0 después de 120 pasos.
- Sin excepciones en consola.

## Honestidad sobre rendimiento
La rejilla no acelera de forma apreciable con 300 enemigos (separación O(n²) ≈ 0,3 ms; paso completo ≈ 0,6 ms). Se mantiene porque escala mejor y permite pesos distintos por enemigo. El cuello de botella medido sigue siendo el render (~1250 draw calls con 230 enemigos): pendiente de la optimización de LOD/instanciado.

## Pendiente
- Valorar las siluetas y la lectura de los avisos con jugadores reales (no hay prueba humana todavía).
- Mamut Rey (Etapa 4), semillas y registro (Etapa 5).
- Optimización de draw calls.
