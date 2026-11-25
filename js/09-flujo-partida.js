function give(p,run){
 M.found[p.t==='i'?'i'+p.i:p.k]=1;
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
function workshopSpin(){if(SPIN.busy||S!=='menu'||M.gold<30)return false;
 M.gold-=30;const res=roll([22,30,28,20]);give(res,false);save();
 UI.go('ruleta-taller',{res});return true}
function runSpin(mode){if(S!=='play'||!P||P.hp<=0||RUN_DONE||SPIN.busy)return false;
 S='lvl';const res=roll(mode==='wheel'?[12,28,34,26]:[Math.max(10,45-5*P.luck),30,18+3*P.luck,7+2*P.luck]);let granted=false;
 spinAnim(res,mode==='wheel'?'Ruleta de premios':'¡Cofre abierto!',ft=>{if(granted||RUN_DONE||!P||P.hp<=0||S!=='lvl')return;granted=true;
  ST.pick('ruleta',[res.n],res.n);ST.reward('ruleta');give(res,true);
  const b=document.createElement('button');b.className='pri';b.textContent='Continuar';b.onclick=()=>{if(S==='lvl'&&!RUN_DONE){S='play';U.innerHTML=''}};if(ft)ft.appendChild(b)});return true}
/* Compatibilidad: el resto del código (y el simulador) siguen llamando a spin(mode). */
function spin(mode){return mode==='gamble'?workshopSpin():runSpin(mode)}
function menu(){
 S='menu';
 const it=[['d','Poder','🔥','+10% daño'],['h','Vitalidad','❤️','+20 vida'],['s','Agilidad','👟','+5% velocidad'],['x','Sabiduría','📘','+10% XP']];
 const tile=(p,f)=>f?`<span class="ic" title="${p.n}" style="color:${RC[p.r]};border-color:${RC[p.r]}">${EM(p)}</span>`:'<span class="ic" style="color:#666;border-color:#666;opacity:.5">?</span>';
 const col=[3,2,1,0].map(r=>`<h3 style="color:${RC[r]}">${RN[r]}</h3><div class="grid">`+POOLP.filter(p=>p.r===r).map(p=>tile(p,M.found[p.t==='i'?'i'+p.i:p.k])).join('')+'</div>').join('');
 U.innerHTML=`<div class="pn"><h1>TALLER</h1><p>Mejor tiempo ${fmt(M.best||0)} · ${M.gold} monedas. Tus monedas se gastan aquí en mejoras permanentes, la ruleta y el equipo.</p><button id="go" class="ghost">${icon('arrow-left',18)} Volver</button><button id="gb" class="card" ${M.gold<30?'disabled':''}><span class="ic" style="color:#ffb800;border-color:#ffb800">🎰</span><span><b>Ruleta de la suerte · 30 monedas</b><small>Objetos legendarios y armas épicas que conservas siempre</small></span></button><h3>Mejoras permanentes</h3>`+
 it.map(([k,n,e,d])=>`<button class="sh card" data-k="${k}" ${M.gold<cost(k)?'disabled':''}><span class="ic">${e}</span><span><b>${n} nv.${M[k]}</b><small>${d}</small></span><b style="margin-left:auto">${cost(k)}</b></button>`).join('')+`<h3>Colección</h3>${col}</div>`;
 document.getElementById('go').onclick=()=>UI.back();
 document.getElementById('gb').onclick=()=>workshopSpin();
 bindX();
 U.querySelectorAll('.sh[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(M.gold>=cost(k)){M.gold-=cost(k);M[k]++;save();menu()}});
}
function start(){
 P={x:0,y:0,a:0,mhp:100+20*M.h,spd:130*(1+.05*M.s),dmg:10*(1+.1*M.d),rate:1.3,cd:0,proj:1,orbs:0,oa:0,lvl:1,xp:0,need:5,mag:90,xpm:1+.1*M.x,red:1,reg:0,vamp:0,luck:0,crit:0,th:0,aura:0,rev:0,bf:0,boom:0,f:1,dc:0,iv:0,dsh:0,da:0};
 P.hp=P.mhp;E=[];B=[];EB=[];G=[];FX=[];CH=[{x:520,y:-380}];NC=50;RIn=0;for(const k in PS)PS[k]=0;lh=0;OB=[];RP=[];OBL=[];PT=[];NT={o:6,r:35,b:45,p:80};BG=0;NB=300;TX={s:'',t:0};WH=15;WO=null;WN=50;
 for(const k in WS){WS[k]=M.w[k]||0;CD[k]=0}
 for(const i in M.own)for(let n=0;n<M.own[i];n++)IT[i][3](P);CHR[M.ch][5](P);for(const i of M.eq)RL[i][3](P);if(MD.hc){P.mhp*=.6;P.hp=P.mhp;P.rev=0}
 T=0;K=0;sp=0;WON=0;RUN_DONE=0;S='play';U.innerHTML='';
}
function pool(){
 const a=[["Daño +25%",()=>P.dmg*=1.25],["Cadencia +20%",()=>P.rate*=1.2],["+1 proyectil de pistola",()=>P.proj++],
 ["Sierra giratoria +1",()=>P.orbs=Math.min(6,P.orbs+1)],["Velocidad +10%",()=>P.spd*=1.1],
 ["Vida +30 y cura",()=>{P.mhp+=30;P.hp=Math.min(P.mhp,P.hp+60)}],["Imán +50%",()=>P.mag*=1.5]];
 const PI=['🔥','⚙️','🔫','🪚','👟','❤️','🧲'];a.forEach((u,i)=>{u[2]=PI[i];u[3]='Mejora'});
 for(const k in WP)if(WS[k]<5)a.push([`${WP[k][0]} ${WS[k]?'nv.'+(WS[k]+1):'(nueva)'}`,()=>WS[k]++,IW[k],'Arma · '+RN[WP[k][1]],WS[k]?(WL[k]||''):WP[k][2]]);
 for(const k in PV)if(PS[k]<5)a.push([`${PV[k][0]} nv.${PS[k]+1}`,()=>{PS[k]++;PV[k][3](P)},PV[k][1],'Pasiva · '+PV[k][2]]);
 return a}
