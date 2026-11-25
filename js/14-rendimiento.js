/* Era Z — rendimiento y perfil móvil.
   1) optRig: fusiona las piezas estáticas de cada rig (y las de cada extremidad animada) en una malla con colores por vértice
      → muchas menos llamadas de dibujo por enemigo cercano. El LOD lejano sigue usando el rig original (RIG0).
   2) Sombras de enemigos en un único InstancedMesh (1 llamada en vez de una por enemigo).
   3) Perfil gráfico: Automático / Alto / Bajo consumo (límites de entidades y partículas). En táctil, el primer arranque usa valores bajos. */
const RIG0=Object.assign({},RIG);
const MTS=new TH.MeshLambertMaterial({vertexColors:true,map:PXT});
function bakeList(list,inv){const A=[],N=[],C=[],V=[];
 for(const o of list){const ge=o.geometry.clone();ge.applyMatrix4(inv?new TH.Matrix4().multiplyMatrices(inv,o.matrixWorld):o.matrixWorld);
  const q=ge.index?ge.toNonIndexed():ge,p=q.attributes.position.array,n=q.attributes.normal.array,u=q.attributes.uv?q.attributes.uv.array:null,col=o.material.color;
  for(let i=0;i<p.length;i+=3){A.push(p[i],p[i+1],p[i+2]);N.push(n[i],n[i+1],n[i+2]);C.push(col.r,col.g,col.b)}
  for(let i=0;i<p.length/3;i++)V.push(u?u[i*2]:0,u?u[i*2+1]:0)}
 const g=new TH.BufferGeometry();g.setAttribute('position',new TH.Float32BufferAttribute(A,3));g.setAttribute('normal',new TH.Float32BufferAttribute(N,3));
 g.setAttribute('color',new TH.Float32BufferAttribute(C,3));g.setAttribute('uv',new TH.Float32BufferAttribute(V,2));return new TH.Mesh(g,MTS)}
function optRig(g){
 g.updateMatrixWorld(true);
 const anim=new Set();for(const k in g.userData){const v=g.userData[k];for(const o of(Array.isArray(v)?v:[v]))if(o&&o.isObject3D)anim.add(o)}
 const isL=o=>o.isMesh&&o.material&&o.material.isMeshLambertMaterial;
 const gather=(root,L)=>{for(const c of root.children){if(anim.has(c))continue;if(isL(c))L.push(c);else if(c.children.length)gather(c,L)}};
 const fuse=(root,inv)=>{const L=[];gather(root,L);if(L.length<2)return;const m=bakeList(L,inv);for(const o of L)o.parent.remove(o);root.add(m)};
 const pivots=[...anim].filter(o=>!o.isMesh);
 fuse(g,null);
 for(const p of pivots)fuse(p,p.matrixWorld.clone().invert());
 return g}
for(const k of Object.keys(RIG0)){RIG[k]=()=>optRig(RIG0[k]())}
/* Sombras instanciadas */
let ESH=null;
function updShadows(on){if(!SCN)return;if(!ESH){ESH=new TH.InstancedMesh(SHG,SHM,LIM.enemies+24);ESH.frustumCulled=false;SCN.add(ESH)}
 ESH.visible=M.set.q>0;if(!ESH.visible)return;/* v0.2.1: con calidad Baja las sombras eran invisibles (opacidad 0) pero se seguían dibujando */
 let n=0;if(on){const cap=ESH.instanceMatrix.count;for(const e of E){if(e.dead||n>=cap)continue;const s=e.r*1.2*((e.boss||e.el)?e.sz:1);D3.position.set(e.x,hH(e.x,e.y)+.6,e.y);D3.rotation.set(0,0,0);D3.scale.setScalar(s);D3.updateMatrix();ESH.setMatrixAt(n++,D3.matrix)}}
 ESH.count=n;ESH.instanceMatrix.needsUpdate=true}
/* Perfil gráfico */
SO.pf=['Automático','Alto','Bajo consumo'];SL.pf='Perfil gráfico';M.set.pf=M.set.pf|0;
if(!localStorage.getItem(DEV.saveKey)&&INP.touch)Object.assign(M.set,{q:0,d:0,p:0,r:1});
/* v0.2.1 · La calidad gráfica NO toca la simulación: tope de enemigos, oleada y gemas son iguales en todos los perfiles
   (antes «Bajo consumo» y el modo táctil automático limitaban a 220/140/250, lo que cambiaba la dificultad y la XP).
   Solo varían límites puramente visuales: cadáveres, partículas y llama. */
