


```dataviewjs
(()=> {
  // UI
  const wrap = dv.el('div','');
  wrap.innerHTML =
    '<style>.ctrl{display:flex;gap:8px;align-items:center;margin:4px 0}.ctrl label{width:26px}.row{display:flex;flex-wrap:wrap;gap:12px}.row .ctrl{min-width:220px}#stats{margin:4px 0 8px 0;font:12px system-ui}</style>' +
    '<div class="row">' +
    '<div class="ctrl"><label>Du</label><input id="Du" type="range" min="0" max="1" step="0.0005" value="0.16"><span id="DuV">0.1600</span></div>' +
    '<div class="ctrl"><label>Dv</label><input id="Dv" type="range" min="0" max="1" step="0.0005" value="0.08"><span id="DvV">0.0800</span></div>' +
    '<div class="ctrl"><label>f</label><input id="f" type="range" min="0.0" max="0.1" step="0.0005" value="0.037"><span id="fV">0.0370</span></div>' +
    '<div class="ctrl"><label>k</label><input id="k" type="range" min="0.0" max="0.1" step="0.0005" value="0.060"><span id="kV">0.0600</span></div>' +
    '<div class="ctrl"><label>dt</label><input id="dt" type="range" min="0.2" max="1.5" step="0.01" value="1.0"><span id="dtV">1.00</span></div>' +
    '<div class="ctrl"><label>it</label><input id="it" type="range" min="1" max="40" step="1" value="10"><span id="itV">10</span></div>' +
    '</div>' +
    '<div id="stats"></div>';
  const scale = 2, W = 192, H = 192;
  const canvas = dv.el('canvas',''); canvas.width = W*scale; canvas.height = H*scale;
  canvas.style.background = 'black';   // ← fondo transparente
  const g = canvas.getContext('2d');
  wrap.appendChild(canvas);
  const btn = dv.el('button','Sonificar'); btn.id = 'play'; wrap.appendChild(btn);

  function $(sel){ return wrap.querySelector(sel); }
  function setVal(id, v){ $(id).textContent = v; }

  // Estado Gray–Scott
  let U = new Float32Array(W*H), V = new Float32Array(W*H);
  let U2 = new Float32Array(W*H), V2 = new Float32Array(W*H);

  function idx(x,y){ return ((y+H)%H)*W + ((x+W)%W); } // bordes periódicos
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
    return -1*c + 0.2*(n+s+e+w) + 0.05*(ne+nw+se+sw);
  }

  // WebAudio
  let ctx = null, osc = null, filt = null, gain = null, playing = false;
  function startAudio(){
    if(playing) return;
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    osc = ctx.createOscillator(); filt = ctx.createBiquadFilter(); gain = ctx.createGain();
    osc.type = 'sawtooth'; filt.type = 'lowpass';
    osc.connect(filt).connect(gain).connect(ctx.destination);
    gain.gain.value = 0.0; // arranca muteado
    osc.start();
    playing = true;
  }
  async function stopAudio(){
    if(!playing) return;
    try{ await ctx.close(); }catch(e){}
    ctx = null; osc = null; filt = null; gain = null; playing = false;
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
      // swap buffers
      const tU = U; U = U2; U2 = tU;
      const tV = V; V = V2; V2 = tV;
    }
  }

  const img = g.createImageData(W*scale,H*scale);
  function render(){
    const pix = img.data;
    for(let y=0;y<H;y++){
      for(let x=0;x<W;x++){
        const i = idx(x,y);
        const v = V[i];
        const gx = V[idx(x+1,y)] - V[idx(x-1,y)];
        const gy = V[idx(x,y+1)] - V[idx(x,y-1)];
        const edge = Math.min(1, Math.sqrt(gx*gx+gy*gy)*6);
        const r = Math.min(255, v*255);
        const b = Math.min(255, (1-v)*255);
        const e = (edge*180)|0;
        for(let dy=0; dy<scale; dy++){
          for(let dx=0; dx<scale; dx++){
            const p = ((y*scale+dy)*W*scale + (x*scale+dx))<<2;
            let R = r + e*0.2; if(R<0) R=0; if(R>255) R=255;
            let G = (r+b)*0.5; if(G<0) G=0; if(G>255) G=255;
            let B = b + e*0.4; if(B<0) B=0; if(B>255) B=255;
            pix[p+0]=R; pix[p+1]=G; pix[p+2]=B; pix[p+3]=255;
          }
        }
      }
    }
    g.putImageData(img,0,0);
  }

  let lastMean = 0;
  function frame(){
    const Du = +$('#Du').value, Dv = +$('#Dv').value, f = +$('#f').value, k = +$('#k').value, dt = +$('#dt').value, it = +$('#it').value;
    setVal('#DuV', Du.toFixed(4)); setVal('#DvV', Dv.toFixed(4));
    setVal('#fV',  f.toFixed(4));  setVal('#kV',  k.toFixed(4));
    setVal('#dtV', dt.toFixed(2)); setVal('#itV', it.toString());

    step(it,Du,Dv,f,k,dt);
    render();

    if(playing && osc && filt && gain && ctx){
      let sum=0, sum2=0;
      for(let i=0;i<V.length;i++){ const vv=V[i]; sum+=vv; sum2+=vv*vv; }
      const mean = sum/V.length;
      const varV = Math.max(0, sum2/V.length - mean*mean);
      const activity = Math.abs(mean - lastMean); lastMean = mean;

      const base = 140;
      const fHz = base + mean*480 + varV*240;
      const q   = 2 + varV*18;
      const amp = Math.min(0.15, 0.02 + activity*1.5);

      osc.frequency.setTargetAtTime(fHz, ctx.currentTime, 0.02);
      filt.frequency.setTargetAtTime(600 + varV*4800, ctx.currentTime, 0.02);
      filt.Q.setTargetAtTime(q, ctx.currentTime, 0.05);
      gain.gain.setTargetAtTime(amp, ctx.currentTime, 0.05);

      $('#stats').textContent = '<V>=' + mean.toFixed(3) + '  var(V)=' + varV.toFixed(3) + '  it/frame=' + it;
    }

    requestAnimationFrame(frame);
  }

  ['#Du','#Dv','#f','#k','#dt','#it'].forEach(function(id){
    $(id).addEventListener('input', function(){});
  });
  btn.addEventListener('click', async function(){
    if(!playing){
      startAudio(); btn.textContent='Stop';
    } else {
      await stopAudio(); btn.textContent='Sonificar'; $('#stats').textContent='';
    }
  });

  frame();
})();
```


