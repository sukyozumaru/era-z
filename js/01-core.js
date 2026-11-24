/* Variables globales usadas por el redimensionado desde el arranque (antes se elevaban por hoisting en un solo script). */
var R3,CAM;
const C=document.getElementById('c'),XM=C.getContext('2d'),U=document.getElementById('ui'),WR=document.getElementById('wrap');
let X=XM,W,H,rt=0,VG,LC=document.createElement('canvas'),XL=LC.getContext('2d');
function rs(){const d=Math.min(devicePixelRatio||1,3);W=WR.clientWidth;H=WR.clientHeight;rt=WR.getBoundingClientRect().top;C.width=W*d;C.height=H*d;XM.setTransform(d,0,0,d,0,0);LC.width=Math.ceil(W/2);LC.height=Math.ceil(H/2);if(R3){R3.setSize(W,H);CAM.aspect=W/H;CAM.updateProjectionMatrix()}VG=XM.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,Math.max(W,H)*.75);VG.addColorStop(0,'rgba(0,0,0,0)');VG.addColorStop(1,'rgba(100,28,0,.6)')}
addEventListener('resize',rs);rs();
let M={gold:0,d:0,h:0,s:0,x:0,own:{},w:{},found:{},ch:0,co:{0:1},rel:{},eq:[],st:{k:0,bs:0,mg:0,ob:0,pt:0,rl:0,runs:0,bt:0,win:{}},mc:{},set:{mv:.5,sv:.8,q:1,r:1,d:1,p:1,sh:1,z:1}};
try{Object.assign(M,JSON.parse(localStorage.getItem('arcane1')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('arcane1',JSON.stringify(M))}catch(e){}};
const cost=k=>Math.round(8*Math.pow(1.7,M[k]));
function pix(c){const x=c.getContext('2d'),w=c.width,h=c.height,d=x.getImageData(0,0,w,h),a=d.data,al=new Uint8Array(w*h);
for(let i=0;i<w*h;i++){const j=i*4;if(a[j+3]<110)a[j+3]=0;else{a[j+3]=255;al[i]=1;for(let k=0;k<3;k++)a[j+k]=Math.round(a[j+k]/20)*20}}
for(let y=0;y<h;y++)for(let u=0;u<w;u++){const i=y*w+u;if(al[i])continue;let f=0;for(let s=1;s<=SC&&!f;s++)if((u>=s&&al[i-s])||(u<w-s&&al[i+s])||(y>=s&&al[i-s*w])||(y<h-s&&al[i+s*w]))f=1;if(f){const j=i*4;a[j]=20;a[j+1]=14;a[j+2]=10;a[j+3]=255}}
for(let y=0;y<h;y++)for(let u=0;u<w;u++){const i=y*w+u;if(!al[i])continue;const j=i*4,z=(dx,dy,n)=>{for(let s=1;s<=n;s++){const xx=u+dx*s,yy=y+dy*s;if(xx<0||yy<0||xx>=w||yy>=h||!al[yy*w+xx])return 1}return 0};let m=0;if(z(0,-1,SC)||z(-1,0,SC))m=46;else if(z(0,-1,2*SC)||z(-1,0,2*SC))m=24;else if(z(0,1,SC)||z(1,0,SC))m=-54;else if(z(0,1,2*SC)||z(1,0,2*SC))m=-30;else if((u*7+y*13)%9===0)m=-14;else if((u*5+y*11)%13===0)m=10;if(m)for(let k=0;k<3;k++)a[j+k]=Math.max(0,Math.min(255,a[j+k]+m))}
x.putImageData(d,0,0);return c}
const SC=2,mk=(w,h,f)=>{const c=document.createElement('canvas');c.width=c.height=1;return c};
const GT=document.createElement('canvas');GT.width=GT.height=512;
{const x=GT.getContext('2d'),R=Math.random;x.fillStyle='#322b24';x.fillRect(0,0,512,512);
for(let i=0;i<12;i++){x.fillStyle=i%2?'rgba(0,0,0,.07)':'rgba(130,95,55,.06)';x.beginPath();x.arc(100+R()*312,100+R()*312,50+R()*50,0,7);x.fill()}
for(let i=0;i<5000;i++){x.fillStyle=R()<.5?`rgba(0,0,0,${R()*.25})`:`rgba(190,160,120,${R()*.09})`;x.fillRect(R()*512,R()*512,R()*5+1,R()*5+1)}
x.strokeStyle='rgba(8,6,4,.5)';x.lineWidth=1.5;for(let i=0;i<14;i++){let a=R()*440+30,b=R()*440+30;x.beginPath();x.moveTo(a,b);for(let j=0;j<5;j++)x.lineTo(a+=R()*26-8,b+=R()*26-8);x.stroke()}}
const G2=document.createElement('canvas');G2.width=G2.height=512;{const x=G2.getContext('2d');x.drawImage(GT,0,0,512,512);const d=x.getImageData(0,0,512,512),a=d.data;for(let i=0;i<a.length;i+=4)for(let k=0;k<3;k++)a[i+k]=Math.round(Math.min(255,Math.max(0,(a[i+k]-45)*2+45))/16)*16;x.putImageData(d,0,0)}
const GP=X.createPattern(G2,'repeat');try{GP.setTransform(new DOMMatrix([.5,0,0,.5,0,0]))}catch(e){}
