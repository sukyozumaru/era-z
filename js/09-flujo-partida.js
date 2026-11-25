function give(p,run){
 const key=p.t==='i'?'i'+p.i:p.k;
 const known=p.t==='i'?M.own[p.i]:M.w[p.k];
 M.found[key]=1;
 if(DEV.progression&&!run){
  if(known)M.supplyCredits=(M.supplyCredits||0)+1;
  else if(p.t==='i')M.own[p.i]=1;
  else M.w[p.k]=1;
  save();return;
 }
 if(run){RIn++;if(p.t==='i')IT[p.i][3](P);else WS[p.k]++}
 else if(p.t==='i')M.own[p.i]=(M.own[p.i]||0)+1;else M.w[p.k]=Math.min(3,(M.w[p.k]||0)+1);
 save()}
/* Ruletas (ERAZ-010). Dos contextos que ya no se mezclan:
   · workshopSpin(): ruleta del Taller. Solo menú (S='menu'): cobra 30 monedas permanentes y entrega un premio persistente,
     ambos guardados ANTES de la animación y una sola vez. Nunca toca ni muestra la partida anterior.
   · runSpin(mode): ruleta del mapa ('wheel'). Solo con una partida activa (S==='play', jugador vivo, partida sin liquidar).
     El premio es para esa partida y se entrega una sola vez al revelarse.
   Ambas: un giro a la vez, temporizadores ligados a un token y cancelables (spinCancel al cambiar de pantalla).
   Probabilidades sin cambios: Taller [22,30,28,20]; mapa [12,28,34,26]. */
const SPIN={tok:0,busy:false,timers:[]};
function spinCancel(){SPIN.tok++;SPIN.timers.forEach(clearTimeout);SPIN.timers=[];SPIN.busy=false}
function spinAnim(res,title,onDone){spinCancel();const tok=SPIN.tok;SPIN.busy=true;
 U.innerHTML=`<div class="pn" id="spin-pn"><h2>${title}</h2>${whl(res)}<div class="rl" id="rl">...</div><div id="ft"></div></div>`;
 const rl=document.getElementById('rl'),wh=document.getElementById('wh');let d=60;
 const later=(f,ms)=>{SPIN.timers.push(setTimeout(()=>{if(tok!==SPIN.tok||!document.getElementById('spin-pn'))return;f()},ms))};
 if(wh){const sg=WSG;later(()=>{wh.style.transform=`rotate(${360*6+360-(sg*45+22.5)}deg)`},60)}
 const tick=()=>{if(d<380){const p=POOLP[Math.random()*POOLP.length|0];rl.innerHTML=`<span class="ic" style="color:${RC[p.r]};border-color:${RC[p.r]}">${EM(p)}</span><br>${p.n}`;rl.style.borderColor=rl.style.color=RC[p.r];sfx.tick();d*=1.13;later(tick,d)}
  else{rl.innerHTML=`<span class="ic" style="color:${RC[res.r]};border-color:${RC[res.r]}">${EM(res)}</span><br>${res.t==='w'?'Arma: ':''}${res.n}<small>${RN[res.r]} · ${res.d}</small>`;sfx.win(res.r);rl.style.borderColor=rl.style.color=RC[res.r];SPIN.busy=false;onDone(document.getElementById('ft'))}};
 tick()}
const WORKSHOP_ODDS=Object.freeze([22,30,28,20]);
function workshopSpin(){if(SPIN.busy||S!=='menu'||M.gold<30)return false;
 M.gold-=30;const res=roll(WORKSHOP_ODDS);give(res,false);save();
 UI.go('ruleta-taller',{res});return true}
