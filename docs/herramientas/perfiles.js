/* Era Z — perfiles de progresión permanente para comparar cohortes (herramienta; no se carga en el juego).
   PERFILES.build(presupuesto, semilla) devuelve los campos permanentes de M (d,h,s,x,own,w,eq) que un jugador tendría tras
   gastar ese presupuesto con una regla fija y documentada:
     1) compra la mejora permanente más barata (Poder, Vitalidad, Agilidad, Sabiduría) mientras cueste ≤ 120 monedas;
     2) el resto, en giros de la ruleta del Taller (30 monedas), con las probabilidades reales [22,30,28,20] y la misma regla de premio que give(p,false).
   Sin reliquias equipadas: se obtienen jugando, no con monedas.
   Los giros usan una semilla propia para que el perfil sea idéntico en todas las partidas de la cohorte. */
window.PERFILES={
 build(budget,seed=777){const r0=Math.random;ST.seedRng(seed);const p={d:0,h:0,s:0,x:0,own:{},w:{},eq:[]};let g=budget,spins=0,ups=0;
  const c=k=>Math.round(8*Math.pow(1.7,p[k]));
  for(;;){const k=['d','h','s','x'].sort((a,b)=>c(a)-c(b))[0];if(c(k)<=120&&g>=c(k)){g-=c(k);p[k]++;ups++}else break}
  while(g>=30){g-=30;spins++;const res=roll([22,30,28,20]);if(res.t==='i')p.own[res.i]=(p.own[res.i]||0)+1;else p.w[res.k]=Math.min(3,(p.w[res.k]||0)+1)}
  Math.random=r0;p._info={presupuesto:budget,mejoras:ups,giros:spins,sobrante:g,objetos:Object.values(p.own).reduce((a,b)=>a+b,0),armas:Object.entries(p.w).map(x=>x[0]+' nv.'+x[1]).join(', ')};return p},
 /* Estadísticas del jugador al empezar la partida con un perfil (Recluta), sin jugar. */
 stats(prof){const b=JSON.stringify(M);Object.assign(M,{d:0,h:0,s:0,x:0,own:{},w:{},eq:[]},JSON.parse(JSON.stringify(prof)));M.ch=0;ST.simMode=true;MD=MODES[0];start();
  const o={vida:Math.round(P.mhp),dano:+P.dmg.toFixed(1),cadencia:+P.rate.toFixed(2),velocidad:Math.round(P.spd),reduccion:+(1-P.red).toFixed(2),regen:+P.reg.toFixed(1),xp:+P.xpm.toFixed(2),critico:+P.crit.toFixed(2),proyectiles:P.proj,armas:Object.keys(WS).filter(k=>WS[k]).map(k=>k+' '+WS[k]).join(', ')};
  ST.run.res='perfil';ST.simMode=false;Object.keys(M).forEach(k=>delete M[k]);Object.assign(M,JSON.parse(b));S='menu';UI.home();return o}};
