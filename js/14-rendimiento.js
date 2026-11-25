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
 let n=0;if(on){const cap=ESH.instanceMatrix.count;for(const e of E){if(e.dead||n>=cap)continue;const s=e.r*1.2*((e.boss||e.el)?e.sz:1);D3.position.set(e.x,hH(e.x,e.y)+.6,e.y);D3.rotation.set(0,0,0);D3.scale.setScalar(s);D3.updateMatrix();ESH.setMatrixAt(n++,D3.matrix)}}
 ESH.count=n;ESH.instanceMatrix.needsUpdate=true}
/* Perfil gráfico */
SO.pf=['Automático','Alto','Bajo consumo'];SL.pf='Perfil gráfico';M.set.pf=M.set.pf|0;
if(!localStorage.getItem('arcane1')&&INP.touch)Object.assign(M.set,{q:0,d:0,p:0,r:1});
function applyPerfProfile(){const low=M.set.pf===2||(M.set.pf===0&&INP.touch);Object.assign(LIM,low?{wave:140,enemies:220,gems:250,corpses:60,particles:140,flame:60}:{wave:230,enemies:320,gems:400,corpses:150,particles:300,flame:160});return low}
{const s0=start;start=function(){applyPerfProfile();if(typeof FL!=='undefined'){FL.hold=0;FL.on=false;FL.acc=0;for(const p of FLP)p.on=false}s0.apply(this,arguments)}}
applyPerfProfile();
