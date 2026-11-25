/* Era Z — Combat Analytics (v0.2.0, Etapa 1). Todo es local: nada sale del navegador.
   · Semilla por partida: Math.random se sustituye por un PRNG (mulberry32) sembrado al empezar cada partida.
     Con ?seed=N la semilla se fija. En el simulador (sin render, dt fijo) la partida es reproducible exactamente;
     en partidas humanas la semilla se registra, pero el render y el dt variable consumen números y no se garantiza repetición exacta.
   · Atribución de daño: la variable global DS (00-config) indica la fuente activa; hit() llama a ST.hit/ST.kill.
   · Persistencia: las últimas 30 partidas humanas en localStorage['erazStats'] (independiente de 'arcane1').
   · API de consola: ERAZ_STATS.last(), .all(), .exportJSON(), .exportCSV(), .download(), .clear(). */
const ST={ver:'0.1.0-alpha.2+analytics',key:'erazStats',max:30,run:null,hits:new Map(),forceSeed:null,simMode:false,xpBank:0,
 newSeed(){return (((Date.now()&0xffffffff)^Math.floor(ST._r()*4294967296))>>>0)},_r:Math.random,
 seedRng(s){let a=s>>>0;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}},
 cat(e){return e.king?'jefe final':e.boss?(e.mg?'mega jefe':'jefe'):e.el?'élite':(e.k==='spit'||e.k==='bom')?'especial':(e.k==='a'||e.k==='b'||e.k==='c')?'zombi':'bestia'},
 begin(){if(this.run&&!this.run.res)this.end('reinicio');
  const q=new URLSearchParams(location.search),seed=this.forceSeed!=null?this.forceSeed>>>0:(q.get('seed')!=null?(+q.get('seed'))>>>0:this.newSeed());this.forceSeed=null;this.seedRng(seed);
  this.xpBank=0;this.hits.clear();this.nextMin=60;this.nextPerf=10;
  this.run={ver:this.ver,seed,sim:this.simMode,date:new Date().toISOString(),ch:CHR[M.ch][0],mode:MD.n,
   ajustes:{perfilGrafico:['Automático','Alto','Bajo consumo'][M.set.pf|0],particulas:M.set.p,reducirEfectos:M.set.rf|0,tactil:INP.touch},
   meta:{dmg:M.d,vida:M.h,vel:M.s,xp:M.x,objetos:Object.values(M.own).reduce((a,b)=>a+b,0),armas:Object.values(M.w).reduce((a,b)=>a+b,0),reliquias:M.eq.length},
   w:{},cat:{},kcat:{},hurt:{},picks:[],rewards:{},elites:[],bosses:[],min:[],perf:[],res:null,last:null}},
 W(s){return this.run.w[s]||(this.run.w[s]={dmg:0,eff:0,hits:0,kills:0,acts:0,targets:0,first:T})},
 hit(e,d,eff){const r=this.run;if(!r||d>=1e8)return;const w=this.W(DS);w.dmg+=d;w.eff+=eff;w.hits++;const c=this.cat(e);r.cat[c]=(r.cat[c]||0)+eff;
  let s=this.hits.get(DS);if(!s)this.hits.set(DS,s=new Set);s.add(e)},
 kill(e){const r=this.run;if(!r)return;this.W(DS).kills++;const c=this.cat(e);r.kcat[c]=(r.kcat[c]||0)+1;
  if(e.el||e.boss)(e.boss?r.bosses:r.elites).push({k:e.k,c,nace:+(e.bornT||0).toFixed(1),primerGolpe:e.fh!=null?+e.fh.toFixed(1):null,muere:+T.toFixed(1),ttk:+(T-(e.fh!=null?e.fh:T)).toFixed(1),vida:Math.round(e.mhp||e.mh0||0)})},
 hurt(src,d){const r=this.run;if(!r||d<=0)return;r.hurt[src]=(r.hurt[src]||0)+d;r.last=src},
 pick(kind,opts,chosen){if(this.run)this.run.picks.push({t:+T.toFixed(1),lvl:P.lvl,kind,opts,chosen})},
 reward(k,n=1){if(this.run)this.run.rewards[k]=(this.run.rewards[k]||0)+n},
 xpTotal(){return Math.round((this.xpBank+(P?P.xp:0))*10)/10},
 tick(){const r=this.run;if(!r)return;
  for(const [s,set] of this.hits){const w=this.W(s);w.acts++;w.targets+=set.size}this.hits.clear();
  if(T>=this.nextMin){this.nextMin+=60;r.min.push({m:Math.round(T/60),lvl:P.lvl,xp:this.xpTotal(),bajas:K,dmg:Math.round(Object.values(r.w).reduce((a,w)=>a+w.eff,0)),recibido:Math.round(Object.values(r.hurt).reduce((a,b)=>a+b,0)),vivos:E.length,vida:Math.round(P.hp),vidaMax:Math.round(P.mhp),monedasSiAbandona:typeof coinsAtStake==='function'?coinsAtStake():null})}
  if(T>=this.nextPerf){this.nextPerf+=10;const s=(!this.simMode&&window.ERAZ_DIAG)?ERAZ_DIAG.snapshot():null;
   r.perf.push({t:Math.round(T),enemigos:E.length,balas:B.length,acido:EB.length,gemas:G.length,fx:FX.length,particulas:PA.length,llamadas:(R3&&R3.info)?R3.info.render.calls:0,fps:s?s.fps:null,p95:s?s.p95Ms:null})}},
 end(res){const r=this.run;if(!r||r.res)return null;r.res=res;r.t=+T.toFixed(1);r.lvl=P?P.lvl:0;r.bajas=K;r.xp=this.xpTotal();r.monedas=res==='reinicio'?0:(res==='tiempo límite'?coinsAtStake():gain);r.limites={oleada:LIM.wave,enemigos:LIM.enemies};r.cofres=RIn;
  r.muerte=res==='muerte'?{causa:r.last||'?',minuto:+(T/60).toFixed(2)}:null;
  if(!r.sim){try{const a=JSON.parse(localStorage.getItem(this.key)||'[]');a.push(r);while(a.length>this.max)a.shift();localStorage.setItem(this.key,JSON.stringify(a))}catch(e){}}
  return r},
 summary(r=this.run){if(!r)return null;const tt=Math.max(1,r.t||T),tot=Object.values(r.w).reduce((a,w)=>a+w.eff,0)||1,inn=Object.values(r.hurt).reduce((a,b)=>a+b,0);
  return{semilla:r.seed,sim:r.sim,personaje:r.ch,modo:r.mode,resultado:r.res,tiempo:r.t,nivel:r.lvl,bajas:r.bajas,xp:r.xp,monedas:r.monedas,dps:+(tot/tt).toFixed(1),danoRecibido:Math.round(inn),muerte:r.muerte,
   armas:Object.entries(r.w).sort((a,b)=>b[1].eff-a[1].eff).map(([k,w])=>({arma:k,dano:Math.round(w.eff),dps:+(w.eff/tt).toFixed(1),cuota:+(100*w.eff/tot).toFixed(1),bajas:w.kills,objetivosPorActivacion:w.acts?+(w.targets/w.acts).toFixed(2):0,sobrante:Math.round(w.dmg-w.eff)})),
   danoPorCategoria:Object.fromEntries(Object.entries(r.cat).map(([k,v])=>[k,Math.round(v)])),bajasPorCategoria:r.kcat,
   fuentesDeDano:Object.fromEntries(Object.entries(r.hurt).sort((a,b)=>b[1]-a[1]).map(([k,v])=>[k,Math.round(v)])),
   elites:{n:r.elites.length,ttkMedio:r.elites.length?+(r.elites.reduce((a,e)=>a+e.ttk,0)/r.elites.length).toFixed(1):null},jefes:r.bosses,
   elecciones:r.picks.length,recompensas:r.rewards,porMinuto:r.min,
   rendimiento:r.perf.length?{maxEnemigos:Math.max(...r.perf.map(p=>p.enemigos)),maxLlamadas:Math.max(...r.perf.map(p=>p.llamadas)),p95:Math.max(...r.perf.map(p=>p.p95||0))||null,fpsMin:r.perf.some(p=>p.fps)?Math.min(...r.perf.filter(p=>p.fps).map(p=>p.fps)):null}:null}},
 all(){try{return JSON.parse(localStorage.getItem(this.key)||'[]')}catch(e){return[]}},
 csv(runs){const h=['fecha','semilla','sim','personaje','modo','resultado','tiempo_s','nivel','bajas','xp','monedas','dps','dano_recibido','causa_muerte','minuto_muerte','arma_principal','cuota_principal'];
  return[h.join(',')].concat(runs.map(r=>{const s=this.summary(r),a=s.armas[0]||{};return[r.date,s.semilla,s.sim,s.personaje,s.modo,s.resultado,s.tiempo,s.nivel,s.bajas,s.xp,s.monedas,s.dps,s.danoRecibido,s.muerte?s.muerte.causa:'',s.muerte?s.muerte.minuto:'',a.arma||'',a.cuota||''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')})).join('\n')},
 download(kind='json'){const runs=this.all();if(this.run&&!runs.includes(this.run)&&this.run.res&&this.run.sim)runs.push(this.run);
  const data=kind==='csv'?this.csv(runs):JSON.stringify({ver:this.ver,exportado:new Date().toISOString(),partidas:runs},null,1);
  const b=new Blob([data],{type:kind==='csv'?'text/csv':'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`era-z-estadisticas-${Date.now()}.${kind}`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}};
window.ERAZ_STATS={last:()=>ST.summary(ST.run),all:()=>ST.all(),summary:r=>ST.summary(r),exportJSON:()=>JSON.stringify(ST.all()),exportCSV:()=>ST.csv(ST.all()),download:k=>ST.download(k),clear:()=>localStorage.removeItem(ST.key),ST};
{const s1=start;start=function(){ST.begin();s1.apply(this,arguments)}}
