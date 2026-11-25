/* Integración interna. El reloj de misión se separa del tiempo de combate. */
const LAB = (() => {
 const calendar = [
  [0,'basicos'],[60,'corredores'],[120,'elite'],[180,'especiales'],[240,'elite'],
  [300,'horda'],[360,'minijefe'],[420,'variantes'],[480,'minijefe'],[540,'horda'],[600,'mamut'],
 ];
 const gates = {a:0,b:60,c:60,spit:180,bom:180,rap:420,pte:420,sab:420,tri:420,mam:420};
 const objective = document.createElement('div');
 objective.id = 'lab-objective';
 objective.hidden = true;
 WR.append(objective);
 let next, mission, pending, hordeUntil, restUntil, bossWasAlive, inArena, visited, portal;
 let arenaSeconds, nextThreat, warned, opened;
 const arenaPhases=[
  {until:15,interval:2.5,batch:1,cap:18},
  {until:60,interval:1.6,batch:2,cap:44},
  {until:80,interval:1.0,batch:3,cap:66},
  {until:90,interval:.8,batch:4,cap:82},
 ];
 const picked = new Set();
 function reset() {
  next=0; mission=0; pending=[]; hordeUntil=0; restUntil=0; bossWasAlive=false;
  inArena=null; visited=false; portal=null; arenaSeconds=0; nextThreat=2.5; warned=false; opened=false;
  picked.clear(); objective.hidden=true;
 }
 function finishArena(completed) {
  if (!inArena) return;
  const state=inArena;
  inArena=null;
  ({E,B,EB,G,FX,CH,OB,RP,OBL,PT,NT,WO,NC,NB,WN,sp,CPS}=state);
  PA.length=0; DN.length=0;
  P.x=state.x; P.y=state.y;
  WN+=K-state.kills;
  const elapsed=T-state.time;
  // Combat timers keep advancing inside. Shift only the exterior deadlines.
  for(const k of Object.keys(NT)) NT[k]+=elapsed;
  NC+=elapsed;
  if(!DEV.director) NB+=elapsed;
  portal=null;
  objective.hidden=true;
  if(completed){
   M.st.pt++;
   BG+=15;
   ST.reward('expedición');
   if(ST.run?.expedition)ST.run.expedition.exit={xp:ST.xpTotal(),level:P.lvl,simTime:T,coins:coinsAtStake()};
   toast('EXTRACCIÓN COMPLETA',3);
   sfx.lvl();
  }
 }
 function enterArena() {
  if(ST.run)ST.run.expedition={entry:{xp:ST.xpTotal(),level:P.lvl,simTime:T,coins:coinsAtStake(),mission}};
  inArena={E,B,EB,G,FX,CH,OB,RP,OBL,PT,NT,WO,NC,NB,WN,sp,CPS,x:P.x,y:P.y,time:T,kills:K,threat:mission};
  visited=true; portal=null;
  E=[]; B=[]; EB=[]; G=[]; FX=[]; CH=[]; OB=[]; RP=[]; OBL=[]; PT=[];
  NT={o:Infinity,r:Infinity,b:Infinity,p:Infinity};
  WO=null; NC=Infinity; NB=Infinity; WN=Infinity; sp=Infinity;
  CPS=[]; PA.length=0; DN.length=0;
  P.x=18000; P.y=18000;
  const tier=Math.min(4,Math.floor(mission/120));
  for(let i=0;i<5+tier*2;i++)spawn('portal');
  flash(); toast('ANOMALÍA · 90 s',3);sfx.roar();
 }
 function flash(){
  WR.classList.remove('lab-rift'); void WR.offsetWidth;
  if(!M.set.rf) WR.classList.add('lab-rift');
 }
 function advance(dt) {
  if(!DEV.enabled) return;
  if(inArena){
   arenaSeconds+=dt;
   if(arenaSeconds>=90-1e-8)arenaSeconds=90;
   if(arenaSeconds>=80&&!warned){warned=true;toast('EXTRACCIÓN · 10 s',3);sfx.lvl();}
   if(arenaSeconds>=90){finishArena(true);flash();return;}
   while(nextThreat<90&&arenaSeconds+1e-8>=nextThreat){
    const phase=arenaPhases.find(p=>nextThreat<p.until);
    const tier=Math.min(4,Math.floor(inArena.threat/120));
    const cap=Math.min(phase.cap+tier*4,LIM.enemies-4);
    const batch=phase.batch+(tier>=3?1:0)+MD.x;
    for(let i=0;i<batch&&E.length<cap;i++)spawn('portal');
    nextThreat+=phase.interval;
   }
   return;
  }
  mission+=dt;
  if(DEV.director){
   const hasBoss=E.some(e=>e.boss&&!e.dead);
   if(!hasBoss&&bossWasAlive)restUntil=mission+12;
   bossWasAlive=hasBoss;
   while(next<calendar.length&&calendar[next][0]<=mission+1e-8){
    const [time,event]=calendar[next++];
    if(event==='horda'){hordeUntil=time+25;toast('HORDA TEMPORAL',3);}
    if(event==='mamut'){
     // Finale deadline: retire unresolved minijefes without triggering kill rewards.
     E=E.filter(e=>!e.labMiniboss);
     pending=pending.filter(kind=>kind!=='minijefe');
     restUntil=mission;
    }
    if(['elite','minijefe','mamut'].includes(event))pending.push(event);
   }
   if(!E.some(e=>e.boss&&!e.dead)&&mission>=restUntil&&pending.length&&E.length<LIM.enemies){
    const final=pending.indexOf('mamut'), index=final>=0?final:0;
    const event=pending[index];
    if(event==='elite')spawn('elite');
    else {bossSpawn(event==='mamut'?2:1,event==='mamut');if(event==='minijefe')E.at(-1).labMiniboss=true;bossWasAlive=true;}
    pending.splice(index,1);
   }
  }
  if(DEV.portal&&!visited&&mission>=80){
   // Place the portal in reachable space near the player and give it two seconds to open.
   if(!opened){portal={x:P.x+135,y:P.y,t:-1,opening:mission};PT.push(portal);opened=true;toast('ANOMALÍA CERCANA · busca el aro violeta',3);}
   if(portal&&mission>=82&&Math.hypot(P.x-portal.x,P.y-portal.y)<34&&!E.some(e=>e.king&&!e.dead)){
    PT=PT.filter(p=>p!==portal);
    enterArena();
   }
  }
 }
 function waveCap() {
  if(inArena)return 0;
  if(!DEV.director)return LIM.wave;
  if(mission<restUntil)return 0;
  const cap=mission<60?40:mission<120?80:LIM.wave;
  return Math.min(LIM.enemies-4,cap+(mission<hordeUntil?35:0));
 }
 function display() {
  const visible=DEV.portal&&inArena&&S!=='menu'&&S!=='dead';
  objective.hidden=!visible;
  if(visible){
   const label=(warned?'EXTRACCIÓN ':'ANOMALÍA ')+Math.ceil(90-arenaSeconds)+' s';
   if(objective.textContent!==label)objective.textContent=label;
  }
 }
 return {
  reset, advance, waveCap, display, finishArena, picked,
  get inArena(){return !!inArena},
  get mission(){return mission},
  get threatTime(){return inArena?.threat??(DEV.portal?mission:T)},
  enemyAllowed:e=>!DEV.director?(inArena?.threat??(DEV.portal?mission:T))>=e.t:mission>=gates[e.k],
 };
})();
