/* Era Z — fuente única de versiones y novedades (pantalla «Novedades» y versión bajo el logo).
   CÓMO ACTUALIZAR (ver docs/PUBLICAR.md):
   1. Al desplegar: mover la entrada de «desarrollo» a «lista» (al principio), poner su fecha VERIFICADA y cambiar «publicada».
   2. No cambiar «publicada» hasta que el despliegue exista realmente (lo hace Codex al publicar).
   3. Cambiar el ?v= de index.html (cache busting) en la misma publicación.
   Campos: añadido / mejorado / corregido / conocidos = listas de textos cortos para jugadores. */
const VERSIONES={
 publicada:'0.1.0-alpha.3',
 lista:[
  {v:'0.1.0-alpha.3',nombre:'Workshop & Combat Insights',fecha:'2026-11-24',
   fuente:'Publicación alpha.3',
   añadido:['Estadísticas de combate por partida y exportación en JSON y CSV.','Pantalla de Novedades y versión visible en el inicio.'],
   mejorado:['Comparativa de perfiles de progresión y herramientas para analizar partidas.'],
   corregido:['La ruleta del Taller ya no muestra el estado de la partida anterior y conserva el premio al salir.'],
   conocidos:['La comparativa de perfiles se basa en simulaciones y requiere pruebas humanas.']},
  {v:'0.1.0-alpha.2',nombre:'Mobile, Combat & UX',fecha:'2026-11-24',
   fuente:'Despliegue de GitHub Pages del 25-11-2026 00:57 UTC (24-11-2026 en América), commit 793dbb3',
   añadido:['Interfaz nueva del Puesto 7: menú principal, dificultad, personajes, ajustes por pestañas, pausa, cartas de nivel y pantalla de resultado.',
    'HUD de combate legible: vida, experiencia, tiempo, bajas, monedas y armas con su nivel.',
    'Confirmación al reiniciar o abandonar una partida, y «Reintentar» a un toque.',
    'La historia aparece la primera vez y puede volver a verse desde el menú.',
    'Ajuste de vibración e iconos de navegación coherentes.'],
   mejorado:['Multitáctil: el dash funciona sin soltar el joystick y sale en la dirección del movimiento.',
    'Lanzallamas rediseñado: llamas visibles, área de daño que coincide con el fuego, sin empujar a los enemigos fuera de alcance y con quemadura.',
    'Abandonar conserva las monedas ganadas (sin bonificación de victoria).',
    'Textos, botones y estadísticas con una letra más legible.'],
   corregido:['La cadencia de pistola, minigun y lanza ya no depende de los FPS.',
    'Las balas ya no atraviesan a los enemigos con FPS bajos (el rifle no hacía daño a 20 FPS).',
    'El lanzallamas ya ataca a los jefes grandes.',
    'Esc en un diálogo de confirmación ya no reanuda la partida.'],
   conocidos:['Tras una partida, la ruleta del Taller muestra la partida anterior (ERAZ-010). Corregido en desarrollo, pendiente de publicar.',
    'La dificultad varía mucho entre perfiles nuevos y perfiles con mejoras permanentes.',
    'Los élites aparecen con demasiada frecuencia y los jefes rodeados de horda tardan en caer.',
    'Taller y Misiones conservan el diseño anterior.',
    'Con cifras de vida muy altas, el texto del HUD puede tocar el reloj.']},
  {v:null,nombre:'Primera publicación',fecha:'2026-11-24',
   fuente:'Despliegue de GitHub Pages del 25-11-2026 00:11 UTC, commit cd761f9 (sin número de versión registrado en el repositorio)',
   añadido:['Mamut Rey como jefe final con fases, ataques anunciados y barra propia.','Escupidor e Hinchado con siluetas y ataques anunciados.','Perfil gráfico de bajo consumo y panel de diagnóstico.','Compatibilidad móvil: sin zoom accidental, áreas seguras y menús que caben en pantalla.','Nuevo nombre: Era Z.'],
   mejorado:['Separación entre enemigos y efectos de disparo, críticos, dash y explosiones.'],corregido:['Los rayos de la Tormenta eléctrica eran invisibles.'],conocidos:[]},
  {v:null,nombre:'Maqueta original «Zombie Survivor»',fecha:null,fuente:'Creada por Rencorosito antes de la publicación',
   añadido:['Base del juego: personajes, armas, objetos, reliquias, Taller, misiones, modos Historia, Difícil y Hardcore.'],mejorado:[],corregido:[],conocidos:[]}],
 desarrollo:{v:'0.2.0',nombre:'Combat Balance & Progression Overhaul',
  items:[['diseño','Director de dificultad por tiempo: hordas, élites garantizados y minijefes.'],
   ['plan','Rebalanceo de armas, enemigos, recompensas y curva de experiencia.']]}};