function runSpin(mode){if(S!=='play'||!P||P.hp<=0||RUN_DONE||SPIN.busy)return false;
 S='lvl';const res=roll(mode==='wheel'?[12,28,34,26]:[Math.max(10,45-5*P.luck),30,18+3*P.luck,7+2*P.luck]);let granted=false;
 spinAnim(res,mode==='wheel'?'Ruleta de premios':'¡Cofre abierto!',ft=>{if(granted||RUN_DONE||!P||P.hp<=0||S!=='lvl')return;granted=true;
  ST.pick('ruleta',[res.n],res.n);ST.reward('ruleta');give(res,true);
  const b=document.createElement('button');b.className='pri';b.textContent='Continuar';b.onclick=()=>{if(S==='lvl'&&!RUN_DONE){S='play';U.innerHTML=''}};if(ft)ft.appendChild(b)});return true}
/* Compatibilidad: el resto del código (y el simulador) siguen llamando a spin(mode). */
function spin(mode){return mode==='gamble'?workshopSpin():runSpin(mode)}
const WORKSHOP_TABS=[
 ['mejoras','Mejoras permanentes'],['arsenal','Arsenal'],['ruleta','Ruleta'],
 ['reliquias','Reliquias'],['coleccion','Colección'],
];
const WORKSHOP_STATS=[['d','Poder','🔥',10,'% de daño'],['h','Vitalidad','❤️',20,' de vida'],
 ['s','Agilidad','👟',5,'% de velocidad'],['x','Sabiduría','📘',10,'% de XP']];
