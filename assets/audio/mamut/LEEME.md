# Audio original del Mamut Rey (sustituir el audio procedural)

Por defecto el jefe suena con audio **procedural** (`js/06e-mamut-audio.js`). Para usar archivos originales:
1. Colocar aquí los archivos (`.ogg` recomendado; `.mp3`/`.wav` también sirven si se indica la extensión en el nombre).
2. En `KING_AUDIO` (arriba de `js/06e-mamut-audio.js`) escribir el nombre del archivo (con o sin extensión; sin extensión se usa `.ogg`) en la entrada correspondiente. Las entradas en `null` siguen siendo procedurales; los archivos que falten se ignoran sin error.

| Entrada | Tipo | Descripción | Duración orientativa |
|---|---|---|---|
| `sfx.roar` | efecto | Rugido (se reproduce con ±3 % de variación de velocidad) | 1,5–2 s |
| `sfx.roarPhase` | efecto | Rugido/estallido de cambio de fase con cristales | 1,5–2 s |
| `sfx.stomp` | efecto | Pisotón | 0,6–1 s |
| `sfx.charge` | efecto | Inicio de la embestida | 0,8–1 s |
| `sfx.sweep` | efecto | Barrido de colmillos | 0,3–0,5 s |
| `sfx.step` | efecto | Paso pesado | 0,15–0,3 s |
| `sfx.crystal` | efecto | Fractura de cristales | 0,3–0,6 s |
| `sfx.death` | efecto | Muerte | 2–3 s |
| `sfx.arrival` | efecto | Aparición | 2–3 s |
| `music.p1`, `music.p2`, `music.p3` | música | **Bucles** por fase (se encadenan con fundido de 0,9 s). Si `p1` existe, se usan en lugar del sintetizador | 16–32 s |
| `music.resolve` | música | Cierre al morir el Rey (después hay 1,6 s de silencio) | 2–4 s |

## Requisitos técnicos
- Efectos: mono, 44,1 o 48 kHz, pico máximo −3 dBFS, sin recortes. Pasan por el compresor del bus del jefe.
- Música: estéreo, 44,1 o 48 kHz, bucle sin salto (cortar en cruce por cero y comprobar el empalme), ≈ −16 LUFS.
- Volúmenes: los efectos siguen el control de «Efectos» y la música el de «Música»; «Todo el sonido» los silencia. No mezclar el volumen en el archivo.
- Licencia: solo material original o con licencia comprobada y documentada en `docs/TERCEROS.md`.
- Peso total recomendado ≤ 3 MB (el juego se publica como página estática).
