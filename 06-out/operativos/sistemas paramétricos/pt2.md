
```dataviewjs
(()=> {
  const wrap=dv.el('div','');
  wrap.innerHTML =
    '<style>.ctrl{display:flex;gap:8px;align-items:center;margin:4px 0}label{width:22px}</style>'+
    '<div class="ctrl"><label>A</label><input id="A" type="range" min="0" max="1" step="0.01" value="0.60"><span id="aV">0.60</span></div>'+
    '<div class="ctrl"><label>H</label><input id="H" type="range" min="0" max="1" step="0.01" value="0.30"><span id="hV">0.30</span></div>'+
    '<div class="ctrl"><label>C</label><input id="C" type="range" min="0" max="1" step="0.01" value="0.10"><span id="cV">0.10</span></div>'+
    '<div class="ctrl"><label>D</label><input id="D" type="range" min="0" max="2" step="0.01" value="0.80"><span id="dV">0.80</span></div>'+
    '<div id="bal"></div>';
  const c=dv.el('canvas',''); c.width=380; c.height=150; const g=c.getContext('2d');
  const btn=dv.el('button','Sonificar'); btn.id='play'; wrap.appendChild(btn);
  const $=q=>wrap.querySelector(q);

  let ctx=null, osc=null, gain=null, lastWaveKey='';

  function startAudio(){
    if(ctx) return;
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    osc=ctx.createOscillator(); gain=ctx.createGain();
    gain.gain.value=0.05; osc.connect(gain).connect(ctx.destination); osc.start();
  }
  async function stopAudio(){
    if(ctx){ try{ await ctx.close(); }catch(e){} }
    ctx=null; osc=null; gain=null; lastWaveKey='';
  }

  // convierte el perfil grad[x] en un PeriodicWave mediante DFT
  function setWaveFromShape(shape){
    if(!ctx||!osc) return;
    // resample a potencia de 2 (p.ej. 256)
    const N=256, tmp=new Float32Array(N);
    for(let i=0;i<N;i++){
      const t=i/(N-1); const x=t*(shape.length-1);
      const x0=Math.floor(x), x1=Math.min(shape.length-1,x0+1), a=x-x0;
      tmp[i]=shape[x0]*(1-a)+shape[x1]*a; // lineal
    }
    // normaliza a [-1,1] y quita DC
    let min=1e9,max=-1e9,mean=0;
    for(let i=0;i<N;i++){ const v=tmp[i]; if(v<min)min=v; if(v>max)max=v; mean+=v; }
    mean/=N;
    const amp=Math.max(1e-6, Math.max(max-mean, mean-min));
    for(let i=0;i<N;i++) tmp[i]=(tmp[i]-mean)/amp;

    // DFT a coeficientes cos/sin (a_k, b_k). arrays indexados desde 0 (DC en 0)
    const HARM=64;
    const real=new Float32Array(HARM+1), imag=new Float32Array(HARM+1);
    real[0]=0.0; // sin DC para evitar clics
    for(let k=1;k<=HARM;k++){
      let ak=0,bk=0;
      for(let n=0;n<N;n++){
        const ph=2*Math.PI*k*n/N;
        const v=tmp[n];
        ak+=v*Math.cos(ph);
        bk+=v*Math.sin(ph);
      }
      ak*=2/N; bk*=2/N;
      real[k]=ak; imag[k]=bk;
    }

    const key=real.join(',')+'|'+imag.join(',');
    if(key===lastWaveKey) return; // evita recrear si no cambió
    lastWaveKey=key;

    const pw=ctx.createPeriodicWave(real, imag, {disableNormalization:false});
    try{ osc.setPeriodicWave(pw); }catch(e){}
  }

  function draw(){
    const A=+$('#A').value,H=+$('#H').value,C=+$('#C').value,D=+$('#D').value;
    $('#aV').textContent=A.toFixed(2); $('#hV').textContent=H.toFixed(2);
    $('#cV').textContent=C.toFixed(2); $('#dV').textContent=D.toFixed(2);
    const balance=(A-H-C);
    $('#bal').textContent='Δu/Δt ≈ (A−H−C)·u + D∇²u | balance local='+balance.toFixed(2);

    g.clearRect(0,0,c.width,c.height);
    const shape=new Float32Array(c.width); // guardamos la forma para wavetable
    for(let x=0;x<c.width;x++){
      const s=Math.sin(x*0.06), k=Math.cos(x*0.04);
      const m=A*s - H*k - C;
      const grad=m + D*(s-k)*0.5;
      shape[x]=grad; // señal cruda
      const y=75 + grad*50;
      g.fillStyle='hsl('+(200+grad*80)+',70%,50%)';
      g.fillRect(x,y,2,2);
    }

    // suaviza y normaliza la forma antes de crear wavetable
    // filtro paso-bajo simple (vecinos)
    for(let i=1;i<shape.length-1;i++){
      shape[i]= (shape[i-1]+shape[i]+shape[i+1])/3;
    }

    if(osc){ osc.frequency.value=220+balance*220; setWaveFromShape(shape); }
  }

  ['#A','#H','#C','#D'].forEach(id=>$(id).addEventListener('input',draw));
  btn.addEventListener('click',async ()=>{
    if(!ctx){ startAudio(); draw(); btn.textContent='Stop'; }
    else { await stopAudio(); btn.textContent='Sonificar'; }
  });
  draw();
})();
```

