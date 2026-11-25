/* Era Z — Mamut Rey (mega jefe, minuto 10).
   Máquina de estados:  chase → wind (anticipación + aviso de suelo) → act (solo la embestida) → rec (recuperación, expuesto ×1,5) → chase.
   Ataques: embestida (trayectoria fijada y marcada), pisotón (círculo + onda expansiva), barrido de colmillos (sector frontal),
   rugido (invoca enemigos sin superar LIM.enemies). Fases por vida: 100–70 %, 70–35 %, 35–0 %.
   Reutiliza los avisos de suelo FX k:'t' (formas 'l' línea, 'c' círculo, 'a' sector) y añade FX k:'w' (onda). */
const KP={
 1:{spd:1,rec:1.7,charge:1.0,stompR:165,sweep:.75,summon:5,waves:1},
 2:{spd:1.15,rec:1.4,charge:.8,stompR:185,sweep:.65,summon:7,waves:1},
 3:{spd:1.3,rec:1.15,charge:.65,stompR:205,sweep:.55,summon:9,waves:2}};
const KDMG={charge:.9,stomp:.8,sweep:.7,wave:.45};
const kingPhase=e=>{const f=e.hp/e.mhp;return f>.7?1:f>.35?2:3};
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=6.283185;while(d<-Math.PI)d+=6.283185;return Math.abs(d)};
function kingHurt(e,m,push){if(P.bf>0||P.iv>0)return false;P.hp-=e.dm*m*P.red;HF=.5;sfx.hurt();buzz(60);if(push){const a=Math.atan2(P.y-e.y,P.x-e.x);P.x+=Math.cos(a)*push;P.y+=Math.sin(a)*push;hitObs(P,9)}return true}
sfx.roar=()=>{snd(90,1.1,'sawtooth',.16,.5);snd(140,.9,'square',.06,.4)};
sfx.stomp=()=>{snd(55,.55,'sine',.32,.3);snd(110,.3,'sawtooth',.1,.3)};
sfx.charge=()=>snd(150,.8,'sawtooth',.1,3);
sfx.sweep=()=>snd(700,.25,'sawtooth',.08,.2);
function kingInit(e){e.king=1;e.name='MAMUT REY';e.st='chase';e.stt=2.4;e.ph=1;e.last='';e.vuln=0;e.at='';toast('¡EL MAMUT REY!',3);sfx.roar();SHK=Math.max(SHK,1)}
function kingStart(e,at,dur){const k=KP[e.ph];e.st='wind';e.at=at;e.stt=e.wd=e.wu=dur;e.ta=e.a;e.last=at;
 if(at==='charge')FX.push({k:'t',sh:'l',x:e.x,y:e.y,a:e.ta,r:540,w:e.r*1.6,t:dur,d:dur});
 else if(at==='stomp')FX.push({k:'t',sh:'c',x:e.x,y:e.y,r:k.stompR,t:dur,d:dur});
 else if(at==='sweep')FX.push({k:'t',sh:'a',x:e.x,y:e.y,a:e.ta,arc:1.9,r:205,t:dur,d:dur});
 if(at==='roar')sfx.roar()}
function kingPick(e,pd){const ph=e.ph,k=KP[ph],o=[];
 o.push(['charge',pd>260?5:2],['stomp',pd<260?5:1]);
 if(ph>=2)o.push(['sweep',pd<230?5:0.5],['roar',E.length<LIM.enemies*.7?2:0]);
 const c=o.filter(x=>x[0]!==e.last&&x[1]>0),tw=c.reduce((a,x)=>a+x[1],0);let v=Math.random()*tw,at=c[0][0];for(const x of c){if(v<x[1]){at=x[0];break}v-=x[1]}
 kingStart(e,at,at==='charge'?k.charge:at==='stomp'?.9:at==='sweep'?k.sweep:.95)}
