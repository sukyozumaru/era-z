/* Era Z — simulador de partidas para medir el balance (herramienta de desarrollo; NO se carga en el juego).
   Uso en la consola del juego (servido en local):
     eval(await (await fetch('docs/herramientas/simulador.js')).text());
     SIM.run({seed:101, ch:0, mode:0, policy:'equilibrada'})  → resumen de ERAZ_STATS
   · Sin render, dt fijo (1/30 s por defecto) y Math.random sembrado: misma semilla + misma versión = misma partida.
   · Perfil limpio: sin mejoras del Taller, objetos, armas ni reliquias permanentes (se restaura el guardado al terminar).
   · El jugador es un BOT: huye de enemigos, esquiva avisos de suelo y ácido, recoge gemas y cofres, usa dash.
     Es un sustituto aproximado de un jugador humano competente, NO una prueba humana. */
window.SIM=(()=>{
const WN=Object.values(WP).map(w=>w[0]);
function owned(){return Object.keys(WS).filter(k=>WS[k]).length}
function score(name,policy){
 if(policy==='aleatoria')return Math.random();
 if(policy==='fuego'){if(/Lanzallamas|Molotov/.test(name))return 9}
 if(policy==='electricidad'){if(/Tesla|Tormenta/.test(name))return 9}
 if(policy==='cazajefes'){if(/Rifle|Minigun|Daño|Mira|Núcleo|crítico/.test(name))return 9}
 if(policy==='resistencia'){if(/Vida|Piel|Metabolismo|Placa|Chaleco|Escudo|Casco|Botiquín|regenera|vida/i.test(name))return 9}
 const isW=WN.find(w=>name.startsWith(w)||name.startsWith('Arma: '+w));
 if(isW&&/nv\./.test(name))return 5;
 if(isW)return owned()<4?4:.5;
 if(/^Daño/.test(name))return 3.6;if(/^Cadencia/.test(name))return 3.3;if(/proyectil/.test(name))return 3.1;
 if(/^Vida/.test(name))return P.hp<P.mhp*.5?4.2:2.4;if(/^Sierra/.test(name))return 2.6;if(/ nv\.\d/.test(name))return 2.3;
 if(/^Velocidad/.test(name))return 2;if(/^Imán/.test(name))return 1.6;return 2.5}
function choose(policy){const cs=[...U.querySelectorAll('.lvl .card')];if(!cs.length)return false;
 let best=0,bs=-1;cs.forEach((c,i)=>{const n=c.querySelector('b').textContent;let s=score(n,policy);const col=c.querySelector('b').style.color;const r=RC.indexOf((col.match(/#[0-9a-f]{6}/i)||[''])[0]);if(r>=0&&policy!=='aleatoria')s+=r*.4;if(s>bs){bs=s;best=i}});
 cs[best].click();return true}
function segDist(px,py,f){const ex=f.x+Math.cos(f.a)*f.r,ey=f.y+Math.sin(f.a)*f.r;return segD(f.x,f.y,ex,ey,px,py)}
/* Bot de movimiento: evalúa 16 direcciones (y quedarse quieto) prediciendo la posición a 0,25 s y 0,5 s;
   penaliza cercanía de enemigos (más los jefes/élites), zonas de aviso, ácido y ondas; premia gemas, orbes de curación y cofres. */
function inTele(x,y){let pen=0;for(const f of FX){if(f.k==='t'){const dx=x-f.x,dy=y-f.y,d=Math.hypot(dx,dy);
  if(f.sh==='c'&&d<f.r+18)pen+=40;else if(f.sh==='a'&&d<f.r+18&&angDiff(Math.atan2(dy,dx),f.a)<f.arc/2+.3)pen+=40;else if(f.sh==='l'&&segDist(x,y,f)<f.w/2+20)pen+=40}
  else if(f.k==='w'&&!f.hid){const d=Math.hypot(x-f.x,y-f.y);if(Math.abs(d-(f.r+f.v*.25))<22)pen+=25}}return pen}
function danger(x,y){let s=0;for(const e of E){if(e.dead)continue;const d=Math.hypot(x-e.x,y-e.y)-e.r-10;if(d<220){const w=e.boss?3:e.el?1.8:1;s+=w*(d<=0?60:Math.min(60,900/(d*d+30)))}}
 for(const b of EB){const bx=b.x+b.vx*.25,by=b.y+b.vy*.25,d=Math.hypot(x-bx,y-by);if(d<40)s+=30}return s+inTele(x,y)}
function bot(){const sp=P.spd;let best=null,bv=1e18;
 let g=null,gd=1e9;for(const q of G){const d=Math.hypot(q.x-P.x,q.y-P.y);if(d<gd){gd=d;g=q}}
 const heal=OB.find(o=>o.r===0&&P.hp<P.mhp*.6),c=CH[0];
 for(let i=-1;i<16;i++){const a=i*Math.PI/8,dx=i<0?0:Math.cos(a),dy=i<0?0:Math.sin(a);
  const x1=P.x+dx*sp*.25,y1=P.y+dy*sp*.25,x2=P.x+dx*sp*.5,y2=P.y+dy*sp*.5;let v=danger(x1,y1)+.7*danger(x2,y2);
  if(g&&gd<520)v-=2.2*(gd-Math.hypot(g.x-x2,g.y-y2))/(sp*.5);
  if(heal){const d0=Math.hypot(heal.x-P.x,heal.y-P.y);if(d0<700)v-=4*(d0-Math.hypot(heal.x-x2,heal.y-y2))/(sp*.5)}
  if(c){const d0=Math.hypot(c.x-P.x,c.y-P.y);if(d0<900)v-=1.5*(d0-Math.hypot(c.x-x2,c.y-y2))/(sp*.5)}
  if(v<bv){bv=v;best=[dx,dy]}}
 jx=best[0];jy=best[1];
 if(P.dc<=0&&danger(P.x,P.y)>45)dash()}
function spinSync(mode){const g=mode==='gamble',L=g?0:P.luck,res=roll(mode==='wheel'?[12,28,34,26]:g?[22,30,28,20]:[Math.max(10,45-5*L),30,18+3*L,7+2*L]);ST.pick('ruleta',[res.n],res.n);ST.reward('ruleta');give(res,!g);S='play';U.innerHTML=''}
function run(o={}){const render=!!o.render,seed=o.seed??1,ch=o.ch??0,mode=o.mode??0,policy=o.policy||'equilibrada',maxT=o.maxT??660,dt=o.dt??1/30,clean=o.clean!==false;
 const backup=JSON.stringify(M),spin0=spin,t0=performance.now(),drawMs=[];
 if(clean)Object.assign(M,{d:0,h:0,s:0,x:0,own:{},w:{},eq:[]});M.ch=ch;M.seen=1;
 spin=spinSync;ST.simMode=true;ST.forceSeed=seed;MD=MODES[mode];MI=mode;jo=null;jx=jy=0;for(const k in keys)keys[k]=0;
 start();S='play';U.innerHTML='';let n=0,win=false;const cap=Math.ceil(maxT/dt)+10;
 try{while(T<maxT&&n<cap){if(S==='lvl'){if(!choose(policy)){S='play';U.innerHTML=''}continue}if(S!=='play')break;if(WON){win=true;die();break}bot();step(dt);n++;if(render){const t1=performance.now();flT=performance.now()-dt*1000;draw();drawMs.push(performance.now()-t1)}}
  if(S==='play'&&!WON){ST.end('tiempo límite')}}
 finally{spin=spin0;ST.simMode=false;Object.keys(M).forEach(k=>delete M[k]);Object.assign(M,JSON.parse(backup));save();jx=jy=0;S='menu';UI.home()}
 const s=ST.summary(ST.run);if(render&&drawMs.length){const a=drawMs.slice().sort((x,y)=>x-y);s.drawMs={medio:+(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2),p95:+a[Math.floor(a.length*.95)].toFixed(2),max:+a[a.length-1].toFixed(2)}}s.politica=policy;s.pasos=n;s.msReales=Math.round(performance.now()-t0);s.dt=+dt.toFixed(4);return s}
return{run,score,bot}})();
