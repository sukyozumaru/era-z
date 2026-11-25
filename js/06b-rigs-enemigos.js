/* Era Z — rigs propios del Escupidor y el Hinchado (siluetas distintas a los zombis humanos).
   Usan los mismos ayudantes voxel de 06-render3d.js (cp, sp_, piv, eye). userData.cu=1 activa su animación propia. */
function rigSpit(){
 const g=new TH.Group(),skin='#a9c23a',dark='#5a6a1c';
 const t=cp(4.6,10,dark);t.position.set(0,19,0);t.rotation.z=-.55;g.add(t);
 const neck=cp(2.2,9,skin);neck.position.set(7,25,0);neck.rotation.z=-1;g.add(neck);
 const hd=sp_(4.6,skin,1.35,.85,.9);hd.position.set(13,26,0);g.add(hd);
 const jaw=sp_(3.2,dark,1.5,.4,.8);jaw.position.set(14,22.5,0);g.add(jaw);
 const sac=sp_(5.2,'#d6ff4a',1,1.15,1);sac.position.set(10,20,0);g.add(sac);
 eye(g,15,28,-2.2,.9);eye(g,15,28,2.2,.9);
 for(let i=0;i<3;i++){const c=new TH.Mesh(gcg('spk'+i,()=>new TH.ConeGeometry(1.6,6,5)),sm('#3a4a10'));c.position.set(-3-i*2.5,28-i*1.5,0);c.rotation.z=.5;g.add(c)}
 const lg=[-3.4,3.4].map(z=>{const l=cp(2.4,8,dark);l.position.y=-5;const f=sp_(3,'#161210',1.5,.7,1);f.position.set(1.5,-10,0);const p=piv(-1,12,z,l,f);g.add(p);return p});
 const ar=[-6,6].map(z=>{const a=cp(1.8,9,skin);a.position.y=-5;const p=piv(3,22,z,a);p.rotation.z=.2;g.add(p);return p});
 g.userData={lg,ar,sac,sacS:sac.scale.clone(),cu:1,rear:1};return g}
function rigBom(){
 const g=new TH.Group(),skin='#d9a05a',belly='#d98a3a';
 const b=sp_(11,belly,1.05,1,1.05);b.position.set(0,20,0);g.add(b);
 for(let i=0;i<8;i++){const a=i*2.4,r=1.6+(i%3)*.7,bs=new TH.Mesh(SPGx(),mat('#fff0a0'));bs.scale.setScalar(r);bs.position.set(Math.cos(a)*10.4,20+Math.sin(i*1.7)*7.5,Math.sin(a)*10.4);g.add(bs)}
 const hd=sp_(4,skin,1,1,1);hd.position.set(8,32,0);g.add(hd);eye(g,11.6,32.6,-1.8,.8);eye(g,11.6,32.6,1.8,.8);
 const lg=[-4,4].map(z=>{const l=cp(2.8,5,'#5a3a1a');l.position.y=-3;const f=sp_(3.4,'#161210',1.5,.7,1);f.position.set(1.5,-8,0);const p=piv(0,9,z,l,f);g.add(p);return p});
 const ar=[-10,10].map(z=>{const a=cp(2,6,skin);a.position.y=-4;const p=piv(0,24,z,a);p.rotation.z=.5;g.add(p);return p});
 g.userData={lg,ar,cu:1};return g}
