# Playtest #001 — Rencorosito (creador original)

- Tipo: prueba **humana** desde su teléfono.
- Versión probada: la publicada antes de v0.1.0-alpha.2 (el equipo no indicó el commit exacto).
- Fuente: resumen transmitido por el equipo. No hay transcripción original; las frases entre comillas son del resumen, no citas literales.
- Dispositivo, navegador y versión del sistema: **sin registrar** (pedir a Rencorosito para el playtest #002).

## Valoración general
El juego «funciona bien en general» en su teléfono. Los problemas se agrupan en controles, diseño de armas y UI/UX.

## Comentarios

| ID | Área | Comentario registrado | Estado |
|---|---|---|---|
| ERAZ-001 | Controles | No se puede usar el dash mientras se mantiene pulsado el joystick (multitouch). Se pide: pointerId independientes, dash en la dirección del movimiento y que el movimiento continúe después del dash. | Implementado (auto) en `5ab6052`; pendiente de verificación humana |
| ERAZ-002 | Armas | El lanzallamas muestra un triángulo visible en vez de fuego. | Rediseñado (auto) en `1623464`; pendiente de verificación humana |
| ERAZ-003 | Armas | «El lanzallamas está mal diseñado» (no se interpreta solo como demasiado fuerte o débil). | Auditado y rediseñado (ver `AUDITORIA-LANZALLAMAS.md`); pendiente de verificación humana |
| ERAZ-004 | Progresión | La progresión por nivel de las armas apenas se nota. | Auditado; correcciones de defectos aplicadas; propuesta en `AUDITORIA-BALANCE.md` |
| ERAZ-005 | Balance | Las armas no tienen fortalezas y debilidades claras. | Pendiente (solo propuesta) |
| ERAZ-006 | UI/UX | Menús, interfaces y pausas resultan confusos. | Pendiente (auditoría y propuesta) |
| ERAZ-007 | UI/UX | Navegación entre pantallas poco clara. | Pendiente |
| ERAZ-008 | UI/UX | Falta confirmación al reiniciar o abandonar una partida. | Pendiente |
| ERAZ-009 | UI/UX | Identidad visual: se pide estética militar y postapocalíptica del Puesto 7. | Pendiente (propuesta) |

Nota: el contenido de ERAZ-004 a ERAZ-009 está redactado a partir de los requisitos del equipo para la actualización; si Rencorosito dijo algo más específico, hay que añadirlo aquí.

## Decisiones del equipo (v0.1.0-alpha.2)
- Desarrollo sencillo: trabajar en la rama actual (`main`), commits independientes, pruebas locales, **sin push** hasta aprobar la actualización.
- Codex publica en GitHub conservando el mismo enlace del juego y los guardados existentes. Sin ramas adicionales ni otros hostings.
- Survivor Legacy no se implementa todavía.

## Segundo playtest (pendiente)
Pedir a Rencorosito: modelo de teléfono y navegador, orientación usada, si el dash funciona con joystick pulsado, sensación del lanzallamas y de las armas por nivel, y si encuentra el camino por los menús sin ayuda.
