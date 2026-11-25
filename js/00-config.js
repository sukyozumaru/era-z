/* Era Z — configuración global (se carga la primera).
   Presupuestos de entidades y detección de tipo de entrada. */
/* CR: aleatoriedad SOLO cosmética (partículas). Usa el Math.random nativo para que los ajustes gráficos no alteren la secuencia sembrada de la partida. */
const CR=Math.random.bind(Math);
let RUN_DONE=0,DS='?';/* DS: fuente de daño activa (estadísticas) *//* una partida solo puede liquidarse una vez (evita duplicar monedas al abandonar/morir) */
const LIM={enemies:320,wave:230,gems:400,eb:48,fx:90,corpses:150};
/* INP.touch: true si el último dispositivo de entrada usado fue táctil/lápiz. El teclado lo pone en false. */
const INP={touch:!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches)};
/* Vibración: solo en táctil y tras un gesto del usuario (evita avisos del navegador en escritorio). */
const buzz=ms=>{if(INP.touch&&!(M.set&&M.set.vib===1)&&navigator.vibrate&&navigator.userActivation&&navigator.userActivation.hasBeenActive){try{navigator.vibrate(ms)}catch(e){}}};
