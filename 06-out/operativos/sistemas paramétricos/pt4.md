```dataviewjs
(()=> {
  // -------- UI --------
  const wrap = dv.el('div','');
  wrap.innerHTML =
    '<style>.ctrl{display:flex;gap:8px;align-items:center;margin:4px 0}.ctrl label{width:46px}.row{display:flex;flex-wrap:wrap;gap:12px}.row .ctrl{min-width:220px}#stats{margin:6px 0 8px 0;font:12px system-ui} .btns{display:flex;gap:8px;margin-top:8px}</style>' +
    '<div class="row">' +
    '<div class="ctrl"><label>Du</label><input id="Du" type="range" min="0" max="1" step="0.0005" value="0.16"><span id="DuV">0.1600</span></div>' +
    '<div class="ctrl"><label>Dv</label><input id="Dv" type="range" min="0" max="1" step="0.0005" value="0.08"><span id="DvV">0.0800</span></div>' +
    '<div class="ctrl"><label>f</label><input id="f" type="range" min="0.0" max="0.1" step="0.0005" value="0.037"><span id="fV">0.0370</span></div>' +
    '<div class="ctrl"><label>k</label><input id="k" type="range" min="0.0" max="0.1" step="0.0005" value="0.060"><span id="kV">0.0600</span></div>' +
    '<div class="ctrl"><label>dt</label><input id="dt" type="range" min="0.2" max="1.5" step="0.01" value="1.0"><span id="dtV">1.00</span></div>' +
    '<div class="ctrl"><label>it</label><input id="it" type="range" min="1" max="30" step="1" value="8"><span id="itV">8</span></div>' +
    '<div class="ctrl"><label>voices</label><input id="voices" type="range" min="1" max="48" step="1" value="24"><span id="voicesV">24</span></div>' +
    '<div class="ctrl"><label>step</label><input id="step" type="range" min="1" max="4" step="1" value="2"><span id="stepV">2</span></div>' +
    '</div>' +
    '<div id="stats"></div>';
  const scale = 2, W = 192, H = 192;
  const canvas = dv.el('canvas',''); canvas.width = W*scale; canvas.height = H*scale;
  canvas.style.background = 'transparent';
  const g = canvas.getContext('2d', { alpha:true });
  wrap.appendChild(canvas);
  const btns = dv.el('div',''); btns.className='btns'; wrap.appendChild(btns);
  const btnPlay = dv.el('button','Sonificar'); btns.appendChild(btnPlay);
  const btnReset = dv.el('button','Reset'); btns.appendChild(btnReset);

  function $(sel){ return wrap.querySelector(sel); }
  function setVal(id, v){ $(id).textContent = v; }

  // -------- SIMULACIÓN --------
  let U = new Float32Array(W*H), V = new Float32Array(W*H);
  let U2 = new Float32Array(W*H), V2 = new Float32Array(W*H);
  function idx(x,y){ return ((y+H)%H)*W + ((x+W)%W); }
  function seed(){
    for(let i=0;i<W*H;i++){ U[i]=1; V[i]=0; }
    for(let y=(H*0.45)|0; y<(H*0.55)|0; y++){
      for(let x=(W*0.45)|0; x<(W*0.55)|0; x++){
        const i = idx(x,y); U[i]=0.50; V[i]=0.25;
      }
    }
    for(let i=0;i<W*H;i++){
      U[i]+= (Math.random()-0.5)*0.02;
      V[i]+= (Math.random()-0.5)*0.02;
    }
  }
  seed();
  function lap(A,x,y){
    const c = A[idx(x,y)];
    const n = A[idx(x,y-1)], s = A[idx(x,y+1)], e = A[idx(x+1,y)], w = A[idx(x-1,y)];
    const ne = A[idx(x+1,y-1)], nw = A[idx(x-1,y-1)], se = A[idx(x+1,y+1)], sw = A[idx(x-1,y+1)];
    // kernel sin sqrt en render: acá mantenemos igual
    return -1*c + 0.2*(n+s+e+w) + 0.05*(ne+nw+se+sw);
  }
  function step(iters, Du,Dv,f,k,dt){
    for(let it=0; it<iters; it++){
      for(let y=0;y<H;y++){
        for(let x=0;x<W;x++){
          const i = idx(x,y);
          const u = U[i], v = V[i];
          const uvv = u*v*v;
          const du = Du*lap(U,x,y) - uvv + f*(1-u);
          const dv = Dv*lap(V,x,y) + uvv - (k+f)*v;
          let un = u + du*dt;
          let vn = v + dv*dt;
          if(un<0) un=0; else if(un>1) un=1;
          if(vn<0) vn=0; else if(vn>1) vn=1;
          U2[i]=un; V2[i]=vn;
        }
      }
      const tU = U; U = U2; U2 = tU;
      const tV = V; V = V2; V2 = tV;
    }
  }

  // -------- AUDIO --------
  let ctx = null, playing = false;
  let noiseNode = null;
  const voices = [];
  function makePinkNoise(ctx, seconds){
    const sr = ctx.sampleRate;
    const len = Math.floor(seconds*sr);
    const buf = ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for(let i=0;i<len;i++){
      const white = Math.random()*2-1;
      b0 = 0.99886*b0 + white*0.0555179;
      b1 = 0.99332*b1 + white*0.0750759;
      b2 = 0.96900*b2 + white*0.1538520;
      b3 = 0.86650*b3 + white*0.3104856;
      b4 = 0.55000*b4 + white*0.5329522;
      b5 = -0.7616*b5 - white*0.0168980;
      const pink = b0+b1+b2+b3+b4+b5+b6 + white*0.5362;
      b6 = white*0.115926;
      data[i] = pink*0.11;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    return src;
  }
  function buildAudio(numVoices){
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    noiseNode = makePinkNoise(ctx, 2.0);
    noiseNode.start();
    for(let i=0;i<numVoices;i++){
      const biq = ctx.createBiquadFilter(); biq.type = 'bandpass'; biq.Q.value = 25;
      const pan = (ctx.createStereoPanner? ctx.createStereoPanner() : null);
      const gain = ctx.createGain(); gain.gain.value = 0.0;
      if(pan){ noiseNode.connect(biq).connect(pan).connect(gain).connect(ctx.destination); }
      else { noiseNode.connect(biq).connect(gain).connect(ctx.destination); }
      voices.push({filter:biq, gain:gain, pan:pan});
    }
    playing = true;
  }
  async function stopAudio(){
    if(ctx){
      try{ if(noiseNode) noiseNode.stop(); }catch(e){}
      try{ await ctx.close(); }catch(e){}
    }
    ctx=null; noiseNode=null; playing=false;
    voices.length = 0;
  }

  // -------- RENDER VISUAL --------
  const img = g.createImageData(W*scale,H*scale);
  function render(){
    const pix = img.data;
    for(let y=0;y<H;y++){
      for(let x=0;x<W;x++){
        const i = idx(x,y);
        const v = V[i];
        // borde barato sin sqrt
        const gx = Math.abs(V[idx(x+1,y)] - V[idx(x-1,y)]);
        const gy = Math.abs(V[idx(x,y+1)] - V[idx(x,y-1)]);
        const edge = Math.min(1, (gx+gy)*3.0);
        const r = (v*255);
        const b = ((1-v)*255);
        const e = (edge*180)|0;
        for(let dy=0; dy<scale; dy++){
          for(let dx=0; dx<scale; dx++){
            const p = ((y*scale+dy)*W*scale + (x*scale+dx))<<2;
            let R = r + e*0.2; if(R<0) R=0; if(R>255) R=255;
            let G = (r+b)*0.5; if(G<0) G=0; if(G>255) G=255;
            let B = b + e*0.4; if(B<0) B=0; if(B>255) B=255;
            pix[p+0]=R|0; pix[p+1]=G|0; pix[p+2]=B|0; pix[p+3]=255;
          }
        }
      }
    }
    g.putImageData(img,0,0);
  }

  // -------- VOCES --------
  function driveVoices(maxVoices, stepXY){
    if(!playing || !ctx || voices.length===0) return;

    // Recorte de picks: caminamos con stride y acumulamos hasta 3N, luego ordenamos top N
    const candidates = [];
    const strideY = stepXY, strideX = stepXY; // controlable
    const target = Math.min(maxVoices*3, Math.floor((W/strideX)*(H/strideY)));
    for(let y=0;y<H;y+=strideY){
      for(let x=0;x<W;x+=strideX){
        const v = V[idx(x,y)];
        const gx = Math.abs(V[idx(x+1,y)] - V[idx(x-1,y)]);
        const gy = Math.abs(V[idx(x,y+1)] - V[idx(x,y-1)]);
        const score = v*0.7 + (gx+gy)*0.3;
        if(score>0.02){
          candidates.push({x:x,y:y,score:score});
          if(candidates.length>=target) break;
        }
      }
      if(candidates.length>=target) break;
    }
    candidates.sort((a,b)=>b.score-a.score);
    const N = Math.min(maxVoices, Math.min(candidates.length, voices.length));
    const cx = (W-1)/2;
    for(let i=0;i<N;i++){
      const p = candidates[i];
      const x = p.x+0.5;
      const panVal = Math.max(-1, Math.min(1, (x - cx)/cx)); // -1..+1 por X
      const rX = Math.abs(x - cx)/cx;
      const fMin = 150, fMax = 6500;
      const fHz = fMin * Math.pow(fMax/fMin, rX);
      const amp = Math.min(0.12, 0.02 + p.score*0.25);
      const v = voices[i];
      v.filter.frequency.setTargetAtTime(fHz, ctx.currentTime, 0.01);
      v.filter.Q.setTargetAtTime(25, ctx.currentTime, 0.02);
      if(v.pan){ v.pan.pan.setTargetAtTime(panVal, ctx.currentTime, 0.008); }
      v.gain.gain.setTargetAtTime(amp, ctx.currentTime, 0.01);
    }
    for(let i=N;i<voices.length;i++){
      voices[i].gain.gain.setTargetAtTime(0.0, ctx.currentTime, 0.02);
    }
  }

  // -------- LOOP con FPS limit --------
  const FPS = 30;
  const frameBudget = 1000 / FPS;
  let lastRAF = 0;
  let lastMean=0;
  function frame(now){
    if(now - lastRAF < frameBudget){ requestAnimationFrame(frame); return; }
    lastRAF = now;

    const Du=+$('#Du').value, Dv=+$('#Dv').value, f=+$('#f').value, k=+$('#k').value, dt=+$('#dt').value, it=+$('#it').value, maxVoices=+$('#voices').value, stepXY=+$('#step').value;
    setVal('#DuV',Du.toFixed(4)); setVal('#DvV',Dv.toFixed(4));
    setVal('#fV',f.toFixed(4)); setVal('#kV',k.toFixed(4));
    setVal('#dtV',dt.toFixed(2)); setVal('#itV',it.toString()); setVal('#voicesV',maxVoices.toString()); setVal('#stepV',stepXY.toString());

    step(it,Du,Dv,f,k,dt);
    render();

    let sum=0,sum2=0;
    for(let i=0;i<V.length;i++){ const vv=V[i]; sum+=vv; sum2+=vv*vv; }
    const mean=sum/V.length; const varV=Math.max(0,sum2/V.length-mean*mean);
    $('#stats').textContent='<V>='+mean.toFixed(3)+' var(V)='+varV.toFixed(3)+' it/frame='+it+' FPS~'+FPS;

    if(playing){ driveVoices(maxVoices, stepXY); }

    requestAnimationFrame(frame);
  }

  // -------- EVENTOS --------
  btnPlay.addEventListener('click', async ()=>{
    if(!playing){
      buildAudio(+$('#voices').value);
      btnPlay.textContent='Stop';
    } else {
      await stopAudio();
      btnPlay.textContent='Sonificar';
      $('#stats').textContent='';
    }
  });
  btnReset.addEventListener('click', ()=>{ seed(); $('#stats').textContent='(reset)'; });

  ['#Du','#Dv','#f','#k','#dt','#it','#voices','#step'].forEach(id=>{
    $(id).addEventListener('input', ()=>{ /* valores se toman en frame */ });
  });

  requestAnimationFrame(frame);
})();
```


Explicación
- Campo y semilla: Gray–Scott 192×192 con U≈1, V≈0, semilla central y ruido leve. Borde periódico.
- Coordenadas radiales: para cada celda elegida se calcula r y θ con respecto al centro; r se normaliza 0 centro, 1 borde.
- Selección de partículas: se muestrean celdas en una grilla 2× y se rankean por score=v*0.7+edge*0.3; se toman las top N según el slider voices.
- Sonificación por partículas:
  - Fuente base única de ruido rosa (buffer loop) para evitar cientos de osciladores.
  - Voces: cada partícula controla un filtro bandpass con Q alta sobre el ruido rosa.
  - Frecuencia del filtro fHz sigue el radio r con mapeo exponencial fMin→fMax.
  - Paneo estéreo sigue θ: −1 izquierda, 1 derecha.
  - Ganancia por voz sigue la actividad local (score), con ataque/relajación suave.
- Start/Stop: Start construye el grafo; Stop cierra el AudioContext y apaga todo para no dejar nada colgado en Obsidian.
- Performance: el límite de voces evita sobrecarga. Si necesitás más detalle sonoro, subí voices o cambiá el muestreo a paso 1 en driveVoices.