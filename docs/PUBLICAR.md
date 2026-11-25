# Cómo publicar una versión de Era Z

La publicación la hace Codex en GitHub (mismo repositorio y enlace). Esta lista evita olvidos.

## 1. Changelog (fuente única: `js/00-version.js`)
- `VERSIONES.publicada`: la versión que está **realmente desplegada**. No cambiarla antes del despliegue.
- `VERSIONES.lista`: versiones publicadas, la más reciente primero. Cada una con `v`, `nombre`, `fecha` (AAAA-MM-DD **verificada**), `fuente` (de dónde sale la fecha), `añadido`, `mejorado`, `corregido` y `conocidos`.
- `VERSIONES.desarrollo`: lo que aún no está publicado, con estado `listo`, `diseño` o `plan`. La pantalla lo muestra separado y marcado como «En desarrollo · no publicado».
- La pantalla «Novedades» y la versión bajo el logo leen solo de este archivo; no hay que tocar ninguna pantalla.

Al publicar:
1. Mover lo publicado de `desarrollo` a una entrada nueva al principio de `lista`, redactado para jugadores.
2. Poner `fecha` y `fuente` tras comprobar el despliegue. Por ejemplo, en la API pública de GitHub: `https://api.github.com/repos/sukyozumaru/era-z/deployments`, campo `created_at` del entorno `github-pages`.
3. Actualizar `publicada` y vaciar o rehacer `desarrollo`.
4. Revisar «Problemas conocidos».

## 2. Cache busting (`index.html`)
Todos los `<script>` y `<link>` locales llevan `?v=…`. Cambiarlo **en cada publicación** (por ejemplo `?v=0.2.0`) para que GitHub Pages no sirva una mezcla de archivos viejos y nuevos. Debe ser el mismo valor en todas las líneas.

## 3. Comprobaciones antes de publicar
- Abrir el juego en local (`python3 -m http.server 8000`) y revisar la consola: sin errores.
- `docs/capturas/qa-pantallas.js`: 0 problemas en móvil vertical, horizontal y escritorio.
- `docs/herramientas/prueba-ruleta.js`: todos los escenarios correctos.
- Guardados: `localStorage['arcane1']` no cambia de formato.
