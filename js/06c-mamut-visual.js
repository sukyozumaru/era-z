/* Modelo exclusivo del Rey. Coordenadas locales: +X frente, +Y arriba. */
const mammothClamp = x => Math.max(0, Math.min(1, x));
const mammothEase = x => { x = mammothClamp(x); return x*x*(3-2*x) };
function mammothPose(e, gait, time) {
 const prep = e.st === 'wind' ? mammothEase(1-e.wu/(e.wd||1)) : 0;
 const impact = 1-mammothEase((e.impactAge ?? 2)/.38);
 const recover = e.st === 'rec' ? 1 : 0;
 const stomp = e.at === 'stomp', sweep = e.at === 'sweep', charge = e.at === 'charge';
 const roar = Math.max(e.at === 'roar' ? Math.max(prep,impact) : 0, 1-mammothEase(time/.95));
 return {
  lift: stomp ? 22*prep*(1-mammothEase((prep-.72)/.28)) : 0,
  bob: Math.sin(time*2.1)*1.4,
  pitch: (charge ? -.11*prep+.15*(e.st==='act')-.16*impact*recover : 0)-.13*roar,
  headPitch: .22*recover-.35*roar+(stomp?.14*impact:0),
  headYaw: sweep ? -.65*prep+.78*impact : 0,
  jaw: .5*roar,
  trunk: .45*roar-.32*recover+(charge ? -.38*prep : 0),
  fall: 1.36*mammothEase((e.deadAge||0)/1.1)
 };
}
/* LOD de bajo consumo: se usa con perfil «Bajo consumo» (o «Automático» en pantallas táctiles). Mantiene silueta, colmillos, fases y señales; reduce detalles secundarios y mallas. */
function mammothLow(){return typeof M!=='undefined'&&M.set&&(M.set.pf===2||(M.set.pf===0&&typeof INP!=='undefined'&&INP.touch))}
function createMammothKing(lodOverride) {
 const low=lodOverride===undefined?mammothLow():!!lodOverride;
 /* v2 (Claude): proporciones de mamut (joroba alta, lomo en pendiente, patas altas, cabeza de cúpula, trompa larga con rizo, cola),
    pelaje oscuro para contrastar con el suelo, flecos de pelo, colmillos más gruesos y señales de fase (grietas y ojos). */
 const root = new TH.Group();
 const joint = (parent,x,y,z) => { const g=new TH.Group(); g.position.set(x,y,z); parent.add(g); return g };
 const colors = ['#241a1c','#33242a','#473330','#634638','#80583f','#a07a52']; /* V3.1: tonos medios algo más claros para separar mejor del suelo */
 const box = gcg('king-unit-box',()=>new TH.BoxGeometry(1,1,1));
 const mesh = (g,x,y,z,w,h,d,color,geometry=box) => {
  const m=new TH.Mesh(geometry,sm(color)); m.position.set(x,y,z); m.scale.set(w,h,d); g.add(m); return m;
 };
 let bakedCount=0;
 const bake = g => {
  const pieces=g.children.filter(c=>c.isMesh);
  if (!pieces.length) return;
  const temp=new TH.Group();
  temp.add(...pieces);
  g.add(new TH.Mesh(gcg('king2-baked-'+bakedCount++,()=>bakeG(temp)),MT));
 };
 const BASE=76;
 const torso=joint(root,0,BASE,0);
 /* cuerpo: bloque central + joroba alta sobre los hombros + lomo en pendiente + grupa baja */
 /* V3: masas elipsoidales que se funden (cuello → joroba → lomo → grupa) en vez de cajas; el voxel queda en crin, flecos y patas */
 mesh(torso,-8,-3,0,56,28,33,colors[1],SPG);
 mesh(torso,24,31,0,31,30,34,colors[2],SPG);
 mesh(torso,25,51,0,19,11,23,colors[3],SPG);
 mesh(torso,-40,15,0,25,19,30,colors[2],SPG);
 mesh(torso,-57,-2,0,18,22,26,colors[0],SPG);
 mesh(torso,41,12,0,23,25,31,colors[2],SPG);
 /* crin dorsal */
 for(let i=0;i<8;i++){if(low&&i%2)continue;const x=-52+i*12,y=i<3?26-i*2:i<6?38+i*3:60;mesh(torso,x,y,0,11,12+(i%3)*4,26-(i%2)*8,colors[3+(i%2)])}
 /* flecos de pelo que cuelgan de los flancos y del pecho */
 if(!low)for(const side of [-1,1]) for(let i=0;i<10;i++){
  const x=-66+i*13,len=13+((i*5)%9)+(i>6?5:0);
  mesh(torso,x,-18-len/2,side*(31+(i%2)),12,len,8,colors[(i+(side>0))%3]);
 }
 if(!low)for(let i=0;i<5;i++) mesh(torso,40+i*2,-24-(i%2)*3,-20+i*10,10,16+(i%2)*6,10,colors[i%3]);
 /* cicatrices claras en los flancos */
 for(const side of [-1,1]){
  mesh(torso,8,8,side*31,34,3,3,'#b9694d').rotation.z=.55;
  if(!low)mesh(torso,-12,2,side*31,24,3,3,'#b9694d').rotation.z=.5;
 }
 /* cabeza: cúpula alta, frente y hocico */
 const head=joint(torso,55,13,0);head.scale.setScalar(1.26);
 mesh(head,9,2,0,29,30,29,colors[2],SPG);
 mesh(head,14,27,0,20,14,24,colors[3],SPG);
 mesh(head,32,-12,0,14,18,20,colors[4],SPG);
 /* V3.2: mechón sobre la frente y barba bajo la mandíbula (identidad de mamut lanudo; piezas horneadas en la cabeza, sin mallas extra) */
 mesh(head,12,43,0,17,12,22,colors[1],SPG);mesh(head,3,46,0,13,9,18,colors[0],SPG);
 mesh(head,27,-31,0,13,15,19,colors[0],SPG);mesh(head,16,-33,0,11,12,17,colors[1],SPG);
 mesh(head,22,18,0,22,6,52,colors[0]);
 const jaw=joint(head,13,-16,0);
 if(low)mesh(head,22,-24,0,35,12,35,colors[0]);else mesh(jaw,9,-8,0,35,12,35,colors[0]); bake(jaw);
 const ears=[];
 for(const s of [-1,1]){
  const ear=joint(head,-3,6,26*s);
  if(low)mesh(head,-11,5,s*35,30,38,12,colors[0]);else{mesh(ear,-8,-1,s*9,30,38,12,colors[0]);
  mesh(ear,-3,-4,s*14,20,28,8,colors[3])} bake(ear); ears.push(ear);
  const brow=mesh(head,21,14,s*22,18,5,8,colors[0]); brow.rotation.z=-.26;
  const tusk=[[27,-17,18],[37,-22,25],[50,-24,31],[63,-19,35],[74,-9,37],[82,5,35],[88,20,28],[90,32,20]];
  const extension=s>0?1.12:.98;
  const points=tusk.map(([x,y,z])=>new TH.Vector3(27+(x-27)*extension,y+(s>0?2:0),z*s));
  const axis=new TH.Vector3(1,0,0);
  for(let i=0;i<points.length-1;i++){
   const next=points[i+1], delta=next.clone().sub(points[i]), mid=points[i].clone().lerp(next,.5);
   const width=13-i*1.8;
   const segment=mesh(head,mid.x,mid.y,mid.z,delta.length()+3.2,width,width*.9,i%2?'#e6d2a6':'#f8ecca');
   segment.quaternion.setFromUnitVectors(axis,delta.normalize());
  }
 }
 bake(head);
 /* trompa de seis tramos, gruesa en la base y con rizo en la punta */
 const trunk=[];
 let link=head;
 const nTrunk=low?3:6;
 for(let i=0;i<nTrunk;i++){
  link=joint(link,i?0:41,i?-13*(6/nTrunk):-13,0);
  const w=30-i*3.6;
  mesh(link,0,-5,0,w,14,w*1.02,colors[2+i%2]);
  if(i<3) mesh(link,-1,2,0,w+3,6,w+3,colors[1]);
  bake(link); trunk.push(link);
 }
 /* patas altas: muslo peludo, rodilla y pie ancho con uñas */
 const legs=[];
 for(const [x,z] of [[38,25],[38,-25],[-48,23],[-48,-23]]){
  const hip=joint(root,x,BASE-12,z);
  mesh(hip,0,-16,0,x>0?16:15,25,15,colors[1],SPG);
  mesh(hip,3,-9,0,x>0?18:17,16,17,colors[0],SPG); bake(hip);
  const knee=joint(hip,0,-36,0);
  if(low){mesh(hip,0,-50,0,20,34,20,colors[2]);mesh(hip,3,-67,0,28,10,27,colors[1]);bake(hip)}
  else{mesh(knee,0,-14,0,20,34,20,colors[2]);
  mesh(knee,3,-31,0,28,10,27,colors[1]);
  for(const dz of [-8,0,8]) mesh(knee,17,-31,dz,5,6,5,'#d8c49a'); bake(knee)}
  legs.push({hip,knee,x,z});
 }
 /* cola con mechón */
 const tail=[];let tj=joint(torso,-74,8,0);
 const nTail=low?1:3;
 for(let i=0;i<nTail;i++){tj=joint(tj,i?0:0,i?-10:-4,0);mesh(tj,-2,-5,0,7-i,12,7-i,colors[1]);if(i===nTail-1)mesh(tj,-2,-14,0,15,16,15,colors[0]);bake(tj);tail.push(tj)}
 /* cristales temporales sobre la joroba: 5 siempre y 4 extra que aparecen en la fase 3 */
 const crystals = new TH.Group(); torso.add(crystals);
 const prism=gcg('king-crystal',()=>new TH.ConeGeometry(1,1,4));
 const shards=[],extra=[];
 [[26,62,-14,34],[14,58,8,26],[-2,50,22,24],[-20,44,-20,20],[38,40,24,22]].slice(0,low?3:5).forEach(([x,y,z,h])=>{
  const shard=mesh(crystals,x,y,z,8,h,9,'#716680',prism);shard.rotation.z=.36;shards.push(shard);
  mesh(torso,x,y-12,z,20,12,19,colors[0]);
 });
 (low?[[34,70,10,28]]:[[34,70,10,28],[8,64,-20,22],[-14,56,18,26],[44,52,-22,18]]).forEach(([x,y,z,h])=>{
  const shard=mesh(crystals,x,y,z,7,h,8,'#716680',prism);shard.rotation.z=-.3;shard.visible=false;extra.push(shard);
 });
 bake(torso);
 /* señales de fase: ojos y grietas luminosas (no se hornean: cambian de color) */
 const glowGroup=new TH.Group();torso.add(glowGroup);const glow=[];
 for(const [x,y,z,w,h,d,rz] of (low?[[10,40,32,30,3,3,.35],[10,40,-32,30,3,3,-.35]]:[[10,40,32,30,3,3,.35],[-8,30,32,26,3,3,.5],[10,40,-32,30,3,3,-.35],[-8,30,-32,26,3,3,-.5],[-40,22,0,3,3,30,0],[0,66,0,20,3,3,0]])){
  const m=mesh(glowGroup,x,y,z,w,h,d,'#ffffff');m.visible=false;m.rotation.z=rz;glow.push(m);
 }
 const eyes=[];
 for(const s of [-1,1]){const eye=mesh(head,25,8,s*25,12,10,7,'#ffb54b');eyes.push(eye)}
 /* Cambios físicos por fase: placas de hueso en el lomo (fase 2) y corona de cristal sobre la cabeza (fase 3) */
 const plates=[],crown=[],boneMat='#d8c9a3';
 for(let i=0;i<(low?2:6);i++){const m=mesh(torso,-48+i*(low?42:14),(i<2?30:i<4?46:58)+(i%2)*2,0,9,16+(i%3)*5,10,boneMat,prism);m.rotation.z=.1-i*.05;m.visible=false;plates.push(m)}
 for(const [x,z,h,rz] of [[10,0,30,0],[4,-14,22,-.25],[4,14,22,.25]].slice(0,low?2:3)){const m=mesh(head,x,42,z,9,h,9,'#716680',prism);m.rotation.z=rz;m.visible=false;crown.push(m)}
 const anchors={
  breath:joint(head,44,-10,0), crown:joint(torso,22,62,0),
  trunk:joint(trunk.at(-1),0,-12,0), leftTusk:joint(head,74,12,-30), rightTusk:joint(head,74,16,30),
  leftForefoot:joint(legs[0].knee,3,-22,0), rightForefoot:joint(legs[1].knee,3,-22,0)
 };
 /* V3.1: piezas de señal agrupadas en 1 malla por categoría (antes ~26 mallas sueltas) → mismas señales, menos llamadas de dibujo. Cada categoría comparte material y visibilidad por fase. */
 root.updateMatrixWorld(true);
 const fuse=(list,parent,color)=>{
  const g=bakeList(list,parent.matrixWorld.clone().invert()).geometry;
  const m=new TH.Mesh(g,new TH.MeshBasicMaterial({color}));
  list.forEach(o=>o.parent.remove(o));m.visible=list[0].visible;parent.add(m);return [m];
 };
 const F={shards:fuse(shards,torso,'#716680'),extra:fuse(extra,torso,'#716680'),plates:fuse(plates,torso,'#d8c9a3'),crown:fuse(crown,head,'#716680'),glow:fuse(glow,torso,'#ffad49'),eyes:fuse(eyes,head,'#ffb54b')};
 F.plates[0].material=sm(boneMat);
 root.userData={low,torso,head,jaw,ears,trunk,legs,shards:F.shards,extra:F.extra,glow:F.glow,eyes:F.eyes,tail,plates:F.plates,crown:F.crown,anchors,gait:0,baseY:BASE};
 return root;
}
function animateMammothKing(rig,e,time,dt,distance,deadAge) {
 const r=rig.userData, phase=e.ph||1, dead=deadAge||0;
 const base=r.baseY??57, tail=r.tail||[], extra=r.extra||[], glow=r.glow||[], eyes=r.eyes||[], plates=r.plates||[], crown=r.crown||[];
 const speed=dt>0 ? distance/dt : 0;
 /* Pasos sin deslizar: la fase del paso avanza lo que recorre el cuerpo dividido por lo que recorre el pie en apoyo (constante 30 ≈ 72·0,5305·amplitud, calibrada midiendo el pie en apoyo con ciclo lineal del 60 %). */
 const amp=e.st==='act'?.5:.32, strideRaw=Math.min(1,speed/95);
 r.gait+=distance/((window.KING_STRIDE_K||30)*amp*Math.max(.3,strideRaw));
 const raw=mammothPose({...e,impactAge:time-(e.kingVisualImpact??-10),deadAge:dead},r.gait,time-(e.kingVisualBorn??-10));
 /* Peso e inercia: filtro de primer orden en postura (más lento cuanto más pesado el gesto). lift, headYaw y caída van directos para no retrasar el impacto. */
 const sm=r.sm||(r.sm={...raw,lean:0,spd:0}),k=1-Math.exp(-Math.min(dt,.1)*(e.st==='wind'?9:6));
 for(const ch of ['pitch','headPitch','jaw','trunk','bob'])sm[ch]+=(raw[ch]-sm[ch])*k;
 sm.spd+=(speed-sm.spd)*(1-Math.exp(-Math.min(dt,.1)*4));
 const lean=(r.turnRate||0)*Math.min(1,sm.spd/60+.2);sm.lean+=(lean-sm.lean)*(1-Math.exp(-Math.min(dt,.1)*5));
 const pose={...raw,pitch:sm.pitch,headPitch:sm.headPitch,jaw:sm.jaw,trunk:sm.trunk,bob:sm.bob};
 const remaining=1-mammothEase(dead/.95);
 const pulse=e.vuln ? .12 : .65+.15*Math.sin(time*(phase===3?12:5));
 const hit=1-mammothEase((time-(e.kingVisualHit??-10))/.19);
 const contact=1-mammothEase((time-(e.kingVisualHitContact??-10))/.17);
 /* Segunda onda: gesto propio. Se lee de la lista de efectos (sin tocar la lógica): mientras la onda espera (dl>0) el Rey se yergue sobre las patas traseras y al emitirse cae con las dos delanteras. */
 let rear=0,slam=0;
 if(e.king&&typeof FX!=='undefined'&&dead===0){
  const sw=FX.find(f=>f.k==='w'&&f.second);
  if(sw){ if(sw.dl>0)rear=mammothEase(1-sw.dl/.5); else {if(r.secondAt===undefined){r.secondAt=time;r.secondFx=sw}} }
  if(r.secondAt!==undefined){slam=1-mammothEase((time-r.secondAt)/.4);if(time-r.secondAt>1.2){r.secondAt=undefined}}
 }
 /* Respiración y jadeo */
 const panting=e.st==='rec'?1:0,breath=Math.sin(time*(panting?5.2:1.7));
 r.torso.scale.set(1,1+(panting?.035:.016)*breath,1+(panting?.022:.01)*breath);
 /* Muerte en tres tiempos: las patas ceden, el cuerpo cae y los cristales se rompen */
 const collapse=mammothEase(dead/.5),topple=mammothEase((dead-.35)/.75);
 rig.rotation.x=1.36*topple;
 rig.position.y=-22*topple-8*collapse;
 r.torso.position.y=base+pose.bob*(e.st==='rec'?.4:1)+pose.lift*.25+Math.abs(Math.sin(r.gait))*Math.min(2,sm.spd*.02)-5*slam-14*collapse+12*rear;
 r.torso.rotation.z=(pose.pitch+pose.lift*.003-.035*hit+.09*contact-.2*rear*rear+.05*slam)*remaining;
 r.torso.rotation.x=sm.lean*-.14*remaining;
 r.head.rotation.set(0,pose.headYaw,pose.headPitch-.12*rear+.1*slam);
 r.jaw.rotation.z=-pose.jaw-(panting?.07+.06*(breath+1):0);
 r.trunk.forEach((part,i)=>{part.rotation.z=.08+i*.07+pose.trunk*(.75+i*.1)+Math.sin(time*2.6-i*.55)*.11*remaining+.3*rear*(i/Math.max(1,r.trunk.length-1));part.rotation.x=Math.sin(time*1.9-i*.4)*.07+sm.lean*.25*(i/Math.max(1,r.trunk.length-1))});
 r.ears.forEach((ear,i)=>{ear.rotation.x=(i?1:-1)*(.2+pose.jaw*.65+Math.sin(time*3+i)*.08+(panting?.12*(breath+1):0))});
 const walking=e.st==='chase'||e.st==='act';
 const stride=(walking?strideRaw:0)*remaining;
 r.legs.forEach(({hip,knee,x},i)=>{
  /* Ciclo de paso con apoyo del 60 %: en apoyo el ángulo de la cadera baja de forma LINEAL (el pie se queda quieto respecto al suelo a velocidad constante);
     en el 40 % restante la pata se balancea hacia delante con el pie levantado. */
  const cyc=((r.gait+([0,3].includes(i)?0:Math.PI))/(2*Math.PI)%1+1)%1, STANCE=.6;
  let theta,lift=0;
  if(cyc<STANCE)theta=1-2*cyc/STANCE;else{const sw=(cyc-STANCE)/(1-STANCE);theta=-1+2*mammothEase(sw);lift=Math.sin(Math.PI*sw)}
  if(dt>0&&dead===0&&x>0&&r.cycPrev&&r.cycPrev[i]!==undefined&&cyc<r.cycPrev[i]&&sm.spd>30&&typeof sfx!=='undefined'&&sfx.step)sfx.step();
  (r.cycPrev||(r.cycPrev=[]))[i]=cyc;
  hip.rotation.z=theta*amp*stride+(x>0?pose.lift*.022-.55*rear+.25*slam:0)+collapse*(i%2?.5:-.6)*(dead>0?1:0);
  knee.rotation.z=-lift*.55*stride-(x>0?pose.lift*.012+.35*rear:0)-collapse*.7;
 });
 tail.forEach((t,i)=>{t.rotation.z=Math.sin(time*2.2-i*.7)*.18*remaining+(e.st==='act'?.5:0)+.3*rear});
 /* Cristales, grietas y ojos por fase; placas de hueso (fase 2) y corona (fase 3) */
 const palette=['#716680',e.vuln?'#925316':'#ffad49',e.vuln?'#76516f':'#f07bff'];
 const color=palette[phase-1];
 const material=MAT['king-crystal'+color]||(MAT['king-crystal'+color]=new TH.MeshLambertMaterial({color,emissive:color,emissiveIntensity:phase===1||e.vuln?.08:.48}));
 const glowColor=phase===3?'#f07bff':'#ffad49',gk='king-glow'+glowColor+(e.vuln?'v':''),glowMat=MAT[gk]||(MAT[gk]=new TH.MeshBasicMaterial({color:e.vuln?'#ffe9a8':glowColor}));
 for(const g of glow){g.visible=phase>=2||!!e.vuln;g.material=glowMat}
 for(const x of extra)x.visible=phase>=3&&dead<.45;
 plates.forEach(p=>{p.visible=phase>=2&&dead<.45});crown.forEach(c=>{c.visible=phase>=3&&dead<.45;c.material=material});
 const ek='king-eye'+phase+(e.vuln?'v':''),eyeMat=MAT[ek]||(MAT[ek]=new TH.MeshBasicMaterial({color:e.vuln?'#ffffff':['#ffb54b','#ff7a1a','#f07bff'][phase-1]}));
 for(const eye of eyes){eye.material=eyeMat;eye.scale.y=(phase>=3?1.2:1)*(dead>.3?.2:1)}
 for(const shard of r.shards.concat(extra)){shard.material=material;shard.scale.x=(phase===1?1:.92+pulse*.22);if(dead>.45)shard.visible=false}
 if(dead>.45&&!r.shatterDone){r.shatterDone=true;if(typeof sfx!=='undefined'&&sfx.kingDeath)sfx.kingDeath();if(typeof spark3==='function')spark3(rig.position.x,hH(rig.position.x,rig.position.z)+70,rig.position.z,30,[phase===3?'#f07bff':'#ffad49','#ffffff'],260,.9,160)}
 if(dt>0&&dead===0){
  /* Transición de fase: estallido de cristal, temblor y latido de escala */
  if(r.lastPhase!==undefined&&phase>r.lastPhase&&typeof spark3==='function'){
   r.phaseAt=time;const col=phase===3?['#f07bff','#ffffff']:['#ffad49','#fff1c2'];
   spark3(rig.position.x,hH(rig.position.x,rig.position.z)+90,rig.position.z,34,col,280,.9,160);SHK=Math.max(SHK,.9);if(typeof sfx!=='undefined')(sfx.roarPhase||sfx.crystal)();
  }
  r.lastPhase=phase;
  const bump=r.phaseAt!==undefined?Math.max(0,1-(time-r.phaseAt)/.7):0;rig.scale.setScalar(1+.07*bump*Math.sin(Math.min(1,(time-(r.phaseAt||0))*6)*Math.PI));
  /* Polvo del paso pesado y de la embestida (respeta partículas y «Reducir efectos» vía spark3) */
  if(typeof spark3==='function'&&(e.st==='act'||(walking&&sm.spd>40))&&Math.sin(r.gait*2)>.96&&(!M.set.rf||CR()<.4))spark3(rig.position.x,hH(rig.position.x,rig.position.z)+4,rig.position.z,e.st==='act'?5:2,['#a89572','#7a6a52'],60,.5,0);
  if(slam>.9&&typeof spark3==='function')spark3(rig.position.x,hH(rig.position.x,rig.position.z)+4,rig.position.z,14,['#a89572','#fff1c2','#7a6a52'],200,.6,60);
 }
 /* Introducción: emerge del suelo con polvo y temblor suave (solo visual; la simulación ya espera 2,4 s antes del primer ataque) */
 const born=time-(e.kingVisualBorn??-10);
 if(dead===0&&born>=0&&born<1.3){
  rig.position.y=-34*(1-mammothEase(born/1.3));
  if(dt>0&&typeof spark3==='function'&&(!M.set.rf||CR()<.5))spark3(rig.position.x,hH(rig.position.x,rig.position.z)+4,rig.position.z,3,['#a89572','#6a5a44'],110,.7,0);
  if(r.introAt===undefined){r.introAt=time;SHK=Math.max(SHK,.8)}
 }
}

