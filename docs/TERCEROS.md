# Recursos de terceros

| Recurso | Uso | Origen | Licencia (comprobar antes de publicar) |
|---|---|---|---|
| Three.js r128 | Motor 3D | cdnjs.cloudflare.com | MIT |
| Press Start 2P | Fuente de títulos y cifras del HUD | Google Fonts | SIL Open Font License 1.1 |
| Lucide (`lucide-static` 1.79.0) | Iconos de navegación y controles (50 SVG) | unpkg.com → copiados a `assets/icons/lucide/` e incrustados en `js/18-iconos.js` | ISC (texto en `assets/icons/LICENSE-lucide.txt`) |
| Fuente del sistema (`system-ui`) | Texto, botones y estadísticas | Del dispositivo, sin descarga | — |

No hay imágenes, modelos ni audio externos: modelos voxel, texturas y sonido se generan por código. Los iconos de armas y objetos son propios (emoji convertido a pixel art en tiempo de ejecución), no de Lucide.
La tabla refleja lo que se sabe del código; la verificación legal final corresponde al equipo.
Alternativa a valorar: copiar Three.js y la fuente dentro del repositorio para que el juego funcione sin conexión (requiere incluir sus licencias).
