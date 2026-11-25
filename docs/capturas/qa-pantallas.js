/* Era Z — comprobación automática de pantallas (QA). Cargar en la consola del juego:
   eval(await (await fetch('docs/capturas/qa-pantallas.js')).text()); QA()
   Recorre todas las pantallas y comprueba: cabe en el viewport, sin desbordamiento horizontal, botones ≥ 44 px. */
window.QA=function(){const out={};const vw=innerWidth,vh=innerHeight;
 const check=name=>{const p=U.querySelector('.pn');if(!p){out[name]='sin panel';return}const b=p.getBoundingClientRect();let hov=false,small=[];
  p.querySelectorAll('*').forEach(c=>{const r=c.getBoundingClientRect();if(r.width&&r.right>b.right+1.5&&getComputedStyle(c).position!=='absolute')hov=true});
  p.querySelectorAll('button').forEach(c=>{const r=c.getBoundingClientRect();if(r.width&&r.height<43.5)small.push(c.textContent.trim().slice(0,12)+':'+Math.round(r.height))});
  out[name]={fits:b.left>=-1&&b.right<=vw+1&&b.top>=-1&&b.bottom<=vh+1,w:Math.round(b.width),h:Math.round(b.height),scroll:p.scrollHeight>p.clientHeight+1,hOverflow:hov,small}};
 const R="MD=MODES[0];MI=0;M.seen=1;start();for(let i=0;i<120;i++){P.hp=P.mhp;step(.05)}";
 title();check('titulo');UI.home();check('principal');UI.go('dificultad');check('dificultad');UI.home();UI.go('personajes');check('personajes');
 UI.home();UI.go('ajustes');check('ajustes-audio');for(const t of['graf','ctrl','acc']){UI.show('ajustes',{tab:t});check('ajustes-'+t)}
 UI.home();UI.go('misiones');check('misiones');UI.home();UI.go('taller');check('taller');UI.home();UI.go('historia',{i:0,then:'back'});check('historia');clearInterval(UI.tw);
 eval(R);pauseP();check('pausa');UI.refresh();document.getElementById('p3').click();check('confirmar');UI.refresh();
 eval(R);P.xp=P.need;step(.05);check('nivel');eval(R);pick3();check('cofre');
 eval(R);P.hp=0;step(.05);check('derrota');
 const bad=Object.entries(out).filter(([k,v])=>typeof v==='object'&&(!v.fits||v.hOverflow||v.small.length));
 return{viewport:[innerWidth,innerHeight],pantallas:Object.keys(out).length,problemas:bad,detalle:out}};
