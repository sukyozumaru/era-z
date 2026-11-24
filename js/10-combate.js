function spawn(){
 if(E.length>=LIM.enemies)return;
 const a=Math.random()*6.283,d=Math.max(W,H)/2+60+Math.random()*320,r=Math.random();
 const e={x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d,c:0,a:0};
 Object.assign(e,pickE());
 if(T>=240&&Math.random()<.06){e.el=1;e.hp*=4;e.r*=1.35;e.dm*=1.3;e.xp=Math.max(e.xp*3,6);e.sz=1.35}
 
 
 E.push(e);
}
function hit(e,d){if(e.dead)return;if(Math.random()<P.crit)d*=2;if(P.bf>0)d*=1.6;if(d>2)spark3(e.x,hH(e.x,e.y)+20,e.y,4,['#ffe27a','#fff6c0'],110,.25,260);if(d>2&&DN.length<40&&(!e.dn||T-e.dn>.12)){e.dn=T;DN.push({x:e.x,y:e.y,z:hH(e.x,e.y)+36,t:.7,s:Math.round(d),c:d>P.dmg*1.8?'#ffd84a':'#ffffff'})}if(d>2&&!e.boss){const a=Math.atan2(e.y-P.y,e.x-P.x),f=Math.min(90,d*4);e.kx=(e.kx||0)+Math.cos(a)*f;e.ky=(e.ky||0)+Math.sin(a)*f}e.hp-=d;if(e.hp<=0){e.dead=1;K++;sfx.kill();spark3(e.x,hH(e.x,e.y)+16,e.y,e.boss?40:12,e.k==='a'||e.k==='b'||e.k==='c'?['#7bc47f','#5a1612','#3a4a30']:['#b03030','#5a1612','#cfc7ad'],150,.7,520);{const a=Math.atan2(e.y-P.y,e.x-P.x),f=e.boss?60:240+Math.random()*120;CPS.push({k:e.k,x:e.x,y:e.y,h:hH(e.x,e.y)+12,vx:Math.cos(a)*f,vz:Math.sin(a)*f,vy:e.boss?120:260+Math.random()*120,sp:(Math.random()-.5)*14,r:0,a:e.a,l:1.4,z:e.sz||1})}if(e.boss)bossLoot(e);if(e.el){for(let i=0;i<4;i++)G.push({x:e.x+Math.random()*40-20,y:e.y+Math.random()*40-20,v:3})}if(e.k==='bom'){FX.push({k:'x',x:e.x,y:e.y,r:70,t:.35});sfx.boom();if(Math.hypot(e.x-P.x,e.y-P.y)<75&&!(P.bf>0||P.iv>0))P.hp-=28*MD.d*P.red;for(const o of E)if(!o.dead&&o!==e&&Math.hypot(o.x-e.x,o.y-e.y)<70)hit(o,e.dm*2)}if(P.boom&&!inB){inB=1;for(const o of E)if(!o.dead&&Math.hypot(o.x-e.x,o.y-e.y)<55)hit(o,12+P.dmg*.5);inB=0}if(e.xp>=2||Math.random()<.5)G.push({x:e.x,y:e.y,v:e.xp*1.5});if(P.vamp)P.hp=Math.min(P.mhp,P.hp+P.vamp)}}
function near(r){let t=null,bd=r*r;for(const e of E){if(e.dead)continue;const d=(e.x-P.x)**2+(e.y-P.y)**2;if(d<bd){bd=d;t=e}}return t}
const shoot=(a,s,l,d,col)=>{P.mf=.07;B.push({x:P.x,y:P.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l,d,col})};
function step(dt){
 T+=dt;
 let dx=jx+keys.d-keys.a,dy=jy+keys.s-keys.w,l=Math.hypot(dx,dy);if(l>1){dx/=l;dy/=l}
 if(l>.1)P.a=Math.atan2(dy,dx);P.mv=l>.1;if(Math.abs(dx)>.1)P.f=dx>0?1:-1;
 P.x+=dx*P.spd*(P.slv?.78:1)*dt;P.y+=dy*P.spd*(P.slv?.78:1)*dt;P.sl=0;hitObs(P,9);P.slv=P.sl;if(P.dsh>0){P.x+=Math.cos(P.da)*560*dt;P.y+=Math.sin(P.da)*560*dt;hitObs(P,9);if(P.hs)for(const e of E){if(e.dead||P.hs.has(e))continue;if(Math.hypot(e.x-P.x,e.y-P.y)<e.r+46){P.hs.add(e);hit(e,P.dmg*4+25);snd(900,.07,'square',.07,.4);spark3(e.x,hH(e.x,e.y)+22,e.y,10,['#ffffff','#ff4040','#cfe8ff'],200,.3,300)}}}P.hp=Math.min(P.mhp,P.hp+P.reg*dt);world(dt);
 sp-=dt;if(sp<=0&&E.length<LIM.wave){sp=Math.max(.08,.6-T*.004);for(let i=0,n=2+(T/30|0)+MD.x;i<n;i++)spawn()}
 if(T>=NC&&CH.length<2){const a=Math.random()*6.283,d=420+Math.random()*600;CH.push({x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d});NC=T+80}
 for(const e of E){e.a=Math.atan2(P.y-e.y,P.x-e.x);const pd=Math.hypot(P.x-e.x,P.y-e.y),mvf=(e.k==='spit'&&pd<230)?0:1;e.x+=Math.cos(e.a)*e.sp*.66*dt*mvf;e.y+=Math.sin(e.a)*e.sp*.66*dt*mvf;if(e.k==='spit'){e.fc=(e.fc===undefined?Math.random()*2:e.fc)-dt;if(e.fc<=0&&pd<420&&EB.length<LIM.eb){e.fc=2.4;EB.push({x:e.x,y:e.y,vx:Math.cos(e.a)*230,vy:Math.sin(e.a)*230,l:2.2,d:e.dm,col:'#9bff4a'})}}if(e.el&&Math.random()<.1)spark3(e.x,hH(e.x,e.y)+34,e.y,1,['#ffb800'],25,.5,0);if(e.k!=='pte')hitObs(e,e.r*.6);if(e.kx||e.ky){e.x+=e.kx*dt;e.y+=e.ky*dt;const f=Math.pow(.02,dt);e.kx*=f;e.ky*=f}e.c-=dt;if(Math.hypot(P.x-e.x,P.y-e.y)<e.r+10){P.hp-=(P.bf>0||P.iv>0)?0:e.dm*dt*P.red;if(P.th)hit(e,P.th*dt);if(T-lh>.4){lh=T;sfx.hurt();HF=.4;buzz(25)}}}
 for(let i=0;i<E.length;i++){const a=E[i];for(let j=i+1;j<E.length;j++){const b=E[j],dx=a.x-b.x,dy=a.y-b.y,m=(a.r+b.r)*.8;if(dx>m||dx<-m||dy>m||dy<-m)continue;const d=Math.hypot(dx,dy)||1;if(d<m){const p=(m-d)*.5/d;a.x+=dx*p;a.y+=dy*p;b.x-=dx*p;b.y-=dy*p}}}
 P.cd-=dt;for(const k in CD)CD[k]-=dt;
 if(P.cd<=0){const t=near(420);if(t){P.cd=1/P.rate;const a=Math.atan2(t.y-P.y,t.x-P.x);P.a=a;P.f=Math.cos(a)>=0?1:-1;for(let i=0;i<P.proj;i++)shoot(a+(i-(P.proj-1)/2)*.18,460,1.1,P.dmg,'#ffe27a');sfx.shot()}}
 if(WS.shot&&CD.shot<=0){const t=near(260);if(t){CD.shot=1.6/Math.sqrt(P.rate);const a=Math.atan2(t.y-P.y,t.x-P.x);for(let i=0;i<4+2*WS.shot;i++)shoot(a+(Math.random()-.5)*.7,420+Math.random()*80,.4,P.dmg*.6,'#ff9a3c');snd(300,.12,'sawtooth',.07,.4)}}
 if(WS.gren&&CD.gren<=0){const t=near(450);if(t){CD.gren=2.4/Math.sqrt(P.rate);const r=55+9*WS.gren;FX.push({k:'x',x:t.x,y:t.y,r,t:.35});sfx.boom();for(const e of E)if(Math.hypot(e.x-t.x,e.y-t.y)<r+e.r)hit(e,P.dmg*2.2)}}
 if(WS.tesla&&CD.tesla<=0){let c=near(300);if(c){CD.tesla=1.7/Math.sqrt(P.rate);const pts=[{x:P.x,y:P.y}],u=new Set;
  for(let i=0;i<2+WS.tesla&&c;i++){pts.push({x:c.x,y:c.y});hit(c,P.dmg*1.6);u.add(c);let nx=null,bd=28900;for(const e of E){if(e.dead||u.has(e))continue;const d=(e.x-c.x)**2+(e.y-c.y)**2;if(d<bd){bd=d;nx=e}}c=nx}
  FX.push({k:'l',pts,t:.18});sfx.zap()}}
 if(WS.mini&&CD.mini<=0){const t=near(380);if(t){CD.mini=.2/(1+.25*WS.mini)/Math.sqrt(P.rate);shoot(Math.atan2(t.y-P.y,t.x-P.x)+(Math.random()-.5)*.15,560,.8,P.dmg*.4,'#ff5a4a')}}
 if(WS.flame&&CD.flame<=0){const t=near(130);if(t){CD.flame=.18;const a=Math.atan2(t.y-P.y,t.x-P.x);for(const e of E){if(e.dead)continue;const q=Math.atan2(e.y-P.y,e.x-P.x)-a;if(Math.hypot(e.x-P.x,e.y-P.y)<120+WS.flame*8&&Math.cos(q)>.75)hit(e,P.dmg*(.5+.15*WS.flame))}FX.push({k:'f',x:P.x,y:P.y,a,t:.15})}}
 if(WS.snipe&&CD.snipe<=0){const t=near(600);if(t){CD.snipe=2.4/Math.sqrt(P.rate);shoot(Math.atan2(t.y-P.y,t.x-P.x),900,1,P.dmg*(3+WS.snipe),'#ffffff');B[B.length-1].p=1;snd(150,.2,'sawtooth',.1,.3)}}
 if(WS.molo&&CD.molo<=0){const t=near(400);if(t){CD.molo=3/Math.sqrt(P.rate);FX.push({k:'z',x:t.x,y:t.y,r:48+6*WS.molo,t:3,d:P.dmg*(.9+.3*WS.molo)})}}
 if(WS.storm&&CD.storm<=0&&E.length){CD.storm=1.3/Math.sqrt(P.rate);for(let i=0;i<1+WS.storm;i++){const e=E[Math.random()*E.length|0];if(e&&!e.dead){hit(e,P.dmg*3);FX.push({k:'l',sky:1,pts:[{x:e.x,y:e.y},{x:e.x,y:e.y}],t:.2})}}sfx.zap()}
 if(WS.pulse&&CD.pulse<=0&&near(150)){CD.pulse=4.2/Math.sqrt(P.rate);const r=105+15*WS.pulse;FX.push({k:'x',x:P.x,y:P.y,r,t:.35});sfx.boom();for(const e of E)if(!e.dead&&Math.hypot(e.x-P.x,e.y-P.y)<r+e.r){hit(e,P.dmg*(1.4+.4*WS.pulse));if(!e.boss){const a=Math.atan2(e.y-P.y,e.x-P.x);e.kx=(e.kx||0)+Math.cos(a)*260;e.ky=(e.ky||0)+Math.sin(a)*260}}}
 if(WS.lanza&&CD.lanza<=0){const t=near(520);if(t){CD.lanza=1.9/Math.sqrt(P.rate);const n=WS.lanza>=3?2:1,a=Math.atan2(t.y-P.y,t.x-P.x);for(let i=0;i<n;i++){shoot(a+(i-(n-1)/2)*.2,620,.9,P.dmg*(2.2+.4*WS.lanza),'#d9b38c');B[B.length-1].p=1}snd(260,.1,'triangle',.07,.5)}}
 for(const b of B){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;for(const e of E){if(!e.dead&&Math.hypot(b.x-e.x,b.y-e.y)<e.r+5){if(b.p){b.hs=b.hs||new Set;if(b.hs.has(e))continue;b.hs.add(e);hit(e,b.d)}else{hit(e,b.d);b.l=0;break}}}}
 B=B.filter(b=>b.l>0);
 for(const b of EB){b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;if(Math.hypot(b.x-P.x,b.y-P.y)<16){b.l=0;if(!(P.bf>0||P.iv>0)){P.hp-=b.d*P.red;if(T-lh>.4){lh=T;sfx.hurt();HF=.4}}}}
 EB=EB.filter(b=>b.l>0);
 P.oa+=dt*2.6;
 for(let i=0;i<P.orbs;i++){const a=P.oa+i*6.283/P.orbs,ox=P.x+Math.cos(a)*55,oy=P.y+Math.sin(a)*55;
  for(const e of E)if(!e.dead&&e.c<=0&&Math.hypot(ox-e.x,oy-e.y)<e.r+9){hit(e,P.dmg*.8);e.c=.4}}
 for(const f of FX){f.t-=dt;if(f.k==='z')for(const e of E)if(!e.dead&&Math.hypot(e.x-f.x,e.y-f.y)<f.r)hit(e,f.d*dt)}FX=FX.filter(f=>f.t>0);
 E=E.filter(e=>!e.dead);
 for(const g of G){const d=Math.hypot(P.x-g.x,P.y-g.y)||1;if(d<P.mag||g.m){g.m=1;g.x+=(P.x-g.x)/d*340*dt;g.y+=(P.y-g.y)/d*340*dt}if(d<14){g.d=1;P.xp+=g.v*P.xpm;sfx.gem()}}
 G=G.filter(g=>!g.d);
 if(G.length>LIM.gems){const ex=G.splice(0,G.length-LIM.gems);let v=0;for(const g of ex)v+=g.v;G[G.length-1].v+=v}
 if(FX.length>LIM.fx)FX.splice(0,FX.length-LIM.fx);
 if(CPS.length>LIM.corpses)CPS.splice(0,CPS.length-LIM.corpses);
 if(P.hp<=0){if(P.rev){P.rev=0;P.hp=P.mhp*.5;P.bf=4;toast('¡Revives!',3)}else{die();return}}
 const c=CH.find(c=>Math.hypot(P.x-c.x,P.y-c.y)<28);if(c){CH=CH.filter(x=>x!==c);pick3();return}
 if(WO&&Math.hypot(P.x-WO.x,P.y-WO.y)<64){WO=null;spin('wheel');return}
 if(P.xp>=P.need){P.xp-=P.need;P.lvl++;P.need=Math.round(P.need*1.28+3);levelUp()}
}
