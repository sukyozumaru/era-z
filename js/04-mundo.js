function world(dt){
if(P.bf>0)P.bf-=dt;P.mf-=dt;P.dc-=dt;P.iv-=dt;P.dsh-=dt;TX.t-=dt;
if(K>=WN&&!WO){const a=Math.random()*6.283;WO={x:P.x+Math.cos(a)*600,y:P.y+Math.sin(a)*600};WN=K+70;toast('¡Apareció la Ruleta gigante!',3);sfx.lvl()}
DS='aura';if(P.aura)for(const e of E)if(!e.dead&&(e.x-P.x)**2+(e.y-P.y)**2<5600)hit(e,P.aura*dt);
const rp=r=>{const a=Math.random()*6.283,d=r*2.4+Math.random()*500;return{x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d}};
if(T>=NT.o&&OB.length<3){OB.push({...rp(160),r:roll4([50,30,15,5])});NT.o=T+14}
if(T>=NT.r&&RP.length<2){RP.push({...rp(220),i:pickRel(0)});NT.r=T+45}
if(T>=NT.b&&OBL.length<1){OBL.push({...rp(260),c:0});NT.b=T+70}
if(T>=NT.p&&PT.length<1){PT.push({...rp(280),t:-1});NT.p=T+110}
if(T>=NB){const n=Math.round(NB/300);NB+=300;bossSpawn(n,n%2===0)}
for(const o of OB)if(Math.hypot(P.x-o.x,P.y-o.y)<22){o.d=1;orbFx(o.r)}OB=OB.filter(o=>!o.d);
for(const r of RP)if(Math.hypot(P.x-r.x,P.y-r.y)<24){r.d=1;getRel(r.i)}RP=RP.filter(r=>!r.d);
for(const o of OBL){if(Math.hypot(P.x-o.x,P.y-o.y)<70)o.c+=dt;else o.c=Math.max(0,o.c-dt);if(o.c>=4){o.d=1;M.st.ob++;ST.reward('obelisco');toast('¡Obelisco activado!',3);P.xp+=P.need;getRel(pickRel(2));drop(1,o.x,o.y)}}OBL=OBL.filter(o=>!o.d);
for(const p of PT){if(p.t<0){if(Math.hypot(P.x-p.x,P.y-p.y)<34){p.t=20;toast('¡Portal abierto! Sobrevive 20 s',2)}}else{p.t-=dt;p.s=(p.s||0)-dt;if(p.s<=0){p.s=.18;for(let i=0;i<3;i++)spawn()}if(p.t<=0){p.d=1;M.st.pt++;ST.reward('portal');toast('¡Portal cerrado! Recompensa',3);drop(2,p.x,p.y);getRel(pickRel(1));BG+=15}}}PT=PT.filter(p=>!p.d);
for(const e of E)if(e.boss&&!e.king){e.bt-=dt;if(e.bt<=0){e.bt=7;for(let i=0;i<6;i++)spawn()}}}
