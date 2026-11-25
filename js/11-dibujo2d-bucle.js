function bg(ox,oy){
 X.save();X.translate(ox%256,oy%256);X.fillStyle=GP;X.fillRect(-256,-256,W+512,H+512);X.restore();
 const s=90,x0=Math.floor(-ox/s),y0=Math.floor(-oy/s);
 for(let cx=x0;cx<=x0+W/s+1;cx++)for(let cy=y0;cy<=y0+H/s+1;cy++){
  const h=((cx*73856093)^(cy*19349663))>>>0,r=h%100,px=cx*s+ox+(h>>>8)%50,py=cy*s+oy+(h>>>14)%50;
  const dd=r<14?0:r<22?1:r<30?2:r<33?3:r<36?4:-1;if(dd>=0){const im=DC[dd];X.drawImage(im,Math.round(px)-im.width/SC/2,Math.round(py)-im.height/SC/2,im.width/SC,im.height/SC)}
  
  
  
  
 }
}
function draw2D(){X=XL;X.setTransform(.5,0,0,.5,0,0);X.imageSmoothingEnabled=true;X.imageSmoothingQuality='high';
 const ox=Math.round(W/2-(P?P.x:T*20)),oy=Math.round(H/2-(P?P.y:0));
 bg(ox,oy);
 if(P&&S!=='menu'){
  for(const c of CH){const x=Math.round(c.x+ox),y=Math.round(c.y+oy);X.shadowColor='#ffb800';X.shadowBlur=20;X.drawImage(SPR_C,x-24,y-24,48,48);X.shadowBlur=0}
  const tm=performance.now()/1000;if(WO){const x=Math.round(WO.x+ox),y=Math.round(WO.y+oy);X.save();X.translate(x,y);X.shadowColor='#ffb800';X.shadowBlur=30;X.rotate(tm*1.3);X.drawImage(SPR_W,-72,-72,144,144);X.restore();X.fillStyle='#e5484d';X.beginPath();X.moveTo(x-8,y-86);X.lineTo(x+8,y-86);X.lineTo(x,y-72);X.fill()}
  for(const o of OBL){const x=Math.round(o.x+ox),y=Math.round(o.y+oy);X.shadowColor='#4de0ff';X.shadowBlur=o.c>0?30:12;X.drawImage(SPR_O,x-24,y-72,48,80);X.shadowBlur=0;if(o.c>0){X.strokeStyle='#4de0ff';X.lineWidth=3;X.beginPath();X.arc(x,y,40,-1.57,-1.57+o.c/4*6.283);X.stroke()}}
  for(const p of PT){const x=Math.round(p.x+ox),y=Math.round(p.y+oy);X.shadowColor=p.t>0?'#ff3030':'#b56bff';X.shadowBlur=24;X.drawImage(SPR_PT[(tm*6|0)&1],x-32,y-32,64,64);X.shadowBlur=0;if(p.t>0){X.fillStyle='#fff';X.font='14px monospace';X.textAlign='center';X.fillText(Math.ceil(p.t),x,y-40)}}
  for(const o of OB){const x=Math.round(o.x+ox),y=Math.round(o.y+oy+Math.sin(tm*3+o.x)*3);X.shadowColor=RC[o.r];X.shadowBlur=16;X.fillStyle=RC[o.r];for(let i=-6;i<=6;i++){const w=6-Math.abs(i);X.fillRect(x-w,y+i,w*2+1,1)}X.shadowBlur=0;X.fillStyle='#fff';X.fillRect(x-2,y-3,2,2)}
  for(const r of RP){const x=Math.round(r.x+ox),y=Math.round(r.y+oy+Math.sin(tm*2+r.x)*3);X.shadowColor=RC[RL[r.i][2]];X.shadowBlur=18;X.font='22px serif';X.textAlign='center';X.fillText(RL[r.i][1],x,y+8);X.shadowBlur=0}
  for(const g of G){X.fillStyle='#4de0ff';X.beginPath();X.moveTo(g.x+ox,g.y+oy-6);X.lineTo(g.x+ox+4,g.y+oy);X.lineTo(g.x+ox,g.y+oy+6);X.lineTo(g.x+ox-4,g.y+oy);X.fill()}
  const OBV=viewObs();for(const o of OBV)if(o.t===2)drawOb(o,ox,oy);for(const o of OBV)if(o.t!==2&&o.y<=P.y)drawOb(o,ox,oy);E.sort((a,b)=>a.y-b.y);
  for(const e of E){const ph=(T*8+e.x*.05|0)&3,s=SZ[e.k][(ph>>1)&1],z=(e.sz||e.z||1)*Math.max(.8,Math.min(1.25,1+(e.y-P.y)/H*.3));X.save();X.translate(Math.round(e.x+ox),Math.round(e.y+oy));X.fillStyle='#0004';X.beginPath();X.ellipse(0,e.boss?e.r:e.r*1.7,e.r,e.r*.4,0,0,7);X.fill();if(e.boss){X.shadowColor='#ff3030';X.shadowBlur=26}X.scale(e.x<P.x?1:-1,1);X.drawImage(s,-32*z,-32*z-(ph&1)*2*z,64*z,64*z);X.restore()}
  X.globalCompositeOperation='lighter';for(const b of B){const bx=Math.round(b.x+ox),by=Math.round(b.y+oy);X.strokeStyle=b.col;X.globalAlpha=.45;X.lineWidth=5;X.lineCap='round';X.beginPath();X.moveTo(bx-b.vx*.03,by-b.vy*.03);X.lineTo(bx,by);X.stroke();X.globalAlpha=1;X.lineWidth=2.2;X.beginPath();X.moveTo(bx-b.vx*.018,by-b.vy*.018);X.lineTo(bx,by);X.stroke();X.strokeStyle='#fff';X.lineWidth=1;X.beginPath();X.moveTo(bx-b.vx*.008,by-b.vy*.008);X.lineTo(bx,by);X.stroke()}X.globalCompositeOperation='source-over';
  for(const f of FX){if(f.k==='x')fx(f,ox,oy);
   else if(f.k==='z')fz(f,ox,oy);else if(f.k==='f')fc(f,ox,oy);else zig(f.pts,ox,oy)}
  for(let i=0;i<P.orbs;i++){const a=P.oa+i*6.283/P.orbs;X.save();X.translate(W/2+Math.cos(a)*55,H/2+Math.sin(a)*55);X.rotate(P.oa*5);X.shadowColor='#9fb4c8';X.shadowBlur=8;X.fillStyle='#c9ced6';X.beginPath();for(let k=0;k<16;k++){const rr=k%2?7:11.5,aa=k*.3927;X.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr)}X.closePath();X.fill();X.shadowBlur=0;X.strokeStyle='#3d424b';X.lineWidth=1.5;X.stroke();X.fillStyle='#8a919c';X.beginPath();X.arc(0,0,5,0,7);X.fill();X.fillStyle='#2a2d33';X.beginPath();X.arc(0,0,2,0,7);X.fill();X.restore()}
  X.fillStyle='#0005';X.beginPath();X.ellipse(W/2,H/2+25,13,5,0,0,6.283);X.fill();
  if(P.aura){X.strokeStyle='rgba(255,120,40,.45)';X.lineWidth=2;X.beginPath();X.arc(W/2,H/2,75,0,7);X.stroke()}X.save();X.translate(Math.round(W/2),Math.round(H/2));X.scale(P.f||1,1);const cr=CHR[M.ch][2];if(cr){X.shadowColor=RC[cr];X.shadowBlur=14}const ph=P.mv?(performance.now()/100|0)%4:0;X.drawImage((SPC[M.ch]||SPS)[(ph>>1)&1],-32,-31-(ph&1)*2,64,64);X.restore();if(P.mf>0){const fx_=W/2+(P.f||1)*34,fy=H/2;X.globalCompositeOperation='lighter';const g=X.createRadialGradient(fx_,fy,0,fx_,fy,18);g.addColorStop(0,'rgba(255,250,200,1)');g.addColorStop(.4,'rgba(255,170,40,.7)');g.addColorStop(1,'rgba(255,100,0,0)');X.fillStyle=g;X.fillRect(fx_-18,fy-18,36,36);X.globalCompositeOperation='source-over'}for(const o of OBV)if(o.t!==2&&o.y>P.y)drawOb(o,ox,oy);
  [[CH[0],'#ffb800'],[WO,'#ff9a3c'],[OBL[0],'#4de0ff'],[PT[0],'#b56bff'],[RP[0],'#ffffff']].forEach(([c,col])=>{if(!c)return;const a=Math.atan2(c.y-P.y,c.x-P.x),r=Math.min(W,H)/2-34;if(Math.hypot(c.x-P.x,c.y-P.y)>r+14){X.save();X.translate(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r);X.rotate(a);X.fillStyle=col;X.beginPath();X.moveTo(10,0);X.lineTo(-6,-7);X.lineTo(-6,7);X.fill();X.restore()}})
 }
 const tt=performance.now()/1000;X.fillStyle='#ffb27a66';for(const p of AS){X.fillRect(Math.round(((p.x+tt*p.s*.6)%1)*W),Math.round(((p.y+tt*p.s)%1)*H),2,2)}
 const hg=X.createLinearGradient(0,0,0,H*.45);hg.addColorStop(0,'rgba(30,14,6,.6)');hg.addColorStop(1,'rgba(30,14,6,0)');X.fillStyle=hg;X.fillRect(0,0,W,H*.45);X.fillStyle=VG;X.fillRect(0,0,W,H);XM.imageSmoothingEnabled=false;XM.drawImage(LC,0,0,W,H);X=XM;
 if(!P||S==='menu')return;
 if(jo){X.strokeStyle='#ffffff55';X.lineWidth=2;X.beginPath();X.arc(jo.x,jo.y-rt,50,0,6.283);X.stroke();X.fillStyle='#ffffff55';X.beginPath();X.arc(jo.x+jx*50,jo.y-rt+jy*50,16,0,6.283);X.fill()}
 X.fillStyle='#000a';X.fillRect(0,0,W,30);
 X.fillStyle='#4de0ff';X.fillRect(0,0,W*Math.min(1,P.xp/P.need),8);
 X.fillStyle='#e5484d';X.fillRect(10,16,(W-20)*Math.max(0,P.hp/P.mhp)*.45,8);
 X.fillStyle='#fff';X.font='13px Georgia';X.textAlign='right';
 const m=Math.floor(T/60),s=Math.floor(T%60);
 X.fillText(`Nv ${P.lvl} · ${K} bajas · ${RIn} botín · ${m}:${String(s).padStart(2,'0')}`,W-10,23);
 X.textAlign='left';let ix=8;for(const [e,l] of [...Object.keys(WS).filter(k=>WS[k]).map(k=>[IW[k],WS[k]]),...Object.keys(PS).filter(k=>PS[k]).map(k=>[PV[k][1],PS[k]])]){X.font='18px serif';X.fillText(e,ix,H-16);X.font='11px Georgia';X.fillText(l,ix+17,H-6);ix+=34}
 const bs=E.find(e=>e.boss);if(bs){X.fillStyle='#000a';X.fillRect(W*.2,36,W*.6,10);X.fillStyle=bs.mg?'#ffb800':'#e5484d';X.fillRect(W*.2,36,W*.6*Math.max(0,bs.hp/bs.mhp),10)}
 if(TX.t>0){X.globalAlpha=Math.min(1,TX.t);X.textAlign='center';X.font='bold 14px monospace';X.fillStyle=TX.c;X.fillText(TX.s,W/2,66);X.globalAlpha=1}
}
let last=performance.now();
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;if(S==='play'){if(WON&&T>=P.kingVictoryAt)die();else step(dt)}draw();requestAnimationFrame(loop)}
/* El bucle arranca desde index.html cuando todos los scripts han terminado de cargar. */
