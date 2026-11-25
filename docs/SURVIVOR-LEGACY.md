# Survivor Legacy — sistema aprobado (REGISTRO, NO IMPLEMENTADO)

Estado: **aprobado en concepto, sin implementar**. Se pospone hasta consolidar el combate y el rendimiento.

## Lo aprobado (según el equipo)
- Cada personaje tendrá **armas y objetos exclusivos**.
- Se **desbloquean mediante misiones y logros**.

## Lo que NO está definido (no se asume nada)
- Cuántas armas/objetos por personaje y su diseño.
- Qué misiones o logros concretos desbloquean cada uno.
- Si los objetos exclusivos aparecen en cartas, cofres o ruleta, o solo en el equipo inicial.
- Cómo se muestran los bloqueos en la interfaz.

## Puntos de integración previstos (solo referencia técnica)
- Personajes: `CHR` en `js/03-datos-jefes.js`; desbloqueos: `UT`/`UR` y misiones `MS` en `js/05-menus-ui.js`.
- Armas: `WP`/`WS`/`CD` y su lógica en `js/10-combate.js`; objetos: `IT`/`IC` en `js/08-datos-items-entrada.js`.
- Guardado: añadir un campo nuevo a `M` con valor por defecto (sin renombrar `arcane1`).

Antes de implementar: acordar el diseño con Rencorosito y revisar el balance con pruebas humanas.