function updateMammothRender(model,e) {
 const r=model.userData;
 const dt=Math.max(0,Math.min(.1,T-(r.time??T)));
 const distance=r.time===undefined?0:Math.hypot(e.x-r.x,e.y-r.y);
 if(r.time===undefined)model.rotation.y=-e.a;
 const target=-(e.st==='wind'||e.st==='act'||e.st==='rec' ? (e.ta??e.a) : e.a);
 const delta=target-model.rotation.y;
 const turn=Math.atan2(Math.sin(delta),Math.cos(delta));
 /* Giro con inercia: más lento al caminar (cuerpo pesado), más ágil al fijar un ataque */
 const rate=(e.st==='wind'||e.st==='act')?12:5.5, f=1-Math.exp(-dt*rate);
 model.rotation.y+=turn*f;
 r.turnRate=dt>0?Math.max(-4,Math.min(4,turn*f/dt)):0;
 model.position.set(e.x,hH(e.x,e.y),e.y);
 animateMammothKing(model,e,T,dt,distance,0);
 Object.assign(r,{time:T,x:e.x,y:e.y});
}
/* Punto de entrada que usa el render. El laboratorio (06d) lo sustituye para elegir prototipo/V2; en el juego siempre crea la versión actual. */
function createMammothKingFor(e){return createMammothKing(e&&e.kingLod)}
