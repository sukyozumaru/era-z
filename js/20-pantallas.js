/* Era Z — router de pantallas y pantallas de interfaz (propuesta UI/UX aprobada).
   · UI.go(nombre, params) apila la pantalla actual; UI.back() vuelve a la anterior; UI.home() va al menú principal.
   · Cada pantalla se registra con UI.def(nombre, render, {state}). state:'menu' fija S='menu' salvo que estemos en pausa.
   · UI.ctx describe la sesión (hoy: solo, un jugador local). Está pensado para ampliarse a cooperativo (2 y luego 4 jugadores,
     salas privadas) y a PvP/PvPvE sin reescribir la navegación: ninguna pantalla asume que existe un único jugador salvo el HUD,
     que lee UI.ctx.players. NO hay red implementada. Ver docs/ARQUITECTURA-UI.md. */
const UI={stack:[],cur:null,reg:{},tw:null,
 ctx:{mode:'solo',players:[{id:'local',local:true}],pauseFreezes:true},
 def(n,f,o){this.reg[n]={f,o:o||{}}},
 show(n,p){clearInterval(this.tw);if(typeof spinCancel==='function')spinCancel();const r=this.reg[n];this.cur={n,p:p||{}};if(r.o.state==='menu'&&S!=='pause')S='menu';r.f(this.cur.p)},
 go(n,p){if(this.cur)this.stack.push(this.cur);this.show(n,p)},
 back(){const b=this.stack.pop();b?this.show(b.n,b.p):this.home()},
 home(){this.stack=[];this.cur=null;this.show('principal')},
 refresh(){this.cur?this.show(this.cur.n,this.cur.p):this.home()}};
/* Quien ya jugó antes de esta versión no vuelve a ver la historia automáticamente. */
if(M.seen===undefined)M.seen=(M.st&&M.st.runs>0)?1:0;
const $=id=>document.getElementById(id);
const topBar=(t,back=true)=>`<div class="top">${back?`<button id="bk" aria-label="Volver">${icon('arrow-left',22)}</button>`:''}<h2>${t}</h2></div>`;
const bindBack=()=>{const b=$('bk');if(b)b.onclick=()=>UI.back()};
const rarityIc=(e,r)=>`<span class="ic" style="color:${RC[r]};border-color:${RC[r]}">${e}</span>`;

/* ---------- Título y menú principal ---------- */
function title(){S='menu';UI.stack=[];UI.show('titulo')}
UI.def('titulo',()=>{U.innerHTML=`<div class="pn" style="text-align:center"><h1>ERA Z</h1><p>Puesto 7 · 2089</p><button class="pri" id="st">${icon('play',22)} Comenzar</button></div>`;$('st').onclick=()=>{sfx.lvl();UI.home()}},{state:'menu'});
function lobby(){UI.home()}
UI.def('principal',()=>{const c=CHR[M.ch],cl=MS.filter((m,i)=>m[1](M.st)>=m[2]&&!M.mc[i]).length;
 U.innerHTML=`<div class="pn"><h2>Puesto 7</h2><div class="chips"><span class="chip">${icon('user',14)}${c[0]}</span><span class="chip">${icon('coins',14)}${M.gold}</span><span class="chip">${icon('trophy',14)}${fmt(M.best||0)}</span></div>
 <button class="pri" id="m-play">${icon('play',22)} Jugar</button>
 <div class="row2"><button id="m-char">${icon('user',18)} Personaje</button><button id="m-mis">${icon('list-checks',18)} Misiones${cl?`<span class="badge">${cl}</span>`:''}</button><button id="m-tal">${icon('wrench',18)} Taller</button><button id="m-set">${icon('settings',18)} Ajustes</button></div>
 <button class="ghost" id="m-story">${icon('book-open',18)} Ver historia</button></div>`;
 $('m-play').onclick=()=>UI.go('dificultad');$('m-char').onclick=()=>UI.go('personajes');$('m-mis').onclick=()=>UI.go('misiones');$('m-tal').onclick=()=>UI.go('taller');$('m-set').onclick=()=>UI.go('ajustes');$('m-story').onclick=()=>UI.go('historia',{i:0,then:'back'})},{state:'menu'});
