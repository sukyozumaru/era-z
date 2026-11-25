/* Era Z — comportamiento en móvil: evita zoom accidental, menú contextual y desplazamiento de la página durante la partida;
   recalcula el tamaño al girar la pantalla o al cambiar la barra del navegador. */
['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault()));
document.addEventListener('touchmove',e=>{if(!(e.target.closest&&e.target.closest('.pn')))e.preventDefault()},{passive:false});
addEventListener('contextmenu',e=>e.preventDefault());
const fixSize=()=>{rs();setTimeout(rs,200)};
addEventListener('orientationchange',fixSize);
if(window.visualViewport)visualViewport.addEventListener('resize',()=>rs());
addEventListener('pagehide',()=>{if(S==='play')pauseP()});
/* v0.2.1 · Al ocultar la pestaña (bloqueo de pantalla, cambio de app, barra de Safari) se pausa la partida y se suspende el audio;
   al volver se intenta reanudar el audio (Safari lo deja en «interrupted» hasta el siguiente toque, que ya lo reanuda). */
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){if(S==='play')pauseP();if(AC&&AC.state==='running'){try{AC.suspend().catch(()=>{})}catch(e){}}}
 else if(AC&&AC.state!=='running'){try{AC.resume().catch(()=>{})}catch(e){}}});