function applyPerfProfile(){const low=M.set.pf===2||(M.set.pf===0&&INP.touch);Object.assign(LIM,{wave:230,enemies:320,gems:400},low?{corpses:60,particles:140,flame:60}:{corpses:150,particles:300,flame:160});return low}
{const s0=start;start=function(){applyPerfProfile();if(typeof FL!=='undefined'){FL.hold=0;FL.on=false;FL.acc=0;for(const p of FLP)p.on=false}s0.apply(this,arguments)}}
applyPerfProfile();

/* ===== v0.2.1 · Enemigos: modelo completo con presupuesto + lejanos instanciados (todo visual, la simulación no cambia) =====
   Antes: cada enemigo creaba su propio rig (geometría nueva, nunca liberada → fuga de GPU/heap) y el «LOD lejano» tenía los
   mismos triángulos que el cercano. Ahora: 1 plantilla horneada por tipo (clonada sin copiar geometría), un máximo de modelos
   completos según el perfil (los más cercanos) y el resto en un InstancedMesh por tipo con un modelo de baja teselación. */
const NEAR_K=[36,64,110];                      // modelos completos máximos: bajo / automático escritorio / alto
const perfLevel=()=>{const pf=M.set.pf;return pf===2||(pf===0&&INP.touch)?0:pf===1?2:1};
/* Mapas cuyas entidades crean geometría propia: se libera al desaparecer (antes quedaba en la GPU para siempre). */
const OWNMAP=new Set([MC,MR,ML,MQ,MW,MF]);
const RIGT={},FAR=new Map(),NBIN=64,NH=new Uint16Array(NBIN);let FR=0;
function cloneRig(src){
 const map=new Map(),dup=o=>{const c=o.isMesh?new TH.Mesh(o.geometry,o.material):new TH.Group();c.position.copy(o.position);c.rotation.copy(o.rotation);c.scale.copy(o.scale);c.visible=o.visible;map.set(o,c);for(const h of o.children)c.add(dup(h));return c};
 const root=dup(src),ud={};
 for(const k in src.userData){const v=src.userData[k];ud[k]=Array.isArray(v)?v.map(x=>map.get(x)||x):(v&&v.isObject3D?map.get(v):(v&&v.isVector3?v.clone():v))}
 root.userData=ud;return root}
const rigFor=k=>cloneRig(RIGT[k]||(RIGT[k]=RIG[k]()));
function farPool(k,boss){const key=k+(boss?'B':''),p=FAR.get(key);if(p)return p;
 const cap=boss?24:LIM.enemies+24,mesh=new TH.InstancedMesh(farG(k),boss?MTB:MT,cap);mesh.frustumCulled=false;mesh.count=0;SCN.add(mesh);
 const q={mesh,n:0,cap};FAR.set(key,q);return q}
function setInst(a,i,x,y,z,c,s,sc){const o=i*16;a[o]=c*sc;a[o+1]=0;a[o+2]=-s*sc;a[o+3]=0;a[o+4]=0;a[o+5]=sc;a[o+6]=0;a[o+7]=0;a[o+8]=s*sc;a[o+9]=0;a[o+10]=c*sc;a[o+11]=0;a[o+12]=x;a[o+13]=y;a[o+14]=z;a[o+15]=1}
/* Distancia² máxima para que haya como mucho K modelos completos (histograma O(n), sin ordenar ni reservar memoria). */
function nearCut(R2,K){NH.fill(0);let tot=0;const inv=NBIN/R2;
 for(const e of E){if(e.dead||e.king)continue;const d=(e.x-P.x)*(e.x-P.x)+(e.y-P.y)*(e.y-P.y);if(d<R2){NH[(d*inv)|0]++;tot++}}
 if(tot<=K)return R2;let acc=0;for(let b=0;b<NBIN;b++){acc+=NH[b];if(acc>K)return b/inv}return R2}
