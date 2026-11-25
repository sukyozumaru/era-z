/* Mamut Rey · audio (V3.2). Se carga DESPUÉS de js/13-mamut-rey.js y js/07-ajustes-audio-controles.js.
   · Todos los efectos del jefe pasan por un bus propio con compresor (limita picos y evita saturación) y de ahí al canal de efectos (SB):
     respetan el volumen de efectos, «Todo el sonido» y «Reducir efectos».
   · Audio procedural original por defecto. INTERFAZ DE SUSTITUCIÓN: rellenar KING_AUDIO.sfx / KING_AUDIO.music con nombres de archivo
     (carpeta assets/audio/mamut/, ver LEEME.md) y el juego usará esos archivos; los que sigan en null siguen siendo procedurales.
   · Sustituye mTick() (copia de 07 con rampa de tempo, subida de tensión, motivo y capas por fase, resolución al morir) y envuelve sched(). */
const KING_AUDIO={base:'assets/audio/mamut/',ext:'.ogg',
 sfx:{roar:null,roarPhase:null,stomp:null,charge:null,sweep:null,step:null,crystal:null,death:null,arrival:null},
 music:{p1:null,p2:null,p3:null,resolve:null},
 buffers:{},loaded:false,
 /* Carga perezosa tras el primer gesto (cuando existe AC). Los archivos que falten se ignoran sin error. */
 async load(){if(this.loaded||!AC)return;this.loaded=true;const jobs=[];
  for(const [grp,map] of [['sfx',this.sfx],['music',this.music]])for(const [k,f] of Object.entries(map)){if(!f)continue;
   jobs.push(fetch(this.base+f+(f.includes('.')?'':this.ext)).then(r=>r.ok?r.arrayBuffer():Promise.reject()).then(b=>AC.decodeAudioData(b)).then(buf=>{this.buffers[(grp==='music'?'m_':'s_')+k]=buf}).catch(()=>{}))}
  await Promise.all(jobs)}};
const KA={seen:false,t0:0,mute:0,wasKing:false,bus:null,stem:null};
function kbus(){if(!AC)return null;if(KA.bus&&KA.bus.ctx===AC)return KA.bus.in;
 const gin=AC.createGain(),comp=AC.createDynamicsCompressor();comp.threshold.value=-20;comp.knee.value=12;comp.ratio.value=6;comp.attack.value=.004;comp.release.value=.22;
 const out=AC.createGain();out.gain.value=.9;gin.connect(comp);comp.connect(out);out.connect(SB());KA.bus={ctx:AC,in:gin};return gin}
const kok=()=>AC&&!M.mute&&AC.state==='running';
const klater=(f,ms)=>setTimeout(()=>{try{f()}catch(e){}},ms);
/* tono: f→slide, vibrato opcional {hz,depth} */
function kbt(f,d,type,v,slide,delay=0,vib){if(!kok())return;const t=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,slide),t+d);
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(kbus());
 if(vib){const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=vib.hz;lg.gain.value=vib.depth;l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(t+d+.02)}o.start(t);o.stop(t+d+.02)}
/* ruido filtrado con barrido de frecuencia */
function kbn(d,v,type,f0,q=1,delay=0,f1){if(!kok())return;const t=AC.currentTime+delay,len=Math.max(1,Math.floor(AC.sampleRate*d)),b=AC.createBuffer(1,len,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<len;i++)a[i]=Math.random()*2-1;
 const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type=type;f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+d);f.Q.value=q;
 const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(g);g.connect(kbus());s.start(t);s.stop(t+d+.02)}
/* reproduce un archivo original si existe; si no, el procedural */
function kplay(name,proc){const buf=KING_AUDIO.buffers['s_'+name];if(buf&&kok()){const s=AC.createBufferSource();s.buffer=buf;s.playbackRate.value=.97+Math.random()*.06;s.connect(kbus());s.start();return}proc()}
/* ---- procedurales ---- */
const P_roar=(k=1)=>{/* sub con vibrato + cuerpo en batido + vocal (formante que barre) + aliento + eco */
 kbt(62,1.6,'sawtooth',.13*k,44,0,{hz:5,depth:4});kbt(92,1.5,'sawtooth',.06*k,70);kbt(95.5,1.5,'sawtooth',.05*k,72);
 kbn(1.5,.15*k,'bandpass',320,4,0,520);kbn(.9,.1*k,'bandpass',520,4,.55,300);kbn(.25,.05*k,'highpass',2000);
 klater(()=>{kbt(58,1.1,'sawtooth',.045*k,42);kbn(1,.05*k,'bandpass',300,3)},360)};
