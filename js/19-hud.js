/* Era Z — HUD de combate en DOM (tokens, iconos Lucide, texto legible). Sustituye a la barra superior y la tira de armas que se dibujaban en el canvas.
   El canvas sigue dibujando lo que va ligado al mundo: números de daño, joystick, flechas fuera de pantalla, barra del jefe y avisos.
   Preparado para cooperativo: el HUD se pinta a partir de UI.ctx.players (hoy solo el jugador local, que lee el estado global P). */
const HUD=document.createElement('div');HUD.id='hud';
HUD.innerHTML=`<div class="tl"><div class="hb"><span id="h-hp-i"></span><div class="bar"><i id="h-hp" style="background:var(--c-danger);width:100%"></i></div><span class="num" id="h-hpn"></span></div><div class="hb xp"><span id="h-xp-i"></span><div class="bar"><i id="h-xp" style="background:var(--c-info);width:0"></i></div><span class="lv" id="h-lv"></span></div></div><div class="tc" id="h-t">0:00</div><div class="tr"><div class="st"><span class="pill" id="h-k"></span><span class="pill" id="h-c"></span></div></div><div class="bl" id="h-w"></div>`;
WR.appendChild(HUD);
document.getElementById('h-hp-i').innerHTML=icon('heart',18);document.getElementById('h-xp-i').innerHTML=icon('chevrons-up',18);
/* Botón de pausa (dentro del HUD, arriba a la derecha) */
const PZ=document.createElement('button');PZ.id='pz';PZ.setAttribute('aria-label','Pausa');PZ.innerHTML=icon('pause',22);PZ.style.touchAction='none';
PZ.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();if(S==='play')pauseP()});HUD.querySelector('.tr').appendChild(PZ);
/* Botón DASH táctil (grande, con anillo de recarga) y pastilla de escritorio */
const DZ=document.createElement('button');DZ.id='dz';DZ.setAttribute('aria-label','Dash');DZ.innerHTML=`<span class="cd"></span>${icon('zap',28)}<small></small>`;DZ.style.touchAction='none';
DZ.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();try{DZ.setPointerCapture(e.pointerId)}catch(_){}dash()});DZ.onclick=e=>{if(e.detail===0)dash()};WR.appendChild(DZ);
const DK=document.createElement('div');DK.id='dk';DK.innerHTML=`${icon('zap',16)}<span></span>`;WR.appendChild(DK);
const PXU=new Map(),pxeURL=e=>PXU.get(e)||(PXU.set(e,pxe(e).toDataURL()),PXU.get(e));
function hudDom(){
 const inG=!!P&&S!=='menu',vis=inG?'block':'none';if(HUD._v!==vis){HUD._v=vis;HUD.style.display=vis}
 const pl=inG&&S==='play',ph=pl?'flex':'none',dh=pl&&INP.touch?'flex':'none',kh=pl&&!INP.touch?'flex':'none';
 if(PZ._d!==ph){PZ._d=ph;PZ.style.display=ph}if(DZ._d!==dh){DZ._d=dh;DZ.style.display=dh}if(DK._d!==kh){DK._d=kh;DK.style.display=kh}
 if(!inG)return;
 const hp=Math.max(0,Math.ceil(P.hp)),mh=Math.ceil(P.mhp),hs=hp+' / '+mh;
 if(HUD._hp!==hs){HUD._hp=hs;document.getElementById('h-hpn').textContent=hs;document.getElementById('h-hp').style.width=(100*Math.max(0,P.hp/P.mhp)).toFixed(1)+'%'}
 const xs=P.xp.toFixed(1)+'/'+P.need;if(HUD._xp!==xs){HUD._xp=xs;document.getElementById('h-xp').style.width=(100*Math.min(1,P.xp/P.need)).toFixed(1)+'%'}
 const lv='NV '+P.lvl;if(HUD._lv!==lv){HUD._lv=lv;document.getElementById('h-lv').textContent=lv}
 const ts=fmt(T);if(HUD._t!==ts){HUD._t=ts;document.getElementById('h-t').textContent=ts}
 const ks=K+'|'+RIn;if(HUD._k!==ks){HUD._k=ks;document.getElementById('h-k').innerHTML=icon('skull',14)+K;document.getElementById('h-c').innerHTML=icon('coins',14)+RIn}
 const sig=Object.keys(WS).map(k=>WS[k]).join()+'|'+Object.keys(PS).map(k=>PS[k]).join();
 if(HUD._w!==sig){HUD._w=sig;document.getElementById('h-w').innerHTML=[...Object.keys(WS).filter(k=>WS[k]).map(k=>[IW[k],WS[k],WP[k][0]]),...Object.keys(PS).filter(k=>PS[k]).map(k=>[PV[k][1],PS[k],PV[k][0]])].map(([e,l,n])=>`<div class="wp" title="${n}"><img alt="${n}" src="${pxeURL(e)}"><b>${l}</b></div>`).join('')}
 if(pl){const cd=P.dc>0?Math.min(1,P.dc/3):0,pc=Math.round(cd*50)*2;if(DZ._p!==pc){DZ._p=pc;DZ.querySelector('.cd').style.background=pc?`conic-gradient(#000c ${pc}%,#0000 0)`:'none';DZ.style.opacity=pc?.8:1;DZ.querySelector('small').textContent=P.dc>0?Math.ceil(P.dc):''}
  const kt=P.dc>0?'DASH '+Math.ceil(P.dc)+' s':'DASH · Espacio';if(DK._t!==kt){DK._t=kt;DK.querySelector('span').textContent=kt;DK.style.opacity=P.dc>0?.55:1}}}
