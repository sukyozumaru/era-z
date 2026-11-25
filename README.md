# Era Z

Roguelike de supervivencia estilo *Vampire Survivors* con estética voxel 3D. Puesto 7, año 2089: un obelisco abrió portales al pasado y los muertos se levantaron junto a bestias prehistóricas.

Todo el arte es procedural (código) y el audio se genera con WebAudio. No hay imágenes ni sonidos externos.

## Jugar en local
No necesita compilación. Abre una terminal en esta carpeta y sirve los archivos:

```bash
python3 -m http.server 8000
```

y entra en `http://localhost:8000`. (Abrir `index.html` con doble clic también suele funcionar, pero algunos navegadores restringen el audio y el almacenamiento en `file://`.)

Necesita conexión a internet para cargar Three.js y la fuente (ver `docs/TERCEROS.md`).

## GitHub Pages
El proyecto es estático y usa rutas relativas (`css/…`, `js/…`), así que funciona desde la raíz del repositorio o desde un subdirectorio como `usuario.github.io/era-z/`. Incluye `.nojekyll`.

## Controles
- Escritorio: WASD o flechas para moverte, Espacio o Shift para dash, Esc o P para pausar, 1–3 para elegir carta, F3 para el diagnóstico.
- Móvil: arrastra el dedo para moverte (joystick flotante) y usa el botón DASH.
- `?debug=1` en la URL muestra el panel de diagnóstico (FPS, frame time, entidades, draw calls).

## Estructura
- `index.html`, `css/style.css`
- `js/*.js`: cortes ordenados del código original; **el orden de carga importa** (scripts clásicos con globales compartidas). Ver `docs/PLAN.md`.
- `docs/`: plan técnico, informes por etapa y decisiones. `docs/archive/` conserva la maqueta original.

## Versionado de recursos
Los `<script>` y `<link>` locales de `index.html` llevan `?v=<versión>` (ahora `0.1.0-alpha.2`). **Hay que cambiarlo en cada publicación**: GitHub Pages cachea los archivos unos minutos y, al ser varios scripts, un visitante podría mezclar archivos viejos y nuevos y romper el juego.

## Partidas guardadas
Se guardan en `localStorage['arcane1']`. Esa clave no debe cambiar. Los campos nuevos se completan con valores por defecto al cargar.

## Licencia
Pendiente de decisión del equipo (no se ha añadido ningún archivo LICENSE).
