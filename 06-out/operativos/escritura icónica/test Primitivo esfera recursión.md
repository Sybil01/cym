
1.	Descripción axiomática
La esfera primitiva acústico-espacial 1 es un sistema cerrado de vidrio transparente que contiene un micrófono fijo y un parlante móvil, dispuesto en un eje Z interno. El parlante se acerca o aleja del micrófono, generando una variación controlada de la retroalimentación acústica. El interactor regula la posición del parlante, único parámetro del sistema, cuyo mínimo corresponde a la cercanía máxima (distorción y densidad) y cuyo máximo corresponde a la lejanía (estado de reposo). El espacio sellado actúa como resonador absoluto, donde material, objeto y agente se reducen a una topología de propagación interna.

---

2.	Fórmula de escritura icónica

$$
\newcommand{\mat}{\blacksquare}
\newcommand{\obj}{\blacklozenge}
\newcommand{\agn}{\bullet}
\newcommand{\itf}{\leftrightarrow}
\newcommand{\ent}[1]{\boxed{#1}}
\newcommand{\branch}{\twoheadrightarrow}
$$

Fórmula simple:
$$(\mat_p \diamond^{-1} \mat_h) \itf (\obj_i \rightarrow \agn_h)$$

---

Fórmula compleja con mínimos y máximos:
$$
\Big[(\obj_i \subset \ent{f}) \itf (\agn_h \mapsto d_{z,\min})\Big] \cup
\Big[(\obj_i \subset \ent{f}) \itf (\agn_h \mapsto d_{z,\max})\Big]
\rightarrow (\odot \circlearrowleft \Omega)
$$
3.	Desglose de términos

•	$\mat_p$: material físico del vidrio.
•	$\mat_h$: material híbrido de parlante-micrófono.
•	$\obj_i$: objeto instrumental (parlante y micrófono).
•	$\agn_h$: agente humano que controla la distancia.
•	$\ent{f}$: entorno físico sellado de la esfera.
•	$d_{z,\min}$: posición mínima (parlante cerca, máxima distorsión).
•	$d_{z,\max}$: posición máxima (parlante lejos, reposo).
•	$\odot$: mundo resultante de feedback.
•	$\Omega$: límite acústico del espacio sellado.
•	$\diamond^{-1}$: operación de hibridación.
•	$\circlearrowleft$: devenir del feedback.
•	$\itf$: interfaz entre agente y objeto.



4.	Ejemplo en JavaScript (DataviewJS/Obsidian)

```dataviewjs
(() => {
  const KEY="__EAES1";
  if (window[KEY]?.alive) return;
  window[KEY] = { alive:true };

  // ============ Helpers ============
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const lerp=(a,b,t)=>a+(b-a)*t;

  // SAFE default: no postprocessing. Toggle to try loading it.
  let wantPostFX = false;

  const THREV = "0.141.0"; // stable UMD

  const loadScript = (src)=>new Promise((res,rej)=>{
    const s=document.createElement("script");
    s.src=src; s.async=true;
    s.onload=()=>res(src);
    s.onerror=()=>rej(new Error("load fail: "+src));
    document.head.appendChild(s);
  });

  async function loadOneOf(urls){
    let lastErr;
    for(const u of urls){
      try{ await loadScript(u); return u; }catch(e){ lastErr=e; }
    }
    throw lastErr;
  }

  async function ensureThree(){
    if (window.THREE) return;
    await loadOneOf([
      `https://cdn.jsdelivr.net/npm/three@${THREV}/build/three.min.js`,
      `https://unpkg.com/three@${THREV}/build/three.min.js`,
      `https://cdn.jsdelivr.net/gh/mrdoob/three.js@r141/build/three.min.js`
    ]);
  }

  async function ensurePost(){
    if (!wantPostFX) return;
    const base = (p)=>[
      `https://cdn.jsdelivr.net/npm/three@${THREV}/examples/js/${p}`,
      `https://unpkg.com/three@${THREV}/examples/js/${p}`,
      `https://cdn.jsdelivr.net/gh/mrdoob/three.js@r141/examples/js/${p}`
    ];
    // strict load order + guards
    if (!THREE.CopyShader)               await loadOneOf(base("shaders/CopyShader.js"));
    if (!THREE.ShaderPass)               await loadOneOf(base("postprocessing/ShaderPass.js"));
    if (!THREE.RenderPass)               await loadOneOf(base("postprocessing/RenderPass.js"));
    if (!THREE.EffectComposer)           await loadOneOf(base("postprocessing/EffectComposer.js"));
    if (!THREE.LuminosityHighPassShader) await loadOneOf(base("shaders/LuminosityHighPassShader.js"));
    if (!THREE.UnrealBloomPass)          await loadOneOf(base("postprocessing/UnrealBloomPass.js"));
  }

  // ============ UI ============
  const root = this.container;
  root.style.height="700px";
  root.style.display="grid";
  root.style.gridTemplateRows="1fr auto";
  root.style.gap="8px";

  const view=document.createElement("div");
  Object.assign(view.style,{position:"relative",minHeight:"520px",borderRadius:"12px",overflow:"hidden"});
  root.appendChild(view);

  const ui=document.createElement("div");
  Object.assign(ui.style,{
    display:"grid",
    gridTemplateColumns:"minmax(160px,1fr) 140px 160px 160px 160px 160px 120px auto auto auto",
    gap:"10px",
    alignItems:"center"
  });
  root.appendChild(ui);

  const labelWrap=(txt,input,extra=null)=>{
    const w=document.createElement("div");
    Object.assign(w.style,{display:"grid",gridTemplateRows:"auto auto auto",gap:"6px"});
    const lab=document.createElement("span"); lab.textContent=txt; lab.style.fontSize="12px"; lab.style.opacity="0.8";
    w.appendChild(lab); w.appendChild(input); if(extra) w.appendChild(extra); return w;
  };

  // sliders
  const knob=document.createElement("input"); Object.assign(knob,{type:"range",min:"0",max:"1",step:"0.001",value:"0.5"}); knob.style.width="100%"; // distancia
  const oscVol=document.createElement("input"); Object.assign(oscVol,{type:"range",min:"0",max:"1",step:"0.01",value:"0.25"}); oscVol.style.width="100%";
  const micVol=document.createElement("input"); Object.assign(micVol,{type:"range",min:"0",max:"1",step:"0.01",value:"0.10"}); micVol.style.width="100%";
  const micMeter=document.createElement("div"); Object.assign(micMeter.style,{height:"1px",background:"rgba(255,255,255,0.25)",position:"relative",overflow:"hidden"});
  const micBar=document.createElement("div"); Object.assign(micBar.style,{height:"100%",width:"0%",background:"#4caf50"}); micMeter.appendChild(micBar);
  const outVol=document.createElement("input"); Object.assign(outVol,{type:"range",min:"0",max:"1",step:"0.01",value:"0.18"}); outVol.style.width="100%";

  // Z spin speed slider (0 must fully stop rotation)
  const zSpin=document.createElement("input"); Object.assign(zSpin,{type:"range",min:"0",max:"0.05",step:"0.0005",value:"0.002"}); zSpin.style.width="100%";
  const zSpinLbl=document.createElement("span"); zSpinLbl.style.fontSize="11px"; zSpinLbl.style.opacity="0.8"; zSpinLbl.textContent="0.0020 rad/frame";

  // Compressor ratio slider (0..16 UI; internally 1..16 for WebAudio)
  const compRatio=document.createElement("input"); Object.assign(compRatio,{type:"range",min:"0",max:"16",step:"0.1",value:"4"}); compRatio.style.width="100%";
  const compRatioLbl=document.createElement("span"); compRatioLbl.style.fontSize="11px"; compRatioLbl.style.opacity="0.8"; compRatioLbl.textContent="4.0:1";

  // PostFX toggle (safe off)
  const fxToggle=document.createElement("input"); fxToggle.type="checkbox"; fxToggle.checked=false;
  const fxLbl=document.createElement("span"); fxLbl.style.fontSize="11px"; fxLbl.style.opacity="0.8"; fxLbl.textContent="Bloom OFF";

  const startBtn=document.createElement("button"); startBtn.textContent="Start";
  const stopBtn=document.createElement("button"); stopBtn.textContent="Stop";
  const reseedBtn=document.createElement("button"); reseedBtn.textContent="Reseed";

  ui.appendChild(knob);
  ui.appendChild(labelWrap("Osc Vol",oscVol));
  ui.appendChild(labelWrap("Mic In",micVol,micMeter));
  ui.appendChild(labelWrap("Master Out",outVol));
  ui.appendChild(labelWrap("Z spin",zSpin,zSpinLbl));
  ui.appendChild(labelWrap("Comp ratio",compRatio,compRatioLbl));
  ui.appendChild(labelWrap("PostFX",fxToggle,fxLbl));
  ui.appendChild(startBtn); ui.appendChild(stopBtn); ui.appendChild(reseedBtn);

  const status=document.createElement("div");
  status.textContent="loading…";
  Object.assign(status.style,{position:"absolute",right:"8px",top:"8px",padding:"4px 8px",background:"rgba(0,0,0,0.45)",color:"#fff",fontSize:"12px",borderRadius:"8px"});
  view.appendChild(status);

  // ============ Audio ============
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let ctx=null, meterRAF=0, pitchRAF=0;
  let simOsc=null, simNoise=null, simGain=null, noiseGain=null, shaper=null;
  let micSrc=null, micGain=null, hp=null, analyser=null, pitchAnalyser=null;
  let preBus=null, convolver=null, dryGain=null, wetGain=null;
  let panner=null, comp=null, master=null;

  function detectFundamental(buf, sr) {
    const SIZE=buf.length; let mean=0, rms=0;
    for (let i=0;i<SIZE;i++) mean+=buf[i]; mean/=SIZE;
    const x=new Float32Array(SIZE); for(let i=0;i<SIZE;i++){ const v=buf[i]-mean; x[i]=v; rms+=v*v; }
    rms=Math.sqrt(rms/SIZE); if (rms<0.008) return null;
    const MAX=Math.floor(SIZE/2); const c=new Float32Array(MAX);
    let best=-1, bestCorr=0;
    for (let off=8; off<MAX; off++){ let corr=0; for (let i=0;i<MAX;i++) corr+=x[i]*x[i+off]; c[off]=corr; if (corr>bestCorr){ bestCorr=corr; best=off; } }
    if (best<0) return null;
    const shift=(c[best+1]-c[best-1])/(2*(2*c[best]-c[best-1]-c[best+1])||1);
    const period=best+shift; const f=sr/period; return (f<40||f>2000)?null:f;
  }

  const makeImpulse=(secs=1.6,decay=2.7)=>{
    const len=Math.max(1,Math.floor((ctx?.sampleRate||48000)*secs)); const buf=ctx.createBuffer(2,len,ctx.sampleRate);
    for(let ch=0;ch<2;ch++){ const d=buf.getChannelData(ch); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,decay); }
    return buf;
  };

  async function setupAudio(){
    if (ctx) return;
    ctx = new AudioCtx();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
      micSrc = ctx.createMediaStreamSource(stream); status.textContent="mic ok";
    } catch(e){ status.textContent="mic blocked"; console.warn(e); }

    preBus=ctx.createGain(); preBus.gain.value=1.0;
    dryGain=ctx.createGain(); dryGain.gain.value=1.0;
    wetGain=ctx.createGain(); wetGain.gain.value=0.25;
    convolver=ctx.createConvolver(); convolver.buffer=makeImpulse(1.5,2.6);
    panner=ctx.createStereoPanner(); panner.pan.value=0;

    comp=ctx.createDynamicsCompressor();
    comp.threshold.value=-14; comp.knee.value=12; comp.attack.value=0.003; comp.release.value=0.25;
    comp.ratio.value = Math.max(1, parseFloat(compRatio.value));

    master=ctx.createGain(); master.gain.value=parseFloat(outVol.value);

    simGain=ctx.createGain(); simGain.gain.value=parseFloat(oscVol.value)*0.4;
    shaper=ctx.createWaveShaper();
    const mkCurve=(k=0)=>{
      const n=44100, curve=new Float32Array(n), amt=lerp(1,150,k),deg=Math.PI/180;
      for(let i=0;i<n;i++){ let x=(i/(n-1))*2-1; curve[i]=(3+amt)*x*20*deg/(Math.PI+amt*Math.abs(x)); }
      return curve;
    };
    shaper.curve=mkCurve(0);

    simOsc=ctx.createOscillator(); simOsc.type="sawtooth"; simOsc.frequency.value=440;
    simNoise=ctx.createBufferSource(); const nbuf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
    const nd=nbuf.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i]=Math.random()*2-1; simNoise.buffer=nbuf; simNoise.loop=true;
    noiseGain=ctx.createGain(); noiseGain.gain.value=0.0;

    micGain=ctx.createGain(); micGain.gain.value=parseFloat(micVol.value);
    hp=ctx.createBiquadFilter(); hp.type="highpass"; hp.frequency.value=120; hp.Q.value=0.7;
    analyser=ctx.createAnalyser(); analyser.fftSize=1024;
    pitchAnalyser=ctx.createAnalyser(); pitchAnalyser.fftSize=2048;
    const meterData=new Float32Array(analyser.fftSize);
    const pitchData=new Float32Array(pitchAnalyser.fftSize);

    if (micSrc){ micSrc.connect(micGain); micGain.connect(hp); hp.connect(analyser); hp.connect(pitchAnalyser); hp.connect(preBus); }

    simOsc.connect(shaper);
    simNoise.connect(noiseGain); noiseGain.connect(shaper);
    shaper.connect(simGain);
    simGain.connect(preBus);

    preBus.connect(dryGain); preBus.connect(convolver); convolver.connect(wetGain);
    dryGain.connect(panner); wetGain.connect(panner); panner.connect(comp); comp.connect(master); master.connect(ctx.destination);

    simOsc.start(); simNoise.start();

    const updMeter=()=>{ meterRAF=requestAnimationFrame(updMeter); if(!analyser) return;
      analyser.getFloatTimeDomainData(meterData); let sum=0; for(let i=0;i<meterData.length;i++){ const v=meterData[i]; sum+=v*v; }
      const rms=Math.sqrt(sum/meterData.length); micBar.style.width=(clamp(rms*3.2,0,1)*100).toFixed(1)+"%"; }; updMeter();

    const updPitch=()=>{ pitchRAF=requestAnimationFrame(updPitch); if(!pitchAnalyser||!ctx||!simOsc) return;
      pitchAnalyser.getFloatTimeDomainData(pitchData); const f=detectFundamental(pitchData, ctx.sampleRate);
      if (f){ const target=clamp(f,40,2000); const now=ctx.currentTime; simOsc.frequency.cancelScheduledValues(now); simOsc.frequency.linearRampToValueAtTime(target, now+1.0); }
    }; updPitch();
  }

  function teardownAudio(){
    try{ simOsc?.stop(); }catch(_){}
    try{ simNoise?.stop(); }catch(_){}
    [simOsc,simNoise,simGain,noiseGain,shaper,micSrc,micGain,hp,analyser,pitchAnalyser,preBus,convolver,dryGain,wetGain,panner,comp,master]
      .forEach(n=>{ try{ n?.disconnect(); }catch(_){ } });
    simOsc=simNoise=simGain=noiseGain=shaper=micSrc=micGain=hp=analyser=pitchAnalyser=preBus=convolver=dryGain=wetGain=panner=comp=master=null;
    if (meterRAF) cancelAnimationFrame(meterRAF), meterRAF=0;
    if (pitchRAF) cancelAnimationFrame(pitchRAF), pitchRAF=0;
  }

  // ============ Three ============
  let renderer=null, scene=null, camera=null, raf=0, ro=null;
  let composer=null, renderPass=null, bloomPass=null;

  // RIG: todo el conjunto que rota unido
  let rig=null, hull=null, shell=null, micCube=null, speakerCone=null, line=null, targetVec=null;

  // base Z del parlante para vibración
  let speakerBaseZ = 0.15 + 0.5*1.55;

  // z spin speed state
  let zSpinSpeed = parseFloat(zSpin.value);
  let zAngle = 0; // acumulador de rotación

  const disposeThree=()=>{ if(raf) cancelAnimationFrame(raf), raf=0; if(ro){ try{ro.disconnect();}catch(_){ } ro=null; }
    if (renderer){ try{renderer.domElement?.parentNode?.removeChild(renderer.domElement);}catch(_){}
      try{renderer.dispose(); renderer.forceContextLoss?.();}catch(_){ } }
    renderer=scene=camera=composer=renderPass=bloomPass=rig=hull=shell=micCube=speakerCone=line=targetVec=null;
  };

  const sizeRendererToView=()=>{ if(!renderer||!camera) return; const w=Math.max(1,view.clientWidth), h=Math.max(1,view.clientHeight);
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); if (composer) composer.setSize(w,h); };

  const orbit={radius:4.5,theta:0.3,phi:0.6,minRadius:2.2,maxRadius:12.0,vtheta:0,vphi:0,rotateSpeed:0.008,damping:0.9,panX:0,panY:0,panSpeed:0.005};
  const applyOrbit=()=>{ if(!camera||!targetVec) return; const p=clamp(orbit.phi,0.01,Math.PI-0.01);
    const x=orbit.panX+orbit.radius*Math.sin(p)*Math.sin(orbit.theta);
    const y=orbit.panY+orbit.radius*Math.cos(p);
    const z=orbit.radius*Math.sin(p)*Math.cos(orbit.theta);
    camera.position.set(x,y,z); camera.lookAt(targetVec); };

  const enableOrbitControls=(canvas)=>{ let dragging=false,lastX=0,lastY=0;
    const end=(e)=>{ dragging=false; try{canvas.releasePointerCapture(e.pointerId);}catch(_){ } };
    canvas.addEventListener("pointerdown",(e)=>{ dragging=true; lastX=e.clientX; lastY=e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener("pointerup",end); canvas.addEventListener("pointerleave",end);
    canvas.addEventListener("pointermove",(e)=>{ if(!dragging) return; const dx=e.clientX-lastX, dy=e.clientY-lastY; lastX=e.clientX; lastY=e.clientY;
      if (e.shiftKey){ orbit.panX -= dx*orbit.panSpeed*(orbit.radius*0.1); orbit.panY += dy*orbit.panSpeed*(orbit.radius*0.1); }
      else { orbit.vtheta += dx*orbit.rotateSpeed; orbit.vphi += dy*orbit.rotateSpeed; }});
    canvas.addEventListener("wheel",(e)=>{ e.preventDefault(); const s=Math.exp(-e.deltaY*0.001);
      orbit.radius=clamp(orbit.radius*s,orbit.minRadius,orbit.maxRadius); }, {passive:false});
  };

  async function setupThree(){
    await ensureThree();
    // Try to load postFX only if requested; fall back silently to no-composer
    composer = renderPass = bloomPass = null;
    if (wantPostFX) {
      try { await ensurePost(); } catch(e){ console.warn("PostFX load failed, continuing without", e); wantPostFX=false; fxToggle.checked=false; fxLbl.textContent="Bloom OFF"; }
    }
    if (renderer) return;

    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    Object.assign(renderer.domElement.style,{width:"100%",height:"100%"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    view.appendChild(renderer.domElement);

    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(45,1,0.1,1000);
    targetVec=new THREE.Vector3(0,0,0);

    // RIG agrupador
    rig=new THREE.Group();
    scene.add(rig);

    // Esfera (wireframe + shell) dentro del rig
    const hullGeo=new THREE.SphereGeometry(1.5, 48, 48);
    const hullMat=new THREE.MeshBasicMaterial({color:0x88aaff, wireframe:true, transparent:true, opacity:0.15});
    hull=new THREE.Mesh(hullGeo,hullMat); hull.name="wire"; rig.add(hull);

    const shellGeo=new THREE.SphereGeometry(1.48, 48, 48);
    const shellMat=new THREE.MeshStandardMaterial({color:0x99bbff, roughness:0.35, metalness:0.25, transparent:true, opacity:0.28});
    shell=new THREE.Mesh(shellGeo,shellMat); shell.receiveShadow=true; rig.add(shell);

    // Mic (cubo) en el centro del rig
    const micGeo=new THREE.BoxGeometry(0.12,0.12,0.12);
    const micStd=new THREE.MeshStandardMaterial({color:0xff5555, roughness:0.6, metalness:0.2});
    micCube=new THREE.Mesh(micGeo,micStd); micCube.castShadow=true; micCube.receiveShadow=true; micCube.position.set(0,0,0);
    rig.add(micCube);

    // Speaker (cono) base mirando al mic (tip opuesto al mic)
    const spkGeo=new THREE.ConeGeometry(0.16,0.28,48);
    const spkStd=new THREE.MeshStandardMaterial({color:0x55ffaa, roughness:0.4, metalness:0.35});
    speakerCone=new THREE.Mesh(spkGeo,spkStd);
    speakerCone.castShadow=true; speakerCone.receiveShadow=true;
    speakerCone.position.set(0,0,speakerBaseZ);
    rig.add(speakerCone);

    // Línea interfaz (fuera del rig)
    const lineMat=new THREE.LineBasicMaterial({color:0xffffff, transparent:true, opacity:0.85});
    const lineGeo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    line=new THREE.Line(lineGeo,lineMat); scene.add(line);

    // Luces
    const hemi=new THREE.HemisphereLight(0x7aa7ff, 0x101018, 0.55); scene.add(hemi);
    const key=new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(2.5,3.5,4.0); key.castShadow=true;
    key.shadow.mapSize.set(1024,1024); key.shadow.camera.near=0.5; key.shadow.camera.far=20;
    scene.add(key);
    const fill=new THREE.PointLight(0x88aaff, 0.3); fill.position.set(-2.2,-1.5,2.8); scene.add(fill);

    // PostFX if available
    if (wantPostFX && THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass) {
      composer=new THREE.EffectComposer(renderer);
      renderPass=new THREE.RenderPass(scene, camera); composer.addPass(renderPass);
      bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(view.clientWidth||1, view.clientHeight||1), 0.8, 0.6, 0.85);
      composer.addPass(bloomPass);
      fxLbl.textContent="Bloom ON";
    } else {
      composer=null; fxLbl.textContent="Bloom OFF";
    }

    const trySize=()=>{ sizeRendererToView(); if((view.clientWidth|0)===0||(view.clientHeight|0)===0) requestAnimationFrame(trySize); }; trySize();
    ro=new ResizeObserver(sizeRendererToView); ro.observe(view);

    enableOrbitControls(renderer.domElement); applyOrbit();

    // Animación
    const tmpA=new THREE.Vector3(), tmpB=new THREE.Vector3();
    const loop=()=>{ raf=requestAnimationFrame(loop); if(!renderer||!scene||!camera||!rig) return;

      // Cámara
      orbit.theta+=orbit.vtheta; orbit.vtheta*=orbit.damping;
      orbit.phi  +=orbit.vphi;   orbit.vphi  *=orbit.damping;
      orbit.phi=clamp(orbit.phi,0.001,Math.PI-0.001);
      applyOrbit();

      // Rotación del RIG por zSpinSpeed; si z=0, no hay rotación
      if (zSpinSpeed>0){
        zAngle += zSpinSpeed;
        rig.rotation.set(0,0,zAngle);
      } else {
        rig.rotation.set(0,0,0);
      }

      // Paneo L/R mapeado a rotación Y de la esfera (usamos zAngle para variación sutil)
      if (panner) panner.pan.value = Math.sin(zAngle);

      // Orienta el cono: BASE mirando al mic (tip en sentido opuesto)
      speakerCone.updateMatrixWorld(true);
      micCube.updateMatrixWorld(true);
      const spkWorld = speakerCone.getWorldPosition(tmpA);
      const micWorld = micCube.getWorldPosition(tmpB);
      const toMic = micWorld.clone().sub(spkWorld).normalize();
      const tipDir = toMic.clone().multiplyScalar(-1);
      const qWorld = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), tipDir);
      speakerCone.quaternion.copy(qWorld); // dentro del rig, coincide

      // Vibración del cono hacia el mic
      const t = (window.__audioTimeHook?.() ?? 0);
      const f = (simOsc?.frequency?.value)||440;
      const distNorm = clamp((speakerBaseZ-0.15)/1.55, 0, 1);
      const energy = 1 - distNorm;
      const amp = 0.008 + 0.022*energy;
      const vib = Math.sin(2*Math.PI*f*t) * amp;
      const offset = toMic.clone().multiplyScalar(vib);
      const basePos = new THREE.Vector3(0,0,speakerBaseZ);
      const worldBase = rig.localToWorld(basePos.clone()).add(offset);
      const newLocal = rig.worldToLocal(worldBase.clone());
      speakerCone.position.copy(newLocal);

      // Línea mic↔speaker
      const p0 = micCube.getWorldPosition(new THREE.Vector3());
      const p1 = speakerCone.getWorldPosition(new THREE.Vector3());
      line.geometry.setFromPoints([p0, p1]);
      line.material.opacity = lerp(0.35, 1.0, energy);

      if (composer) composer.render(); else renderer.render(scene,camera);
    };
    loop();

    status.textContent="ready";
  }

  // ============ Interaction mapping ============
  function applyDistance(dist){
    speakerBaseZ = 0.15 + dist * 1.55;

    const energy = clamp(1 - dist, 0, 1);
    if (ctx && simGain && noiseGain && dryGain && wetGain && convolver && simOsc && shaper){
      const base = 0.06 + energy * 0.44;   // densidad/vol
      const n    = 0.01 + energy * 0.35;   // ruido
      const wet  = 0.18 + (1-energy) * 0.35;
      const dry  = 1.0 - wet * 0.6;

      const user = parseFloat(oscVol.value);
      simGain.gain.value = user * base;
      noiseGain.gain.value = n;
      wetGain.gain.value = wet; dryGain.gain.value = dry;

      const drive = energy;
      const npts=44100, curve=new Float32Array(npts), amt=lerp(1,150,drive),deg=Math.PI/180;
      for(let i=0;i<npts;i++){ let x=(i/(npts-1))*2-1; curve[i]=(3+amt)*x*20*deg/(Math.PI+amt*Math.abs(x)); }
      shaper.curve = curve;

      status.textContent = `energy=${energy.toFixed(2)} osc=${simGain.gain.value.toFixed(2)} n=${n.toFixed(2)} wet=${wet.toFixed(2)}`;
    } else {
      status.textContent = `energy=${energy.toFixed(2)} (audio off)`;
    }
  }

  // ============ Sliders / Toggles ============
  oscVol.addEventListener("input", ()=> applyDistance(parseFloat(knob.value)));
  micVol.addEventListener("input", (e)=>{ if(micGain) micGain.gain.value=parseFloat(e.target.value); });
  outVol.addEventListener("input", (e)=>{ if(master) master.gain.value=parseFloat(e.target.value); });
  knob.addEventListener("input", (e)=> applyDistance(parseFloat(e.target.value)));

  zSpin.addEventListener("input", (e)=>{
    zSpinSpeed = parseFloat(e.target.value)||0;
    if (zSpinSpeed===0){ zAngle=0; } // detener y resetear
    zSpinLbl.textContent = `${zSpinSpeed.toFixed(4)} rad/frame`;
  });

  compRatio.addEventListener("input", (e)=>{
    const v = parseFloat(e.target.value)||0;
    compRatioLbl.textContent = `${v.toFixed(1)}:1`;
    if (comp) comp.ratio.value = Math.max(1, v);
  });

  fxToggle.addEventListener("change", async (e)=>{
    wantPostFX = !!e.target.checked;
    fxLbl.textContent = wantPostFX ? "Bloom ON?" : "Bloom OFF";
    // hot-recreate 3D to apply change safely
    disposeThree();
    await setupThree();
  });

  // ============ Wire-up ============
  let seeded=false;
  const start=async()=>{
    await setupThree();
    await setupAudio();
    if (ctx?.state==="suspended"){ try{ await ctx.resume(); }catch(_){ } }
    window.__audioTimeHook = ()=> ctx?.currentTime ?? performance.now()/1000;
    if(!seeded){ knob.value="0.5"; seeded=true; }
    zSpin.dispatchEvent(new Event("input"));
    compRatio.dispatchEvent(new Event("input"));
    applyDistance(parseFloat(knob.value));
    status.textContent="running";
  };
  const stop=()=>{ teardownAudio(); disposeThree(); status.textContent="stopped"; };
  const reseed=()=>{ knob.value=(Math.random()).toFixed(3); applyDistance(parseFloat(knob.value)); status.textContent="reseed"; };

  startBtn.addEventListener("click", start);
  stopBtn .addEventListener("click", stop);
  reseedBtn.addEventListener("click", reseed);

  (async()=>{ await setupThree(); applyDistance(parseFloat(knob.value)); })();

  // Si Obsidian cambia de panel y el nodo se desmonta, limpiamos
  const obs=new MutationObserver(()=>{ if(!document.body.contains(view)){ stop(); obs.disconnect(); window[KEY].alive=false; } });
  obs.observe(document.body,{childList:true,subtree:true});
})();
```





---

Paso 1. El vacío y el material físico

$$
\ent{f}
$$
- $\ent{f}$, `\ent{f}`, representa el entorno físico inicial, vacío, aún sin transductores.
Matemáticamente: se parte de un medio continuo, el aire como soporte de ondas.

---

Paso 2. El objeto transductor de entrada

$$
\ent{f} \rightarrow \obj_i
$$
- $\ent{f}$, entorno físico.
- $\obj_i$, `\obj_i`, objeto instrumental (micrófono).
- $\rightarrow$, `$\rightarrow$` causalidad.
La causa es que el entorno físico incide en el micrófono. El micrófono se define por recibir vibraciones.

---

Paso 3. El objeto transductor de salida

$$
\obj_i \rightarrow \obj_s
$$
- $\obj_i$, `$\obj_i$` transductor de entrada: micrófono.
- $\obj_s$, \obj_s, transductor de salida: speaker.
- $\rightarrow$, causalidad.
Se establece la cadena micrófono → parlante. El objeto de entrada se proyecta en el objeto de salida.

---

Paso 3b. Realimentación a través del medio

$$
\obj_s \rightarrow \ent{f} \rightarrow \obj_i
$$
- $\obj_s$, `$\obj_s$` transductor de salida: parlante.
- $\ent{f}$, `\ent{f}`, entorno físico: aire como medio de propagación.
- $\obj_i$, `$\obj_i$` transductor de entrada: micrófono.
- $\rightarrow$, causalidad.
El parlante emite sonido en el entorno físico, que vuelve al micrófono: se establece la realimentación acústica.

---

Paso 4. Inclusión del agente humano

$$
\agn_h \leftrightarrow \obj_i
$$
- $\agn_h$, \agn_h, agente humano.
- $\leftrightarrow$, interfaz, punto vincular.
- $\obj_i$, micrófono.
Aquí aparece la voz: el humano se acopla al micrófono. El sistema se vuelve interactivo.

---

Paso 5. Mediación por distancia$z$

$$
(\obj_i \rightarrow \obj_s) \diamond \ent{f}
$$
- $\obj_i \rightarrow \obj_s$, cadena de transducción.
- $\diamond$, modalización.
- $\ent{f}$, entorno físico.
Se introduce la variable espacial$z$: la señal se propaga en el medio, modulada por la distancia.

---

Paso 6. Realimentación entrada-salida

$$
(\obj_s \rightarrow \ent{f}) \cap (\ent{f} \rightarrow \obj_i)
$$
- $\obj_s \rightarrow \ent{f}$, emisión del parlante.
- $\ent{f} \rightarrow \obj_i$, reentrada al micrófono.
- $\cap$, intersección.
Aquí aparece la recursión acústica: la salida vuelve a ser entrada, formando un lazo.

---

Paso 7. Compresor dinámico

$$
(\obj_s \cap \obj_i) \circlearrowleft \obj_h
$$
- $\obj_s \cap \obj_i$, superposición de parlante y micrófono.
- $\circlearrowleft$, devenir/transformación.
- $\obj_h$, \obj_h, hiperobjeto (compresor como proceso dinámico).
El compresor no es un objeto aislado sino una dinámica que regula todo el lazo.

---

Paso 8. Oscilador acoplado a la entrada

$$
\obj_i \oplus \obj_s \mapsto \obj_s
$$
- $\oplus$, suma/disyunción.
- $\mapsto$, transformación dirigida.
El sistema genera un oscilador interno (sawtooth en el código) que refuerza al parlante, creando vibración autoinducida.

---

Paso 9. El sistema total recursivo

$$
\odot = \bigcup(\agn_h,\obj_i,\obj_s,\ent{f})
$$
- $\odot$, mundo/sistema total.
- $\bigcup$, unión.
El sistema se cierra: humano + micrófono + parlante + entorno constituyen un mundo autónomo de recursión acústica.

---

Paso 10. Extensión especulativa

$$
(\odot \circlearrowright) \diamond^{-1} \ent{d}
$$
- $\odot \circlearrowright$, recursión del mundo total.
- $\diamond^{-1}$, virtualización.
- $\ent{d}$, entorno digital.
Se abre la posibilidad de extender el lazo físico a un entorno digital expandido, hibridando acústica y simulación. Esto anticipa la posibilidad de un instrumento hiperreal.

---

Observaciones
- La progresión va de un solo entorno físico ($\ent{f}$) a un sistema total auto-recursivo ($\odot$).
- En cada paso se agrega una entidad o un operador.
- La explicación de símbolos muestra cómo se componen matemáticamente: causalidad ($\rightarrow$), interfaz ($\leftrightarrow$), intersección ($\cap$), devenir ($\circlearrowleft$), recursión ($\circlearrowright$).
- Los últimos pasos (9–10) cruzan hacia lo especulativo, siguiendo la tradición de Varela en la auto-referencia ￼ ￼y Spencer-Brown en la recursión de distinciones ￼.

---



5.	Preguntas conjeturales
6.	¿Puede una esfera sellada ser entendida como un modelo de universo autosuficiente donde la agencia humana solo modifica un parámetro orbital?
7.	¿Hasta qué punto el feedback en un espacio cerrado es análogo a un proceso lógico de auto-referencia?
8.	¿No es acaso este instrumento una trampa donde el intérprete se engaña creyendo controlar algo que en realidad lo absorbe?
9.	Bibliografía



```bibtex

@book{SpencerBrown1969,
  title={Laws of Form},
  author={George Spencer-Brown},
  year={1969},
  publisher={Allen and Unwin}
}

@incollection{Kauffman2000,
  title={Laws of Form and the Logic of Non-Duality},
  author={Louis H. Kauffman},
  booktitle={Cybernetics and Human Knowing},
  year={2000},
  publisher={UIC}
}

@inproceedings{Giardino2022,
  title={Diagrammatic Representation and Inference: Proceedings of Diagrams 2022},
  editor={Valeria Giardino and Sven Linker and Richard Burns},
  year={2022},
  publisher={Springer},
  series={Lecture Notes in Artificial Intelligence}
}
```