const effectiveWorkshopLevel=level=>DEV.progression?Math.min(level,4)+.5*Math.min(Math.max(0,level-4),2):level;
const workshopOwned=p=>p.t==='i'?M.own[p.i]:M.w[p.k];
const workshopKnown=p=>workshopOwned(p)||M.found[p.t==='i'?'i'+p.i:p.k];
function workshopRow(iconText,title,description,status){
 return `<li class="workshop-row"><span aria-hidden="true">${iconText}</span><span><b>${title}</b><small>${description}</small><small class="workshop-status">${status}</small></span></li>`;
}
function workshopSection(tab){
 if(tab==='mejoras')return `<ul class="workshop-list">${WORKSHOP_STATS.map(([key,name,emoji,amount,unit])=>{
  const level=M[key], price=cost(key), maxed=DEV.progression&&level>=6;
  const now=effectiveWorkshopLevel(level)*amount, next=effectiveWorkshopLevel(level+1)*amount;
  return `<li><button class="card" data-k="${key}" ${maxed||M.gold<price?'disabled':''}><span aria-hidden="true">${emoji}</span><span><b>${name} · nv. ${level}</b><small>Total +${now}${unit}${maxed?' · Nivel máximo':` · Siguiente +${next-now}${unit}`}</small></span><b class="workshop-price">${maxed?'Máx.':price+' monedas'}</b></button></li>`;
 }).join('')}</ul>`;
 if(tab==='arsenal')return `<p>${DEV.progression?'Todas las armas pueden aparecer en cartas. El desbloqueo del Taller cuenta para la colección.':'Las armas desbloqueadas en el Taller empiezan activas en tu próxima partida.'}</p><ul class="workshop-list">${POOLP.filter(p=>p.t==='w').map(p=>{
  const status=workshopOwned(p)?(DEV.progression?'Desbloqueada en el Taller':`Desbloqueada · empieza a nivel ${workshopOwned(p)}`):workshopKnown(p)?'Descubierta en partida':'Disponible en cartas';
  return workshopRow(EM(p),p.n,`${RN[p.r]} · ${p.d}`,status);
 }).join('')}</ul>`;
 if(tab==='ruleta')return `<p>Cada tiro cuesta 30 monedas. El premio se guarda al girar.${DEV.progression?' Los duplicados dan 1 crédito de suministros. Conservas el objeto original.':''}</p>
  <dl class="workshop-odds">${WORKSHOP_ODDS.map((chance,i)=>`<div><dt>${RN[i]}</dt><dd>${chance} %</dd></div>`).join('')}</dl>
  <p>Todos los premios de una misma rareza tienen la misma probabilidad.</p>
  <button id="gb" class="pri" ${M.gold<30?'disabled':''}>Girar · 30 monedas</button>`;
 if(tab==='reliquias')return `<p><b>${M.eq.length} / 3 equipadas.</b> Se activan al inicio de la partida. Encuentra reliquias en el mapa para desbloquearlas.</p>
  <ul class="workshop-list">${RL.map(([name,emoji,r,,effect],i)=>{
   const equipped=M.eq.includes(i),owned=M.rel[i];
   return `<li><button class="card" data-relic="${i}" aria-pressed="${equipped}" ${!owned||(!equipped&&M.eq.length>=3)?'disabled':''}>
    <span aria-hidden="true">${emoji}</span><span><b>${name}</b><small>${RN[r]} · ${effect}</small><small class="workshop-status">${equipped?'Equipada · Quitar':owned?(M.eq.length>=3?'Desbloqueada · Ranuras llenas':'Desbloqueada · Equipar'):'Sin desbloquear'}</small></span></button></li>`;
  }).join('')}</ul>`;
 const eligible=POOLP.filter(p=>!workshopOwned(p));
 const supplies=DEV.progression?`<div class="workshop-canje"><p><b>${M.supplyCredits||0} créditos de suministros</b> · Canje dirigido por 5 créditos</p>
  ${eligible.length?`<label for="lab-supply">Premio por desbloquear</label><select id="lab-supply">${eligible.map((p,i)=>`<option value="${i}">${p.n} · ${RN[p.r]}</option>`).join('')}</select><button id="lab-redeem" ${(M.supplyCredits||0)<5?'disabled':''}>Canjear · 5 créditos</button>`:'<p>Colección desbloqueada al completo.</p>'}</div>`:'';
 return `<p>${POOLP.filter(workshopKnown).length} / ${POOLP.length} descubiertos · ${POOLP.filter(workshopOwned).length} desbloqueados en el Taller. Las reliquias se consultan en su propia sección.</p>${supplies}
 ${[3,2,1,0].map(r=>`<h3>${RN[r]}</h3><ul class="workshop-list">${POOLP.filter(p=>p.r===r).map(p=>workshopKnown(p)?workshopRow(EM(p),p.n,p.d,workshopOwned(p)?'Desbloqueado en el Taller':'Descubierto en partida'):workshopRow('?','Por descubrir',RN[r],'')).join('')}</ul>`).join('')}`;
}
function renderWorkshop(tab='mejoras'){
 S='menu';
 const current=WORKSHOP_TABS.find(([id])=>id===tab)||WORKSHOP_TABS[0];
 U.innerHTML=`<div class="pn wide workshop"><header class="workshop-heading">${topBar('Taller')}<p><b>${M.gold} monedas</b> · Récord ${fmt(M.best||0)}</p></header>
  <nav class="workshop-nav" aria-label="Secciones del Taller">${WORKSHOP_TABS.map(([id,label])=>`<button data-workshop="${id}" ${id===current[0]?'aria-current="page"':''}>${label}</button>`).join('')}</nav>
  <section aria-labelledby="workshop-title"><h3 id="workshop-title">${current[1]}</h3>${workshopSection(current[0])}</section></div>`;
 bindBack();
 U.querySelectorAll('[data-workshop]').forEach(button=>button.onclick=()=>{
  const selected=button.dataset.workshop;
  UI.show('taller',{tab:selected});
  if(!INP.touch)U.querySelector('[aria-current="page"]').focus();
 });
 U.querySelectorAll('[data-k]').forEach(button=>button.onclick=()=>{
  const k=button.dataset.k, price=cost(k);
  if(M.gold<price||(DEV.progression&&M[k]>=6))return;
  M.gold-=price;M[k]++;save();UI.refresh();
 });
 U.querySelectorAll('[data-relic]').forEach(button=>button.onclick=()=>{
  const i=Number(button.dataset.relic),slot=M.eq.indexOf(i);
  if(!M.rel[i])return;
  if(slot>=0)M.eq.splice(slot,1);else if(M.eq.length<3)M.eq.push(i);else return;
  save();
  const scroll=U.querySelector('.workshop').scrollTop;
  UI.refresh();U.querySelector('.workshop').scrollTop=scroll;
  if(!INP.touch)U.querySelector(`[data-relic="${i}"]`).focus();
 });
 if($('gb'))$('gb').onclick=()=>workshopSpin();
 if($('lab-redeem'))$('lab-redeem').onclick=()=>{
  const prize=POOLP.filter(p=>!workshopOwned(p))[Number($('lab-supply').value)];
  if(!prize||(M.supplyCredits||0)<5)return;
  M.supplyCredits-=5;give(prize,false);UI.refresh();
 };
}
function menu(tab){renderWorkshop(tab)}
function start(){
 LAB.reset();
 const permanent=k=>effectiveWorkshopLevel(M[k]);
 P={x:0,y:0,a:0,mhp:100+20*permanent('h'),spd:130*(1+.05*permanent('s')),dmg:10*(1+.1*permanent('d')),rate:1.3,cd:0,proj:1,orbs:0,oa:0,lvl:1,xp:0,need:5,mag:90,xpm:1+.1*permanent('x'),red:1,reg:0,vamp:0,luck:0,crit:0,th:0,aura:0,rev:0,bf:0,boom:0,f:1,dc:0,iv:0,dsh:0,da:0};
 P.hp=P.mhp;E=[];B=[];EB=[];G=[];FX=[];CH=[{x:520,y:-380}];NC=50;RIn=0;for(const k in PS)PS[k]=0;lh=0;OB=[];RP=[];OBL=[];PT=[];NT={o:6,r:35,b:45,p:80};BG=0;NB=300;TX={s:'',t:0};WH=15;WO=null;WN=50;
 for(const k in WS){WS[k]=DEV.progression?0:M.w[k]||0;CD[k]=0}
 if(!DEV.progression)for(const i in M.own)for(let n=0;n<M.own[i];n++)IT[i][3](P);CHR[M.ch][5](P);for(const i of M.eq)RL[i][3](P);if(MD.hc){P.mhp*=.6;P.hp=P.mhp;P.rev=0}
 T=0;K=0;sp=0;WON=0;RUN_DONE=0;S='play';U.innerHTML='';
}
function pool(){
 const a=[["Daño +25%",()=>P.dmg*=1.25],["Cadencia +20%",()=>P.rate*=1.2],["+1 proyectil de pistola",()=>P.proj++],
 ["Sierra giratoria +1",()=>P.orbs=Math.min(6,P.orbs+1)],["Velocidad +10%",()=>P.spd*=1.1],
 ["Vida +30 y cura",()=>{P.mhp+=30;P.hp=Math.min(P.mhp,P.hp+60)}],["Imán +50%",()=>P.mag*=1.5]];
 const PI=['🔥','⚙️','🔫','🪚','👟','❤️','🧲'];a.forEach((u,i)=>{u[2]=PI[i];u[3]='Mejora'});
 for(const k in WP)if(WS[k]<5)a.push([`${WP[k][0]} ${WS[k]?'nv.'+(WS[k]+1):'(nueva)'}`,()=>WS[k]++,IW[k],'Arma · '+RN[WP[k][1]],WS[k]?(WL[k]||''):WP[k][2]]);
 for(const k in PV)if(PS[k]<5)a.push([`${PV[k][0]} nv.${PS[k]+1}`,()=>{PS[k]++;PV[k][3](P)},PV[k][1],'Pasiva · '+PV[k][2]]);
 if(DEV.progression)for(const i of Object.keys(M.own).map(Number)){
  if(!IT[i]||!M.own[i]||LAB.picked.has(i))continue;
  const [name,,description,apply]=IT[i];
  a.push([name,()=>{LAB.picked.add(i);apply(P)},IC[i],'Objeto de Taller',description]);
 }
 return a}
