const IC=['🩹','🥾','🔋','🛡️','🔭','🧰','🦺','🔗','🦷','🪖','☢️','👟','⚛️','⏰','☕','📻','🗡️','🥽','🎒','🔰','📡','🧪','🎭','☀️','📿','🔌','🧵','☘️','🧲','🦴'],IW={shot:'💥',gren:'💣',tesla:'⚡',mini:'🔫',molo:'🍾',flame:'🔥',snipe:'🎯',storm:'🌩️',pulse:'🌀',lanza:'🔱'};
const EM=p=>p.t==='i'?IC[p.i]:IW[p.k],fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
const PS={piel:0,meta:0,instinto:0,espinas:0,suerte:0,mente:0};
const PV={piel:['Piel dura','🧱','-8% daño recibido',P=>P.red*=.92],meta:['Metabolismo','🧬','+0,6 vida/s',P=>P.reg+=.6],instinto:['Instinto asesino','🎯','+8% golpe crítico',P=>P.crit+=.08],espinas:['Espinas','🌵','Dañan a quien te toca',P=>P.th+=10],suerte:['Suerte','🍀','Mejores cofres',P=>P.luck++],mente:['Mente clara','🧠','+12% XP',P=>P.xpm*=1.12]};
let S='menu',P=null,E=[],B=[],EB=[],G=[],FX=[],CH=[],NC=0,RIn=0,T=0,K=0,sp=0,gain=0,jx=0,jy=0,jo=null;
const WS={shot:0,gren:0,tesla:0,mini:0,molo:0,flame:0,snipe:0,storm:0,pulse:0,lanza:0},CD={shot:0,gren:0,tesla:0,mini:0,molo:0,flame:0,snipe:0,storm:0,pulse:0,lanza:0},keys={w:0,a:0,s:0,d:0};
const KM={KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',ArrowUp:'w',ArrowLeft:'a',ArrowDown:'s',ArrowRight:'d'};
addEventListener('keydown',e=>{const k=KM[e.code];if(k){INP.touch=false;keys[k]=1;if(S==='play')e.preventDefault()}});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)keys[k]=0});
addEventListener('blur',()=>{keys.w=keys.a=keys.s=keys.d=0;jo=null;jx=jy=0});
/* Atajos de teclado: 1/2/3 eligen carta (nivel/cofre), Enter confirma el botón principal */
addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;
 if(S==='lvl'&&/^[1-3]$/.test(e.key)){const b=U.querySelectorAll('button.card')[+e.key-1];if(b){e.preventDefault();b.click()}}
 else if(S==='dead'&&e.key==='Enter'){const b=document.getElementById('bk');if(b){e.preventDefault();b.click()}}});
/* Entrada táctil (ERAZ-001): cada dedo se gestiona por pointerId. El primer toque fuera de botones y paneles es el joystick;
   DASH y pausa reaccionan a su propio pointerdown y no tocan el estado del joystick. El ratón nunca crea joystick. */
addEventListener('pointerdown',e=>{INP.touch=e.pointerType!=='mouse';if(e.pointerType==='mouse'||jo)return;if(e.target.closest&&e.target.closest('button,.pn'))return;jo={x:e.clientX,y:e.clientY,id:e.pointerId}});
addEventListener('pointermove',e=>{if(!jo||e.pointerId!==jo.id)return;jx=Math.max(-1,Math.min(1,(e.clientX-jo.x)/50));jy=Math.max(-1,Math.min(1,(e.clientY-jo.y)/50))});
const up=e=>{if(jo&&e&&e.pointerId!==jo.id)return;jo=null;jx=jy=0};['pointerup','pointercancel','lostpointercapture'].forEach(t=>addEventListener(t,up));

