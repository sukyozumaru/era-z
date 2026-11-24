const SPR_P=mk(48,48,x=>{
x.fillStyle='#3b4423';x.fillRect(-13,-8,9,16);
let g=x.createLinearGradient(0,-12,0,12);g.addColorStop(0,'#8da24c');g.addColorStop(1,'#4a5828');x.fillStyle=g;x.beginPath();x.ellipse(0,0,10,13,0,0,7);x.fill();
x.fillStyle='#6b7a3a';x.fillRect(2,4,16,5);x.fillRect(2,-9,12,5);
x.fillStyle='#1c1c1c';x.fillRect(8,-3,22,5);x.fillStyle='#666';x.fillRect(8,-3,22,1.5);x.fillStyle='#111';x.fillRect(14,2,4,6);
x.fillStyle='#d9b38c';x.beginPath();x.arc(18,6,2.5,0,7);x.fill();x.beginPath();x.arc(12,-6,2.5,0,7);x.fill();
g=x.createRadialGradient(0,-2,1,2,0,9);g.addColorStop(0,'#8a9c52');g.addColorStop(1,'#45522a');x.fillStyle=g;x.beginPath();x.arc(2,0,8,0,7);x.fill();
x.strokeStyle='#ffffff66';x.lineWidth=1.5;x.beginPath();x.arc(2,0,6,3.6,4.6);x.stroke();x.fillStyle='#2a3118';x.fillRect(7,-8,2,16)});
const zs=(r,c,sk)=>mk(r*4+16,r*4+16,x=>{
x.fillStyle=sk;x.fillRect(r*.2,-r*.95,r*1.5,r*.38);x.fillRect(r*.2,r*.57,r*1.5,r*.38);
let g=x.createRadialGradient(-r*.3,-r*.3,1,0,0,r*1.3);g.addColorStop(0,c);g.addColorStop(1,'#1c1a14');x.fillStyle=g;x.beginPath();x.ellipse(-r*.1,0,r*1.05,r*1.2,0,0,7);x.fill();
x.fillStyle=sk;x.beginPath();x.arc(r*.2,0,r*.62,0,7);x.fill();
x.fillStyle='#2a1c14';x.beginPath();x.arc(-r*.05,0,r*.5,1.6,4.7);x.fill();
x.fillStyle='#ff2a2a';x.fillRect(r*.5,-r*.3,2,2.4);x.fillRect(r*.5,r*.18,2,2.4);
x.fillStyle='#7a1010';for(let i=0;i<4;i++){x.beginPath();x.arc(Math.sin(i*7)*r*.7,Math.cos(i*5)*r*.8,r*.15,0,7);x.fill()}});
const SPR_Z={a:zs(11,'#6f8f5e','#9ab08a'),b:zs(8,'#a8b58a','#c3cfa6'),c:zs(16,'#8c4a3a','#a3b08a')};
const el=(x,cx,cy,rx,ry,c)=>{x.fillStyle=c;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,7);x.fill()},rc=(x,c,...a)=>{x.fillStyle=c;x.fillRect(...a)};
const sol=f=>mk(64,64,x=>{const L=f?4:-4;
rc(x,'#3d4a22',-7+L/2,6,6,16);rc(x,'#3d4a22',1-L/2,6,6,16);rc(x,'#1c1c1c',-8+L/2,20,8,4);rc(x,'#1c1c1c',1-L/2,20,8,4);rc(x,'#5a4426',-14,-8,7,16);
const g=x.createLinearGradient(-8,0,8,0);g.addColorStop(0,'#566629');g.addColorStop(1,'#94aa50');rc(x,g,-8,-10,16,18);
rc(x,'#2e3519',-8,-2,16,3);rc(x,'#3a4620',-6,1,5,5);rc(x,'#3a4620',0,1,5,5);rc(x,'#d9b38c',-4,-20,10,10);
const h=x.createLinearGradient(0,-26,0,-14);h.addColorStop(0,'#9db05a');h.addColorStop(1,'#4a5a2a');x.fillStyle=h;x.beginPath();x.arc(1,-17,9,Math.PI,0);x.fill();rc(x,'#3a4620',-8,-17,19,3);rc(x,'#1a1a1a',3,-14,2,2);
rc(x,'#6b7a3a',2,-5,12,5);rc(x,'#1a1a1a',4,-3,28,5);rc(x,'#6a6a6a',4,-3,28,1);rc(x,'#111',12,2,4,8);rc(x,'#d9b38c',13,-4,4,4)});
const zb=(s,sk,cl,f)=>mk(64,64,x=>{x.scale(s,s);const L=f?3:-3;
rc(x,'#2b2a35',-6+L/2,6,5,13);rc(x,'#2b2a35',1-L/2,6,5,13);rc(x,'#161210',-7+L/2,17,7,3);rc(x,'#161210',-L/2,17,7,3);
const g=x.createLinearGradient(-7,0,7,0);g.addColorStop(0,cl);g.addColorStop(1,'#1a1610');rc(x,g,-7,-9,14,17);
rc(x,'#7a1010',-4,-4,4,6);rc(x,'#7a1010',2,0,3,3);rc(x,sk,5,-6,16,4);rc(x,sk,7,0,14,4);rc(x,sk,-4,-19,11,11);rc(x,'#2a1c14',-5,-20,8,5);rc(x,'#ff3030',3,-15,2,2);rc(x,'#330000',3,-11,4,2)});
const SZ={a:[zb(1,'#8fae7e','#4a5a7a',0),zb(1,'#8fae7e','#4a5a7a',1)],b:[zb(.8,'#b8c49a','#8a5a3a',0),zb(.8,'#b8c49a','#8a5a3a',1)],c:[zb(1.45,'#a7a98a','#6a3a3a',0),zb(1.45,'#a7a98a','#6a3a3a',1)]},SPS=[sol(0),sol(1)];
const DC=[mk(64,40,x=>{x.strokeStyle='#14100c';x.lineWidth=2;x.beginPath();x.moveTo(-26,-10);x.lineTo(-10,-2);x.lineTo(2,-6);x.lineTo(16,6);x.lineTo(26,10);x.moveTo(2,-6);x.lineTo(8,-16);x.stroke()}),
mk(48,32,x=>{el(x,0,0,18,9,'#5a1612');el(x,-14,6,6,4,'#5a1612');el(x,15,-7,5,3,'#5a1612');el(x,-4,-2,8,4,'#7a2018')}),
mk(40,28,x=>{rc(x,'#5a544c',-14,-4,16,10);rc(x,'#6b655c',-14,-4,16,3);rc(x,'#4d4740',-2,2,14,9);rc(x,'#6b655c',-2,2,14,2)}),
mk(64,40,x=>{rc(x,'#3d2e24',-28,-6,56,18);rc(x,'#1a1410',-16,-14,32,10);rc(x,'#0a0806',-13,-12,12,6);rc(x,'#0a0806',2,-12,12,6);rc(x,'#7a3b18',-24,6,30,3);el(x,-18,12,6,6,'#111');el(x,18,12,6,6,'#111')}),
mk(48,48,x=>{rc(x,'#2a2018',-2,-20,5,40);x.strokeStyle='#2a2018';x.lineWidth=3;x.beginPath();x.moveTo(0,-8);x.lineTo(12,-20);x.moveTo(0,0);x.lineTo(-12,-12);x.moveTo(1,-14);x.lineTo(-6,-22);x.stroke()})];
const SPR_C=mk(48,48,x=>{rc(x,'#8a5a2a',-16,-4,32,18);rc(x,'#5a3a18',-6,-4,2,18);rc(x,'#5a3a18',6,-4,2,18);rc(x,'#a56d32',-16,-14,32,10);rc(x,'#c48a4a',-16,-14,32,2);rc(x,'#ffb800',-16,-5,32,3);rc(x,'#ffb800',-14,-14,4,28);rc(x,'#ffb800',10,-14,4,28);rc(x,'#ffe070',-3,-5,6,8);rc(x,'#3a2410',-1,-1,2,3)});
const qd=(c,d,ex)=>[0,1].map(f=>mk(64,64,x=>{const L=f?3:-3;rc(x,c,-18,-8,30,15);rc(x,d,-16+L/2,6,4,11);rc(x,d,-8-L/2,6,4,11);rc(x,d,4+L/2,6,4,11);rc(x,d,10-L/2,6,4,11);rc(x,c,-30,-6,13,5);rc(x,c,10,-14,14,11);rc(x,'#ff3030',18,-11,2,2);rc(x,'#e8e0c8',14,-4,8,2);rc(x,'#cfc7ad',-12,-6,1,8);rc(x,'#cfc7ad',-8,-6,1,8);rc(x,'#cfc7ad',-4,-6,1,8);rc(x,'#7a1010',-8,-4,6,5);ex(x)}));
SZ.rap=qd('#6f8f5e','#3a4a30',x=>{rc(x,'#eee',16,8,2,5);rc(x,'#6f8f5e',22,-12,4,6)});
SZ.sab=qd('#b08a50','#6a4a28',x=>{rc(x,'#fff',17,-4,2,6);rc(x,'#fff',21,-4,2,6)});
SZ.tri=qd('#7a8f6a','#4a5a40',x=>{rc(x,'#e8e0c8',20,-18,2,8);rc(x,'#e8e0c8',24,-12,6,2);rc(x,'#8a5a5a',6,-22,6,12)});
SZ.mam=qd('#6a5040','#3a2a20',x=>{rc(x,'#6a5040',22,-4,4,14);rc(x,'#f0ead8',20,2,10,3);rc(x,'#f0ead8',12,-2,3,8)});
SZ.pte=[0,1].map(f=>mk(64,64,x=>{x.fillStyle='#5a6a4a';x.beginPath();x.moveTo(-4,-2);x.lineTo(-24,f?-24:6);x.lineTo(-10,2);x.lineTo(2,f?-26:8);x.lineTo(8,0);x.fill();rc(x,'#6f8f5e',-8,-4,16,9);rc(x,'#6f8f5e',8,-6,12,5);rc(x,'#d8a030',20,-4,8,2);rc(x,'#ff3030',14,-5,2,2);rc(x,'#cfc7ad',-4,-2,1,5)}));
const SPR_O=mk(48,80,x=>{rc(x,'#3a3f4a',-9,-14,18,44);rc(x,'#525968',-9,-14,5,44);x.fillStyle='#3a3f4a';x.beginPath();x.moveTo(-9,-14);x.lineTo(0,-30);x.lineTo(9,-14);x.fill();rc(x,'#4de0ff',-2,-8,4,4);rc(x,'#4de0ff',-2,2,4,8);rc(x,'#4de0ff',-2,16,4,4);rc(x,'#2a2e38',-13,30,26,5)});
const SPR_PT=[0,1].map(f=>mk(64,64,x=>{x.lineWidth=6;x.strokeStyle=f?'#c08cff':'#8a4bd8';x.beginPath();x.ellipse(0,0,18,28,0,0,7);x.stroke();el(x,0,0,10,20,f?'#2a1050':'#3a1a70');el(x,0,0,5,11,f?'#4de0ff':'#fff')}));
