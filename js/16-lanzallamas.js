/* Era Z — Lanzallamas rediseñado (ERAZ-002 / ERAZ-003).
   Problemas del diseño anterior (medidos, ver docs/AUDITORIA-LANZALLAMAS.md):
   · el cono visible (triángulo estrecho) no coincidía con el área de daño (cono ancho),
   · cada impacto empujaba al enemigo hasta sacarlo de su propio alcance (daño intermitente),
   · apenas escalaba con el nivel (+12 % de DPS entre nv.1 y nv.5).
   Ahora: arma de control de hordas a corta distancia con daño por ticks fijos de 0,1 s (independiente del framerate),
   cono de daño = cono visible, sin retroceso, quemadura residual y llamas dibujadas con un pool de partículas instanciado. */
const FLC={range:l=>110+12*(l-1),half:l=>(28+2*(l-1))*Math.PI/180,direct:l=>.20*(1+.2*(l-1)),burn:l=>.6*(1+.15*(l-1)),burnT:l=>2.2+.3*(l-1),tick:.1};
const FL={on:false,a:0,range:0,half:0,l:0,acc:0,hold:0};
/* Daño de fuego: sin retroceso, sin números por tick; los números se agregan cada 0,5 s por enemigo. */
function flameHit(e,d){if(e.dead)return;hit(e,d,{nk:1,q:1});e.fd=(e.fd||0)+d;
 if(!e.dead&&T-(e.fdt||-9)>.5&&DN.length<40){e.fdt=T;DN.push({x:e.x,y:e.y,z:hH(e.x,e.y)+36,t:.7,s:Math.max(1,Math.round(e.fd)),cr:false,c:'#ff9a3c'});e.fd=0}}
function flameTick(l,R,half){const d=P.dmg*FLC.direct(l),bd=P.dmg*FLC.burn(l),bt=FLC.burnT(l);
 for(const e of E){if(e.dead)continue;const dx=e.x-P.x,dy=e.y-P.y,dist=Math.hypot(dx,dy);if(dist>R+e.r*.6)continue;
  if(angDiff(Math.atan2(dy,dx),FL.a)>half+Math.atan2(e.r*.6,Math.max(dist,1)))continue;
  flameHit(e,d*(e.boss?.7:1));if(!e.dead){e.bn=bt;e.bd=bd*(e.boss?.5:1)}}}
function flameUpdate(dt){const l=Math.min(5,WS.flame),R=FLC.range(l),half=FLC.half(l);let t=null,bd=1e18;/* distancia al borde del cuerpo: los enemigos grandes (jefes) también activan el arma */for(const e of E){if(e.dead)continue;const d=Math.hypot(e.x-P.x,e.y-P.y)-e.r*.6;if(d<R+10&&d<bd){bd=d;t=e}}
 if(t){FL.hold=.18;FL.a=Math.atan2(t.y-P.y,t.x-P.x)}else FL.hold-=dt;
 FL.on=FL.hold>0;FL.range=R;FL.half=half;FL.l=l;if(!FL.on){FL.acc=0;return}
 P.a=FL.a;P.f=Math.cos(FL.a)>=0?1:-1;
 FL.acc+=dt;let n=0;while(FL.acc>=FLC.tick&&n<3){FL.acc-=FLC.tick;n++;flameTick(l,R,half)}if(n===3)FL.acc=0}
/* Quemadura residual: se procesa en step() para cada enemigo con e.bn>0 (ticks de 0,25 s). */
function burnUpdate(e,dt){e.bn-=dt;e.ba=(e.ba||0)+dt;if(e.ba>=.25){e.ba-=.25;flameHit(e,e.bd*.25);if(!e.dead&&Math.random()<.5)spark3(e.x,hH(e.x,e.y)+20,e.y,1,['#ff9a3c','#ff5a10'],35,.45,0)}}
/* Llamas: pool fijo de cubos voxel con mezcla aditiva en un único InstancedMesh (1 llamada de dibujo). */
const FLN=200,FLP=[];let FLI=null,flT=0,flEm=0;
function updFlame(inG){if(!SCN)return;const now=performance.now(),dt=flT?Math.min(.05,(now-flT)/1000):0;flT=now;
 if(!FLI){FLI=new TH.InstancedMesh(new TH.BoxGeometry(1,1,1),new TH.MeshBasicMaterial({transparent:true,opacity:.95,depthWrite:false,blending:TH.AdditiveBlending}),FLN);
  FLI.frustumCulled=false;FLI.instanceMatrix.setUsage(TH.DynamicDrawUsage);for(let i=0;i<FLN;i++)FLP.push({x:0,y:0,z:0,vx:0,vy:0,vz:0,s0:1,s1:1,t:0,l:0,r:0,em:0,on:false});
  FLI.setColorAt(0,new TH.Color(0));FLI.count=0;SCN.add(FLI)}
 const play=S==='play'&&inG,cap=Math.min(FLN,LIM.flame||160),fx=(M.set.rf?.5:1);

 if(play&&FL.on){flEm+=dt*(60+12*FL.l)*(cap/160)*fx;while(flEm>=1){flEm--;let p=null;for(const q of FLP)if(!q.on){p=q;break}if(!p)break;
   const em=Math.random()<.14,a=FL.a+(Math.random()*2-1)*FL.half*.9,life=em?.7+Math.random()*.3:.34+Math.random()*.2,sp=em?(FL.range/life)*(.7+Math.random()*.5):(FL.range/life)*(.85+Math.random()*.25);
   p.on=true;p.em=em;p.t=0;p.l=life;p.x=P.x+Math.cos(FL.a)*14+(Math.random()-.5)*4;p.z=P.y+Math.sin(FL.a)*14+(Math.random()-.5)*4;p.y=hH(P.x,P.y)+22;
   p.vx=Math.cos(a)*sp;p.vz=Math.sin(a)*sp;p.vy=em?40+Math.random()*60:10+Math.random()*30;p.s0=em?1.4:3;p.s1=em?.5:9+FL.l;p.r=Math.random()*6}}
 let n=0;const c=new TH.Color();
 for(const p of FLP){if(!p.on)continue;if(play||!inG){p.t+=play?dt:0}if(!inG||p.t>=p.l){p.on=false;continue}
  const k=p.t/p.l;if(play){p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=p.vy*dt;p.vy+=(p.em?-30:60)*dt;p.vx*=1-.8*dt;p.vz*=1-.8*dt}
  const s=p.s0+(p.s1-p.s0)*k;D3.position.set(p.x,p.y,p.z);D3.rotation.set(p.r+k*3,p.r*1.7+k*2,0);D3.scale.setScalar(s);D3.updateMatrix();FLI.setMatrixAt(n,D3.matrix);
  /* gradiente: blanco-amarillo → naranja → rojo → oscuro (negro = invisible con mezcla aditiva) */
  if(p.em)c.setRGB(1,.55-.3*k,.1).multiplyScalar(1-k*.8);else if(k<.25)c.setRGB(1,.95-k*1.5,.55-k*1.6);else if(k<.6)c.setRGB(1,.6-(k-.25)*1.2,.12);else c.setRGB(.9-(k-.6)*2.2,.18,.08).multiplyScalar(Math.max(0,1-(k-.6)*1.6));
  FLI.setColorAt(n,c);n++}
 FLI.count=n;FLI.instanceMatrix.needsUpdate=true;if(FLI.instanceColor)FLI.instanceColor.needsUpdate=true}
