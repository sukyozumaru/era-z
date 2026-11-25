/* Era Z — diagnóstico de rendimiento (F3 o ?debug=1).
   No toca la lógica del juego: mide los tiempos envolviendo step() y draw() y lee los contadores globales.
   Por consola: ERAZ_DIAG.snapshot() devuelve las métricas actuales; ERAZ_DIAG.history guarda 1 muestra/seg. */
(()=>{
const N=240,ft=new Float32Array(N);let fi=0,fn=0,stMs=0,drMs=0,on=false,el=null,wrapped=false,lastT=0,hist=[],hAt=0;
const q=new URLSearchParams(location.search);
function wrap(){if(wrapped)return;wrapped=true;const s0=step,d0=draw;
 step=function(dt){const t=performance.now();s0(dt);stMs=stMs*.9+(performance.now()-t)*.1};
 draw=function(){const t=performance.now();d0();drMs=drMs*.9+(performance.now()-t)*.1}}
function snapshot(){
 const a=Array.from(ft.subarray(0,fn)).sort((x,y)=>x-y),n=a.length||1,avg=a.reduce((s,v)=>s+v,0)/n,p95=a[Math.floor(n*.95)]||0,mx=a[n-1]||0;
 const inf=(typeof R3!=='undefined'&&R3)?R3.info.render:{calls:0,triangles:0};
 return{fps:+(1000/(avg||1)).toFixed(1),frameMs:+avg.toFixed(1),p95Ms:+p95.toFixed(1),maxMs:+mx.toFixed(1),stepMs:+stMs.toFixed(2),drawMs:+drMs.toFixed(2),
  enemies:E.length,enemyBullets:EB.length,bullets:B.length,gems:G.length,fx:FX.length,particles:PA.length,particlesMax:PN,corpses:CPS.length,
  drawCalls:inf.calls,triangles:inf.triangles,state:S,time:+(T||0).toFixed(1),
  render:resInfo()}}
/* Resolución real de render (píxeles del WebGL), factor y nivel de resolución dinámica (v0.2.1). */
function resInfo(){if(typeof R3==='undefined'||!R3)return{w:0,h:0,ratio:0,dyn:null};const r=R3.getPixelRatio();return{w:Math.round(W*r),h:Math.round(H*r),ratio:+r.toFixed(2),dyn:typeof DYN!=='undefined'?DYN:null}}
function frame(t){if(lastT){ft[fi]=t-lastT;fi=(fi+1)%N;fn=Math.min(N,fn+1)}lastT=t;
 if(on&&t-hAt>1000){hAt=t;const s=snapshot();hist.push(s);if(hist.length>600)hist.shift();
  el.textContent=`FPS ${s.fps}  frame ${s.frameMs}ms  p95 ${s.p95Ms}ms  máx ${s.maxMs}ms\nstep ${s.stepMs}ms  draw ${s.drawMs}ms  calls ${s.drawCalls}  tris ${s.triangles}\nenemigos ${s.enemies}/${LIM.enemies}  balas ${s.bullets}  ácido ${s.enemyBullets}/${LIM.eb}\ngemas ${s.gems}/${LIM.gems}  fx ${s.fx}  partículas ${s.particles}/${s.particlesMax}  cuerpos ${s.corpses}\nrender ${s.render.w}×${s.render.h} (×${s.render.ratio})${s.render.dyn!=null?'  res.dinámica nv '+s.render.dyn:''}`}
 requestAnimationFrame(frame)}
function toggle(v){on=v===undefined?!on:v;if(on){wrap();if(!el){el=document.createElement('pre');el.style.cssText='position:fixed;left:6px;top:84px;z-index:60;margin:0;padding:6px 8px;font:11px/1.35 ui-monospace,monospace;color:#9fffa8;background:#000b;border:1px solid #3a6;pointer-events:none;white-space:pre';document.body.appendChild(el);mkBar()}el.style.display='block';bar.style.display='flex'}else if(el){el.style.display='none';bar.style.display='none'}}
/* Copiar resultados: resumen en texto + JSON. En http://IP-local el portapapeles moderno no existe (contexto no seguro), por eso hay respaldo con execCommand
   y un cuadro de texto seleccionable. Debe llamarse desde un toque del usuario. */
let bar=null,box=null;
function resumen(){
 const h=hist.length?hist:[snapshot()],m=f=>h.reduce((a,x)=>a+f(x),0)/h.length,mx=f=>Math.max(...h.map(f)),s=h[h.length-1],pf=performance.memory;
 return`Era Z ${typeof VERSIONES!=='undefined'?(VERSIONES.candidata||VERSIONES.publicada):'?'} · diagnóstico (${h.length} muestras de 1 s, partida ${s.time}s)
FPS medio ${(1000/(m(x=>x.frameMs)||1)).toFixed(1)} · frame ${m(x=>x.frameMs).toFixed(1)} ms · p95 ${mx(x=>x.p95Ms).toFixed(1)} ms (máx. muestra) · pico ${mx(x=>x.maxMs).toFixed(1)} ms
Enemigos activos medio ${m(x=>x.enemies).toFixed(0)} / máx ${mx(x=>x.enemies)} · tope ${LIM.enemies}
Draw calls medio ${m(x=>x.drawCalls).toFixed(0)} / máx ${mx(x=>x.drawCalls)} · triángulos medio ${(m(x=>x.triangles)/1000).toFixed(0)} k
Render ${s.render.w}×${s.render.h} (×${s.render.ratio})${s.render.dyn!=null?' · res. dinámica nv '+s.render.dyn:''} · ventana ${innerWidth}×${innerHeight} · DPR ${devicePixelRatio}
Perfil gráfico ${['Automático','Alto','Bajo consumo'][M.set.pf|0]} · táctil ${INP.touch?'sí':'no'}${pf?' · heap '+(pf.usedJSHeapSize/1048576).toFixed(0)+' MB':''}
UA ${navigator.userAgent}`}
function copyText(t){
 let ok=false;
 try{if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t);ok=true}}catch(e){}
 if(!ok){const ta=document.createElement('textarea');ta.value=t;ta.readOnly=true;ta.style.cssText='position:fixed;left:6px;right:6px;bottom:60px;height:110px;z-index:70;font:11px ui-monospace,monospace;background:#000e;color:#9fffa8;border:1px solid #3a6';document.body.appendChild(ta);ta.focus();ta.select();try{ta.setSelectionRange(0,t.length);ok=document.execCommand('copy')}catch(e){}
  if(ok)setTimeout(()=>ta.remove(),400);else{ta.onblur=()=>ta.remove()}}
 return ok}
function mkBar(){bar=document.createElement('div');bar.style.cssText='position:fixed;left:6px;top:184px;z-index:61;display:flex;gap:6px';
 const b=(txt,fn)=>{const x=document.createElement('button');x.textContent=txt;x.style.cssText='font:600 12px system-ui;color:#9fffa8;background:#000c;border:1px solid #3a6;border-radius:6px;padding:7px 10px;min-height:34px;margin:0;width:auto;touch-action:manipulation';x.addEventListener('pointerdown',e=>e.stopPropagation());x.onclick=fn;bar.appendChild(x);return x};
 const c=b('Copiar',()=>{const ok=copyText(resumen());c.textContent=ok?'Copiado ✓':'Selecciona y copia';setTimeout(()=>c.textContent='Copiar',2500)});
 b('Ocultar',()=>toggle(false));document.body.appendChild(bar)}
addEventListener('keydown',e=>{if(e.code==='F3'){e.preventDefault();toggle()}});
window.ERAZ_DIAG={snapshot,toggle,resumen,copyText,get history(){return hist}};
if(q.get('debug')==='1')toggle(true);
requestAnimationFrame(frame);
})();
