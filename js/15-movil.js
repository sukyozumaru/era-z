/* Era Z — comportamiento en móvil: evita zoom accidental, menú contextual y desplazamiento de la página durante la partida;
   recalcula el tamaño al girar la pantalla o al cambiar la barra del navegador. */
['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault()));
document.addEventListener('touchmove',e=>{if(!(e.target.closest&&e.target.closest('.pn')))e.preventDefault()},{passive:false});
addEventListener('contextmenu',e=>e.preventDefault());
const fixSize=()=>{rs();setTimeout(rs,200)};
addEventListener('orientationchange',fixSize);
if(window.visualViewport)visualViewport.addEventListener('resize',()=>rs());
addEventListener('pagehide',()=>{if(S==='play')pauseP()});
