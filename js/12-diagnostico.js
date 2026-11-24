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
  drawCalls:inf.calls,triangles:inf.triangles,state:S,time:+(T||0).toFixed(1)}}
function frame(t){if(lastT){ft[fi]=t-lastT;fi=(fi+1)%N;fn=Math.min(N,fn+1)}lastT=t;
 if(on&&t-hAt>1000){hAt=t;const s=snapshot();hist.push(s);if(hist.length>600)hist.shift();
  el.textContent=`FPS ${s.fps}  frame ${s.frameMs}ms  p95 ${s.p95Ms}ms  máx ${s.maxMs}ms\nstep ${s.stepMs}ms  draw ${s.drawMs}ms  calls ${s.drawCalls}  tris ${s.triangles}\nenemigos ${s.enemies}/${LIM.enemies}  balas ${s.bullets}  ácido ${s.enemyBullets}/${LIM.eb}\ngemas ${s.gems}/${LIM.gems}  fx ${s.fx}  partículas ${s.particles}/${s.particlesMax}  cuerpos ${s.corpses}`}
 requestAnimationFrame(frame)}
function toggle(v){on=v===undefined?!on:v;if(on){wrap();if(!el){el=document.createElement('pre');el.style.cssText='position:fixed;left:6px;top:6px;z-index:60;margin:0;padding:6px 8px;font:11px/1.35 ui-monospace,monospace;color:#9fffa8;background:#000b;border:1px solid #3a6;pointer-events:none;white-space:pre';document.body.appendChild(el)}el.style.display='block'}else if(el)el.style.display='none'}
addEventListener('keydown',e=>{if(e.code==='F3'){e.preventDefault();toggle()}});
window.ERAZ_DIAG={snapshot,toggle,get history(){return hist}};
if(q.get('debug')==='1')toggle(true);
requestAnimationFrame(frame);
})();
