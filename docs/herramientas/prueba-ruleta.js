/* Era Z — prueba automática de ERAZ-010 (ruleta del Taller). Uso en la consola del juego:
   eval(await (await fetch('docs/herramientas/prueba-ruleta.js')).text()); await PRUEBA_RULETA()
   Recorre: perfil nuevo y existente × antes de jugar, tras derrota, victoria, abandono y reinicio.
   Comprueba estado de menú, HUD oculto, cobro y premio únicos (doble clic), persistencia en 'arcane1',
   vuelta al Taller y al menú por el router, Esc a mitad de giro sin efectos tardíos, y que la ruleta del mapa sigue funcionando. */
window.PRUEBA_RULETA=async function(){const sleep=ms=>new Promise(r=>setTimeout(r,ms)),out=[],$=id=>document.getElementById(id);
 const prizes=()=>Object.values(M.own).reduce((a,b)=>a+b,0)+Object.values(M.w).reduce((a,b)=>a+b,0);
 const stored=()=>JSON.parse(localStorage.getItem('arcane1')||'{}');
 async function after(sc){
  if(sc==='derrota'){MD=MODES[0];MI=0;M.seen=1;start();for(let i=0;i<60;i++)step(1/30);P.rev=0;P.hp=-1e6;step(1/30)}
  if(sc==='victoria'){MD=MODES[0];MI=0;M.seen=1;start();for(let i=0;i<60;i++)step(1/30);WON=1;die()}
  if(sc==='abandono'){MD=MODES[0];MI=0;M.seen=1;start();for(let i=0;i<60;i++)step(1/30);pauseP();$('p3').click();$('dlg-ok').click()}
  if(sc==='reinicio'){MD=MODES[0];MI=0;M.seen=1;start();for(let i=0;i<60;i++)step(1/30);pauseP();$('p4').click();$('dlg-ok').click();for(let i=0;i<30;i++)step(1/30);pauseP();$('p3').click();$('dlg-ok').click()}
  UI.home()}
 for(const perfil of ['nuevo','existente']){
  if(perfil==='nuevo'){Object.keys(M).forEach(k=>delete M[k]);Object.assign(M,{gold:0,d:0,h:0,s:0,x:0,own:{},w:{},found:{},ch:0,co:{0:1},rel:{},eq:[],st:{k:0,bs:0,mg:0,ob:0,pt:0,rl:0,runs:0,bt:0,win:{}},mc:{},set:Object.assign({},M.set)});save()}
  else{Object.assign(M,{d:3,h:2,s:1,x:1,own:{0:1,4:1},w:{shot:1},eq:[],st:Object.assign(M.st,{runs:7,k:2300,bt:410})});save()}
  for(const sc of ['antes de jugar','derrota','victoria','abandono','reinicio']){
   await after(sc);M.gold=Math.max(M.gold,0)+90;save();
   const g0=M.gold,p0=prizes();UI.go('taller');const gb=$('gb');gb.click();gb.click();// doble clic
   hud();const r={perfil,escenario:sc,S,pantalla:UI.cur.n,hudVisible:HUD.style.display!=='none',mundoDePartida:!!P&&S!=='menu',cobro:g0-M.gold,premios:prizes()-p0,guardado:stored().gold===M.gold};
   await sleep(3600);const vb=[...U.querySelectorAll('button')].find(b=>/Volver al Taller/.test(b.textContent));r.botonVolver=!!vb;if(vb)vb.click();r.trasVolver=UI.cur.n;
   r.monedasEnTaller=(U.textContent.match(/(\d+) monedas/)||[])[1]==String(M.gold);$('go').click();r.trasAtras=UI.cur.n;out.push(r)}
 }
 // Esc a mitad de giro: vuelve al Taller, premio ya guardado, sin efectos tardíos
 M.gold+=60;save();UI.home();UI.go('taller');const g1=M.gold,p1=prizes();$('gb').click();await sleep(400);document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
 const esc={pantalla:UI.cur.n,cobro:g1-M.gold,premios:prizes()-p1};await sleep(3500);esc.restosDeRuleta=!!$('spin-pn')||[...U.querySelectorAll('button')].some(b=>/Volver al Taller|Continuar/.test(b.textContent));esc.pantallaFinal=UI.cur.n;out.push({escMitadDeGiro:esc});
 // ruleta del mapa: funciona en partida y no tras la muerte
 MD=MODES[0];MI=0;start();for(let i=0;i<30;i++)step(1/30);const before=Object.values(WS).reduce((a,b)=>a+b,0)+RIn;const ok=spin('wheel');const s1=S;await sleep(3600);const cont=[...U.querySelectorAll('button')].find(b=>b.textContent==='Continuar');if(cont)cont.click();
 const mapa={inicia:ok,estadoDurante:s1,trasContinuar:S,premioAplicado:RIn>0||Object.values(WS).reduce((a,b)=>a+b,0)+RIn>before};
 P.rev=0;P.hp=-1e6;step(1/30);mapa.trasMuerte_spin=spin('wheel');mapa.estadoFinal=S;out.push({ruletaMapa:mapa});UI.home();return out};