UI.def('misiones',()=>{missions()},{state:'menu'});
/* Ruleta del Taller (ERAZ-010): pantalla de menú; el cobro y el premio ya se guardaron en workshopSpin(). */
UI.def('ruleta-taller',p=>{spinAnim(p.res,'Ruleta de la suerte',ft=>{const b=document.createElement('button');b.className='pri';b.innerHTML=`${icon('arrow-left',20)} Volver al Taller`;b.onclick=()=>UI.back();if(ft)ft.appendChild(b);if(!INP.touch)b.focus()})},{state:'menu'});UI.def('taller',()=>{menu()},{state:'menu'});

/* ---------- Dificultad, historia ---------- */
function modes(){UI.go('dificultad')}
function beginRun(i){MI=i;MD=MODES[i];start()}
UI.def('dificultad',()=>{
 U.innerHTML=`<div class="pn">${topBar('Dificultad')}`+MODES.map((m,i)=>{const lk=i>0&&!M.st.win[i-1];
  return `<button class="card" data-m="${i}" ${lk?'disabled':''}><span class="ic">${m.i}</span><span><b>${m.n}</b><small>${lk?'Se desbloquea al completar '+MODES[i-1].n:m.t}</small></span><span class="state">${lk?icon('lock',16):'x'+m.g+' '+icon('coins',14)}</span></button>`}).join('')+`</div>`;
 bindBack();U.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const i=+b.dataset.m;if(!M.seen)UI.go('historia',{i,then:'play'});else beginRun(i)})},{state:'menu'});
UI.def('historia',p=>{const t=STORY[p.i||0],play=p.then==='play';
 U.innerHTML=`<div class="pn">${topBar(play?MODES[p.i].n:'Historia',!play)}<p id="tx" style="min-height:150px;color:var(--c-text);font-size:var(--fs-md)"></p><button class="${play?'pri':''}" id="sk">${play?'Saltar':'Volver'}</button></div>`;
 let n=0;const tx=$('tx'),fin=()=>{M.seen=1;save()};bindBack();
 UI.tw=setInterval(()=>{n+=2;tx.textContent=t.slice(0,n);if(n%6===0)snd(300+Math.random()*60,.03,'square',.02);if(n>=t.length){clearInterval(UI.tw);fin();if(play)$('sk').textContent='Comenzar partida'}},35);
 $('sk').onclick=()=>{clearInterval(UI.tw);fin();if(play)beginRun(p.i);else UI.back()}},{state:'menu'});

/* ---------- Personajes ---------- */
function chars(){UI.go('personajes')}
UI.def('personajes',()=>{const c=CHR[M.ch];
 U.innerHTML=`<div class="pn">${topBar('Personaje')}<div class="card sel" style="pointer-events:none">${rarityIc(c[1],c[2])}<span><b>${c[0]}</b><small>${RN[c[2]]} · ${c[4]}</small></span></div><h3>Soldados</h3>`+CHR.map((x,i)=>{const o=M.co[i];
  return `<button class="card ${i===M.ch?'sel':''}" data-c="${i}" ${o?'':'disabled'} aria-pressed="${i===M.ch}">${rarityIc(x[1],x[2])}<span><b>${x[0]}</b><small>${o?x[4]:UT[i]}</small></span><span class="state">${o?(i===M.ch?icon('check',16)+'En uso':RN[x[2]]):icon('lock',16)}</span></button>`}).join('')+`</div>`;
 bindBack();U.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const i=+b.dataset.c;if(M.co[i]){M.ch=i;save();const y=U.querySelector('.pn').scrollTop;UI.refresh();U.querySelector('.pn').scrollTop=y}})},{state:'menu'});