const P_stomp=()=>{kbt(52,.85,'sine',.36,34);kbn(.65,.12,'lowpass',90);kbn(.08,.16,'highpass',3000,1,.05);kbn(.3,.09,'bandpass',900,1,.1)};
const P_charge=()=>{kbt(90,.95,'sawtooth',.07,300);kbn(.95,.13,'bandpass',200,2,0,900);[0,.12,.22,.3].forEach(d=>kbt(44,.12,'sine',.16,34,d))};
const P_sweep=()=>{kbn(.32,.2,'bandpass',600,1.5,0,2600);kbt(300,.28,'sine',.05,700);kbt(1200,.06,'triangle',.06,900,.28)};
const P_step=()=>{kbt(54,.16,'sine',.1,40);kbn(.06,.03,'lowpass',400)};
const P_crystal=()=>{const q=M.set.rf?.5:1;for(let i=0;i<5;i++)kbt(1400+Math.random()*1800,.2,'triangle',.045*q,0,i*.04+Math.random()*.06);kbn(.3,.09*q,'highpass',5200)};
const P_phase=()=>{kbt(44,1.4,'sine',.18,70);kbn(1.2,.1,'bandpass',900,2,0,3200);P_crystal()};
const P_death=()=>{kbt(70,2,'sawtooth',.14,34,0,{hz:4,depth:3});kbt(40,1.5,'sine',.3,28);kbn(1.4,.14,'bandpass',420,3,0,160);P_crystal();kbt(36,.6,'sine',.34,26,1.5)};
const P_arrival=()=>{kbt(40,2.2,'triangle',.11,104);kbt(73,1.4,'sine',.09,44);kbn(2,.1,'lowpass',200,1,0,900);klater(()=>sfx.roar(),900)};
sfx.roar=()=>kplay('roar',()=>P_roar());
sfx.roarPhase=()=>kplay('roarPhase',P_phase);
sfx.stomp=()=>kplay('stomp',P_stomp);
sfx.charge=()=>kplay('charge',P_charge);
sfx.sweep=()=>kplay('sweep',P_sweep);
sfx.step=()=>kplay('step',P_step);
sfx.crystal=()=>kplay('crystal',P_crystal);
sfx.kingDeath=()=>kplay('death',P_death);
sfx.kingArrival=()=>kplay('arrival',P_arrival);
/* ---- música ---- */
const MOTIVO=[0,3,7,10];/* motivo del Rey: tónica, 3.ª menor, 5.ª, 7.ª menor */
const sched0=sched;
sched=function(s,t,md){sched0(s,t,md);if(md!==3)return;const k=E.find(e=>e.king),ph=k?k.ph||1:1,bar=(s>>4)&7,st=s&15,r=ROOT[bar];
 if(st===8)tn(70,t,.2,'sine',.45,45);                                   /* fase 1: tambor de guerra */
 if(ph>=2){if(st%4===0)tn(mf(r-12+MOTIVO[(st>>2)%4]),t,.7,'sawtooth',.075,mf(r-12+MOTIVO[(st>>2)%4])*.985);   /* fase 2: motivo grave (metal) */
  if(st%2===1)nz(t,.03,.09,9000);if(st===6||st===14)tn(150,t,.12,'sine',.5,60)}
 if(ph>=3){if(st%4===0)tn(mf(r+MOTIVO[(st>>2)%4]),t,.45,'sawtooth',.05);                                      /* fase 3: motivo una octava arriba + tritono disonante */
  if(st===0||st===8)tn(mf(r+6),t,.5,'sawtooth',.04);if(st%2===0)nz(t,.03,.1,9500);if(st%4===2)nz(t,.05,.12,3000);if(st===2||st===10)tn(130,t,.1,'sine',.5,50)}};
/* mTick: igual que 07 pero con transición. Si hay archivos de música (KING_AUDIO.music) se usan sus bucles por fase en lugar del sintetizador. */
function stemsOn(){return !!KING_AUDIO.buffers.m_p1}
function stemTo(ph){const want='m_p'+ph;if(!AC)return;if(KA.stem&&KA.stem.key===want)return;
 const buf=KING_AUDIO.buffers[want]||KING_AUDIO.buffers.m_p1,now=AC.currentTime;
 if(KA.stem){KA.stem.g.gain.cancelScheduledValues(now);KA.stem.g.gain.linearRampToValueAtTime(0,now+.9);const old=KA.stem.s;setTimeout(()=>{try{old.stop()}catch(e){}},1000)}
 const s=AC.createBufferSource(),g=AC.createGain();s.buffer=buf;s.loop=true;g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(1,now+.9);s.connect(g);g.connect(MBg());s.start(now);KA.stem={key:want,s,g}}
function stemStop(){if(!KA.stem||!AC)return;const old=KA.stem;KA.stem=null;old.g.gain.cancelScheduledValues(AC.currentTime);old.g.gain.linearRampToValueAtTime(0,AC.currentTime+.6);setTimeout(()=>{try{old.s.stop()}catch(e){}},700)}
mTick=function(){if(!AC||AC.state!=='running'||M.mute||M.set.mv<=0){mi.next=0;stemStop();return}
 if(!KING_AUDIO.loaded&&E.some(e=>e.king))KING_AUDIO.load();
 const king=E.some(e=>e.king),md=(S==='play'||S==='lvl')?(king?3:E.some(e=>e.boss)?2:1):0,now=AC.currentTime;
 if(king&&!KA.seen){KA.seen=true;KA.t0=now;if(!stemsOn()){tn(60,now,2.4,'sawtooth',.07,360);nz(now,2.4,.1,400)}}
 if(!king&&KA.wasKing&&S==='play'){KA.mute=now+1.6;stemStop();const rb=KING_AUDIO.buffers.m_resolve;if(rb){const s=AC.createBufferSource();s.buffer=rb;s.connect(MBg());s.start()}else{tn(mf(45),now,1.6,'sawtooth',.1,mf(33));tn(mf(52),now,1.6,'triangle',.07,mf(40))}}
 if(!king)KA.seen=false;KA.wasKing=king;
 if(now<KA.mute)return;
 if(md===3&&stemsOn()){stemTo(E.find(e=>e.king).ph||1);return}
 stemStop();
 let bpm=[78,112,134,148][md];if(md===3)bpm=134+14*Math.min(1,(now-KA.t0)/4);
 if(!mi.next||mi.next<now-.5)mi.next=now+.05;
 while(mi.next<now+.2){sched(mi.step++,mi.next,md);mi.next+=60/bpm/4}};