function syncEnemies(inG){
 if(!SCN)return;FR++;
 for(const p of FAR.values())p.n=0;
 const list=inG?E:[],R=[200,380,520][M.set.q],cut=inG?nearCut(R*R,NEAR_K[perfLevel()]):0;
 for(const e of list){
  if(e.king){let m=ME.get(e);if(!m){m=createMammothKingFor(e);ME.set(e,m);SCN.add(m)}m.userData.f=FR;updateMammothRender(m,e);continue}
  const dx=e.x-P.x,dy=e.y-P.y,near=dx*dx+dy*dy<cut,ph=T*9+e.x*.07,pte=e.k==='pte',
   y=(pte?46+Math.sin(T*3+e.x)*5:0)+hH(e.x,e.y)+Math.abs(Math.sin(ph))*(pte?0:1.8);
  let sc=(e.boss||e.el)?e.sz:1;if(e.wd){const wp=e.wu>0?1-e.wu/e.wd:0;sc*=1+wp*.3*(.6+.4*Math.sin(wp*22))}
  let m=ME.get(e);
  if(near){
   if(!m){m=new TH.Group();m.userData={rig:rigFor(e.k),f:FR};m.add(m.userData.rig);SCN.add(m);ME.set(e,m)}
   m.userData.f=FR;m.visible=true;m.position.set(e.x,y,e.y);m.rotation.y=-e.a;m.scale.setScalar(sc);
   const u=m.userData,r=u.rig.userData,s=Math.sin(ph)*.6,kb=Math.min(1,Math.hypot(e.kx||0,e.ky||0)/60);
   if(r.cu){r.lg[0].rotation.z=s;r.lg[1].rotation.z=-s;const wp=e.wu>0&&e.wd?1-e.wu/e.wd:0;r.ar[0].rotation.z=.25+Math.sin(ph+1)*.25;r.ar[1].rotation.z=.25-Math.sin(ph+1)*.25;if(r.sac)r.sac.scale.copy(r.sacS).multiplyScalar(1+wp*.9);u.rig.rotation.z=(r.rear?.4*wp:0)-kb*.4}
   else if(r.ar){r.lg[0].rotation.z=s;r.lg[1].rotation.z=-s;r.ar[0].rotation.z=1.4+Math.sin(ph+1)*.2;r.ar[1].rotation.z=1.4-Math.sin(ph+1)*.2;u.rig.rotation.z=-.12-kb*.5}
   else if(r.lg){r.lg[0].rotation.z=r.lg[3].rotation.z=s;r.lg[1].rotation.z=r.lg[2].rotation.z=-s;r.tl.rotation.y=Math.sin(ph*.8)*.5;u.rig.rotation.z=-kb*.4}
   else if(r.w){r.w[0].rotation.x=Math.sin(ph*1.6)*.9;r.w[1].rotation.x=-Math.sin(ph*1.6)*.9}
  }else{
   if(m){m.userData.f=FR;m.visible=false}
   const p=farPool(e.k,e.boss);if(p.n<p.cap)setInst(p.mesh.instanceMatrix.array,p.n++,e.x,y,e.y,Math.cos(e.a),-Math.sin(e.a),sc);
  }
 }
 for(const p of FAR.values()){p.mesh.count=p.n;p.mesh.instanceMatrix.needsUpdate=true}
 for(const [e,m] of ME)if(m.userData.f!==FR){SCN.remove(m);ME.delete(e)}
}
/* Gemas: una sola llamada de dibujo en vez de una por gema (hasta 400). */
let GI=null;
function syncGems(inG){
 if(!SCN)return;if(!GI){GI=new TH.InstancedMesh(new TH.OctahedronGeometry(4),mat('#4de0ff'),LIM.gems+8);GI.frustumCulled=false;GI.count=0;SCN.add(GI)}
 let n=0;if(inG){const cap=GI.instanceMatrix.count,a=GI.instanceMatrix.array,c=Math.cos(T*2),s=Math.sin(T*2);
  for(const g of G){if(n>=cap)break;setInst(a,n++,g.x,hH(g.x,g.y)+10+Math.sin(T*4+g.x)*2,g.y,c,s,1)}}
 GI.count=n;GI.instanceMatrix.needsUpdate=true}

/* ===== v0.2.1 · Resolución dinámica (solo visual) =====
   Solo con perfil Automático en dispositivos táctiles. Mide el tiempo medio de fotograma jugando (no en pausa ni menús) en ventanas de 1,5 s:
   si baja de ~28 FPS, reduce un nivel de resolución; si se mantiene por encima de ~45 FPS durante 4 ventanas seguidas, sube un nivel, sin pasar nunca
   del ajuste del jugador. Máximo un cambio cada 3 s. No toca ningún dato de simulación ni se guarda. */
const dyn={t:0,n:0,ok:0,since:0};
function dynFrame(ms){
 if(!R3||M.set.pf!==0||!INP.touch){if(DYN!=null){DYN=null;applyG()}return}
 if(ms<=0||ms>250)return;dyn.t+=ms;dyn.n++;if(dyn.t<1500)return;
 const avg=dyn.t/dyn.n,now=performance.now(),cur=DYN!=null?DYN:M.set.r;dyn.t=dyn.n=0;
 if(now-dyn.since<3000)return;
 if(avg>36&&cur>0){DYN=cur-1;dyn.ok=0;dyn.since=now;applyG()}
 else if(avg<22){if(++dyn.ok>=4&&cur<M.set.r){DYN=cur+1>=M.set.r?null:cur+1;dyn.ok=0;dyn.since=now;applyG()}}
 else dyn.ok=0}
{const s1=start;start=function(){DYN=null;dyn.t=dyn.n=dyn.ok=0;if(R3)applyG();return s1.apply(this,arguments)}}