/* ---------- Ajustes (pestañas) ---------- */
function settings(){UI.go('ajustes')}
SO.vib=['Sí','No'];SL.vib='Vibración';M.set.vib=M.set.vib|0;
const TABS=[['audio','Audio','volume-2'],['graf','Gráficos','monitor'],['ctrl','Controles','gamepad-2'],['acc','Accesibilidad','accessibility']];
UI.def('ajustes',p=>{const s=M.set,tab=p.tab||'audio',row=k=>`<button class="set" data-g="${k}"><span>${SL[k]}</span><b>${SO[k][s[k]]}</b></button>`;
 let body='';
 if(tab==='audio')body=`<h3>Música</h3><input type="range" id="rm" min="0" max="100" value="${s.mv*100}" aria-label="Música"><h3>Efectos</h3><input type="range" id="re" min="0" max="100" value="${s.sv*100}" aria-label="Efectos"><button class="set" id="sn2"><span>Todo el sonido</span><b>${M.mute?'Apagado':'Encendido'}</b></button>`;
 else if(tab==='graf')body=`<p>«Automático» usa el perfil de bajo consumo en pantallas táctiles.</p>`+['pf','q','r','d','p','z'].map(row).join('');
 else if(tab==='ctrl')body=INP.touch?`<p>Arrastra el dedo en cualquier punto para moverte (joystick flotante). Pulsa DASH con otro dedo sin soltar el joystick.</p>`+row('vib'):`<div class="hint"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / flechas: mover</span><span><kbd>Espacio</kbd> / <kbd>Shift</kbd>: dash</span><span><kbd>Esc</kbd> / <kbd>P</kbd>: pausa</span><span><kbd>1</kbd>–<kbd>3</kbd>: elegir carta</span><span><kbd>F3</kbd>: diagnóstico</span></div>`+row('vib');
 else body=['rf','cm'].map(row).join('');
 U.innerHTML=`<div class="pn">${topBar('Ajustes')}<div class="tabs">${TABS.map(t=>`<button data-t="${t[0]}" class="${t[0]===tab?'on':''}" title="${t[1]}">${icon(t[2],18)}<span>${t[1]}</span></button>`).join('')}</div>${body}</div>`;
 bindBack();U.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>UI.show('ajustes',{tab:b.dataset.t}));
 if($('rm')){$('rm').oninput=e=>{s.mv=e.target.value/100;applyG();save()};$('re').oninput=e=>{s.sv=e.target.value/100;applyG();save();sfx.lvl()};$('sn2').onclick=()=>{M.mute=!M.mute;save();UI.show('ajustes',{tab})}}
 U.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{const k=b.dataset.g;s[k]=(s[k]+1)%SO[k].length;applyG();save();UI.show('ajustes',{tab})})},{state:'menu'});

/* ---------- Pausa ---------- */
function pauseP(){S='pause';jo=null;jx=jy=0;UI.stack=[];UI.cur=null;UI.show('pausa')}
UI.def('pausa',()=>{
 U.innerHTML=`<div class="pn"><h2>Pausa</h2><div class="chips"><span class="chip">${icon('clock',14)}${fmt(T)}</span><span class="chip">${icon('skull',14)}${K}</span><span class="chip">${icon('chevrons-up',14)}Nv ${P.lvl}</span></div>
 <button class="pri" id="p1">${icon('play',22)} Continuar</button><button id="p2">${icon('settings',18)} Ajustes</button>
 <div class="row2"><button id="p4">${icon('rotate-ccw',18)} Reiniciar</button><button class="dng" id="p3">${icon('log-out',18)} Abandonar</button></div>
 <div class="hint">${INP.touch?'Arrastra para moverte · DASH con otro dedo':'<span><kbd>WASD</kbd> mover</span><span><kbd>Espacio</kbd> dash</span><span><kbd>Esc</kbd> continuar</span>'}</div></div>`;
 $('p1').onclick=()=>{S='play';U.innerHTML=''};$('p2').onclick=()=>UI.go('ajustes');
 $('p4').onclick=()=>confirmDlg({title:'¿Reiniciar la partida?',msg:`Se descarta el progreso de esta partida (nivel ${P.lvl}, ${K} bajas). <b>No se conservan las monedas.</b>`,ok:'Reiniciar',danger:1,onOk:()=>start(),onCancel:()=>UI.refresh()});
 $('p3').onclick=()=>confirmDlg({title:'¿Abandonar la partida?',msg:`Conservas las monedas ganadas (<b>+${coinsAtStake()}</b>) sin bonificación de victoria. La partida termina.`,ok:'Abandonar',danger:1,onOk:()=>abandonRun(),onCancel:()=>UI.refresh()})});