function kingFire(e){const k=KP[e.ph],at=e.at;e.wu=0;
 if(at==='charge'){e.st='act';e.stt=.95;e.hit=0;sfx.charge();return}
 if(at==='stomp'){sfx.stomp();SHK=Math.max(SHK,1);spark3(e.x,hH(e.x,e.y)+8,e.y,30,['#c9a36a','#7a6040','#ffffff'],300,.6,260);
  if(Math.hypot(P.x-e.x,P.y-e.y)<k.stompR)kingHurt(e,KDMG.stomp,90);
  for(let i=0;i<k.waves;i++)FX.push({k:'w',x:e.x,y:e.y,r:k.stompR*(i?.8:1),v:300,max:k.stompR+230,t:(k.stompR+230)/300+i*.5+.1,dl:i*.5,h:0})}
 else if(at==='sweep'){sfx.sweep();SHK=Math.max(SHK,.5);const pd=Math.hypot(P.x-e.x,P.y-e.y);if(pd<205+10&&angDiff(Math.atan2(P.y-e.y,P.x-e.x),e.ta)<.95)kingHurt(e,KDMG.sweep,110);
  for(let i=0;i<14;i++){const a=e.ta+(Math.random()-.5)*1.9,d=60+Math.random()*140;spark3(e.x+Math.cos(a)*d,hH(e.x,e.y)+20,e.y+Math.sin(a)*d,1,['#ffffff','#e8dcc0'],80,.3,0)}}
 else if(at==='roar'){sfx.roar();SHK=Math.max(SHK,.8);const n=k.summon;for(let i=0;i<n;i++){const before=E.length;spawn();if(E.length===before)break;const z=E[E.length-1],a=i/n*6.283;z.x=e.x+Math.cos(a)*170;z.y=e.y+Math.sin(a)*170;spark3(z.x,hH(z.x,z.y)+10,z.y,6,['#c9a36a','#ffffff'],120,.4,200)}}
 e.st='rec';e.stt=k.rec*(at==='sweep'?.8:1)}
function kingAct(e,dt){e.x+=Math.cos(e.ta)*560*dt;e.y+=Math.sin(e.ta)*560*dt;e.a=e.ta;
 if(Math.random()<.7)spark3(e.x-Math.cos(e.ta)*40,hH(e.x,e.y)+6,e.y-Math.sin(e.ta)*40,2,['#c9a36a','#7a6040'],70,.4,0);
 if(!e.hit&&Math.hypot(P.x-e.x,P.y-e.y)<e.r+14){e.hit=1;kingHurt(e,KDMG.charge,140);SHK=Math.max(SHK,.7)}
 if(e.stt<=0){e.st='rec';e.stt=KP[e.ph].rec*1.25;SHK=Math.max(SHK,.6);sfx.stomp()}return 0}
function kingAI(e,pd,dt){
 const ph=kingPhase(e);
 if(ph!==e.ph){e.ph=ph;e.st='wind';e.at='roar';e.stt=e.wd=e.wu=.95;e.ta=e.a;e.last='roar';toast(ph===2?'¡El Mamut Rey se enfurece!':'¡Furia final!',3);sfx.roar()}
 e.vuln=e.st==='rec';e.stt-=dt;
 if(e.st==='wind'||e.st==='act')e.a=e.ta;
 if(e.st==='wind'){e.wu=Math.max(0,e.stt);if(e.stt<=0)kingFire(e);return 0}
 e.wu=0;
 if(e.st==='act')return kingAct(e,dt);
 if(e.st==='rec'){if(Math.random()<.5)spark3(e.x+(Math.random()-.5)*60,hH(e.x,e.y)+70,e.y+(Math.random()-.5)*60,1,['#ffd84a'],40,.5,0);if(e.stt<=0){e.st='chase';e.stt=.5+Math.random()*.6}return 0}
 if(e.stt<=0)kingPick(e,pd);return KP[e.ph].spd}
/* Se llama una vez por paso desde step(): mueve las ondas de suelo y comprueba el impacto (una vez por onda). */
function kingTick(dt){for(const f of FX){if(f.k!=='w')continue;if(f.dl>0){f.dl-=dt;f.hid=1;continue}f.hid=0;f.r+=f.v*dt;
 if(!f.h&&Math.abs(Math.hypot(P.x-f.x,P.y-f.y)-f.r)<16){f.h=1;const b=E.find(q=>q.king);if(b)kingHurt(b,KDMG.wave,60)}}}
function kingBar(X,e){const w=Math.min(W*.8,520),x=(W-w)/2,y=62,ph=e.ph||1,f=Math.max(0,e.hp/e.mhp),col=['#ffb800','#ff7a1a','#e5484d'][ph-1];
 X.fillStyle='#000';X.fillRect(x-3,y-3,w+6,15);X.fillStyle='#2a2a2a';X.fillRect(x,y,w,9);X.fillStyle=col;X.fillRect(x,y,w*f,9);
 X.fillStyle='#000a';X.fillRect(x+w*.7-1,y,2,9);X.fillRect(x+w*.35-1,y,2,9);
 if(e.vuln){X.strokeStyle=(performance.now()/120|0)%2?'#fff':'#ffd84a';X.lineWidth=2;X.strokeRect(x-4,y-4,w+8,17)}
 X.font='8px "Press Start 2P",monospace';X.textAlign='center';X.fillStyle='#000';X.fillText('MAMUT REY  ·  FASE '+ph+(e.vuln?'  ·  ¡EXPUESTO!':''),W/2+1,y+25);X.fillStyle=e.vuln?'#ffd84a':'#fff';X.fillText('MAMUT REY  ·  FASE '+ph+(e.vuln?'  ·  ¡EXPUESTO!':''),W/2,y+24)}