const RC=['#9aa0a6','#4aa3ff','#b56bff','#ffb800'],RN=['Común','Raro','Épico','Legendario'];
const hl=n=>P=>{P.mhp+=n;P.hp+=n};
const IT=[
["Vendas sucias",0,"+20 vida",hl(20)],
["Botas gastadas",0,"+8% velocidad",P=>P.spd*=1.08],
["Cargador extra",0,"+10% cadencia",P=>P.rate*=1.1],
["Placa de acero",1,"-15% daño recibido",P=>P.red*=.85],
["Mira telescópica",1,"+20% daño",P=>P.dmg*=1.2],
["Botiquín militar",1,"Regenera 1 vida/s",P=>P.reg+=1],
["Chaleco antibalas",2,"-25% daño recibido y +40 vida",P=>{P.red*=.75;hl(40)(P)}],
["Cinturón de munición",2,"+30% cadencia",P=>P.rate*=1.3],
["Colmillo de zombi",2,"Curas 2 vida por baja",P=>P.vamp+=2],
["Casco del Centinela",3,"+80 vida y -20% daño recibido",P=>{hl(80)(P);P.red*=.8}],
["Corazón Radiactivo",3,"Regenera 3 vida/s",P=>P.reg+=3],
["Botas de Hermes",3,"+35% velocidad e imán x2",P=>{P.spd*=1.35;P.mag*=2}],
["Núcleo Nuclear",3,"+70% daño",P=>P.dmg*=1.7],
["Reloj del Apocalipsis",3,"+50% cadencia y +30% XP",P=>{P.rate*=1.5;P.xpm*=1.3}],
["Termo de café",0,"+12% velocidad",P=>P.spd*=1.12],["Radio de campaña",0,"+15% XP",P=>P.xpm*=1.15],["Cuchillo de combate",0,"+8% crítico",P=>P.crit+=.08],
["Gafas nocturnas",1,"+10% crítico e imán x1,4",P=>{P.crit+=.1;P.mag*=1.4}],["Mochila táctica",1,"+40 vida y +10% cadencia",P=>{hl(40)(P);P.rate*=1.1}],
["Escudo antidisturbios",2,"-35% daño recibido",P=>P.red*=.65],["Detonador remoto",2,"Los enemigos explotan al morir",P=>P.boom=1],
["Sangre del primer zombi",3,"+25% daño y curas 5 por baja",P=>{P.dmg*=1.25;P.vamp+=5}],["Máscara del Rey Zombi",3,"+60% daño y +20% crítico",P=>{P.dmg*=1.6;P.crit+=.2}],["Generador solar",3,"+60% cadencia y regenera 1,5/s",P=>{P.rate*=1.6;P.reg+=1.5}],
["Amuleto de colmillo",1,"+15% daño y +5% crítico",P=>{P.dmg*=1.15;P.crit+=.05}],["Pila de litio",1,"+20% cadencia",P=>P.rate*=1.2],["Kit de sutura",2,"Regenera 2 vida/s",P=>P.reg+=2],["Trébol fosilizado",2,"Mejores cofres (+1 suerte)",P=>P.luck++],["Imán de neodimio",1,"Imán x1,8",P=>P.mag*=1.8],["Corona de huesos",3,"+40% XP y +25% daño",P=>{P.xpm*=1.4;P.dmg*=1.25}]];
const WP={shot:["Escopeta",1,"Ráfaga de perdigones"],gren:["Granadas",2,"Explosiones en área"],tesla:["Rayo Tesla",2,"Cadena eléctrica"],mini:["Minigun",3,"Fuego rapidísimo"],molo:["Molotov",1,"Charco de fuego"],flame:["Lanzallamas",2,"Cono de fuego"],snipe:["Rifle de precisión",2,"Bala perforante"],storm:["Tormenta eléctrica",3,"Rayos del cielo"],pulse:["Onda de choque",2,"Empuja y daña alrededor"],lanza:["Lanza de sílex",1,"Lanza perforante"]};
const POOLP=[...IT.map((x,i)=>({n:x[0],r:x[1],d:x[2],t:'i',i})),...Object.entries(WP).map(([k,x])=>({n:x[0],r:x[1],d:x[2],t:'w',k}))];
function roll(wt){let v=Math.random()*100,r=0;for(;r<3&&v>=wt[r];r++)v-=wt[r];const l=POOLP.filter(p=>p.r===r);return l[Math.random()*l.length|0]}