/* ---------- Subida de nivel y cofres ---------- */
const WL={shot:'+2 perdigones por disparo',gren:'+9 de radio de explosión',tesla:'+1 salto de la cadena',mini:'+25 % de cadencia base',molo:'+6 de radio · +0,3× de daño',flame:'+12 de alcance · +2° de apertura · más daño y quemadura',snipe:'+1× de daño por bala',storm:'+1 rayo por descarga',pulse:'+15 de radio · +0,4× de daño',lanza:'+0,4× de daño · 2 lanzas desde nv.3'};
function cards(o,first){return `<div class="lvl">`+o.map((u,i)=>`<button class="card" data-i="${i}"><span class="key">${i+1}</span>${u.ic}<span><b style="color:${u.col||'var(--c-text)'}">${u.n}</b><small>${u.s}</small>${u.fx?`<span class="fx">${u.fx}</span>`:''}</span></button>`).join('')+`</div>`}
function levelUp(){
 S='lvl';sfx.lvl();const o=pool().map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1]).slice(0,3);
 const data=o.map(u=>({ic:`<span class="ic" style="color:var(--c-warn);border-color:var(--c-warn)">${u[2]}</span>`,n:u[0],s:u[3],fx:u[4]||''}));
 U.innerHTML=`<div class="pn wide"><h2>Nivel ${P.lvl} · elige una mejora</h2>${cards(data)}</div>`;
 U.querySelectorAll('.card').forEach((b,i)=>b.onclick=()=>{ST.pick('nivel',o.map(x=>x[0]),o[i][0]);o[i][1]();S='play';U.innerHTML=''})}

/* ---------- Resultado (derrota, victoria, abandono) ---------- */
function die(){S='dead';if(!WON)sfx.die();endRun();UI.stack=[];UI.cur=null;UI.show('resultado',{kind:WON?'win':'dead'})}
function abandonRun(){if(WON){die();return}S='dead';endRun(true);UI.stack=[];UI.cur=null;UI.show('resultado',{kind:'abandon'})}
UI.def('resultado',p=>{const t={win:'¡Victoria!',dead:'Has caído',abandon:'Partida abandonada'}[p.kind];
 U.innerHTML=`<div class="pn ${p.kind==='dead'?'danger':''}"><h2>${t}</h2><div class="kv"><span>Tiempo</span><span>${fmt(T)}</span><span>Nivel</span><span>${P.lvl}</span><span>Bajas</span><span>${K}</span><span>Cofres y objetos</span><span>${RIn}</span><span>Monedas</span><span style="color:var(--c-warn)">+${gain}</span></div>${p.kind==='abandon'?'<p>Monedas conservadas, sin bonificación de victoria.</p>':''}${UN?`<p>${UN}</p>`:''}<button class="pri" id="rt">${icon('rotate-ccw',22)} Reintentar</button><button id="bk">${icon('house',18)} Menú principal</button><button class="ghost" id="ex">${icon('download',18)} Exportar estadísticas</button></div>`;
 $('rt').onclick=()=>start();$('bk').onclick=()=>UI.home();$('ex').onclick=()=>ST.download('json')});

/* Esc: volver atrás en menús (la pausa y los diálogos gestionan Esc por su cuenta) */
addEventListener('keydown',e=>{if(e.key!=='Escape'||e.repeat||$('dlg-no'))return;const c=UI.cur;if(!c)return;
 if(S==='menu'&&c.n!=='principal'&&c.n!=='titulo'){e.preventDefault();UI.back()}
 else if(S==='pause'&&c.n!=='pausa'){e.preventDefault();UI.back()}});

title();/* arranque */