Explicación breve:
- Dos morfógenos U (activador) y V (inhibidor) difunden con coeficientes Du y Dv y reaccionan localmente según:
  - du/dt = Du∇²U − U·V² + f·(1−U)
  - dv/dt = Dv∇²V + U·V² − (k+f)·V
- f es el feed que inyecta U desde el entorno; k es el kill que drena V. La relación f/k y el cociente de difusión Du/Dv controlan si emergen manchas, franjas o laberintos.
- Visualización:
  - Se integra varias iteraciones por cuadro para acelerar la emergencia de patrón.
  - El color combina V y un realce de borde con el gradiente local de V para resaltar estructuras.
- Sonificación:
  - Frecuencia del oscilador ≈ media espacial de V (más varianza), que capta el estado global.
  - Brillo del filtro y Q ≈ varianza de V, que sube cuando hay bordes definidos.
  - Amplitud ≈ actividad del sistema (cambio de la media cuadro a cuadro).
- Botón Sonificar:
  - Start crea AudioContext, oscilador, filtro y ganancia.
  - Stop cierra el AudioContext, liberando recursos para que no quede colgado en Obsidian.
- Sugerencias:
  - Para manchas tipo leopardo: Du≈0.16, Dv≈0.08, f≈0.037, k≈0.060.
  - Para franjas: aumentar f y ajustar k levemente; explorar it=20–30 por cuadro y dt≈1.0.




