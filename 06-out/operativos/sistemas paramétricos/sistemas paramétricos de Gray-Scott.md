---
tags: operativos/sistemasparamétricos
person: Robert Munafo
url: https://mrob.com
---


[Los Sistemas Paramétricos de Gray-Scott](https://mrob.com/pub/comp/xmorphia/pearson-classes.html)


```run-python
# Run-Python: Gray–Scott (Turing-like) reaction–diffusion
# - guarda GIF y PNG dentro de tu vault en attachments/
# - muestra el último frame con matplotlib (una sola figura, sin estilos)
# - al final imprime un @html para embeber el GIF en la nota

import os, numpy as np, matplotlib.pyplot as plt
import imageio.v2 as imageio

# 1) Carpeta de salida dentro del vault
out_dir = "/Users/zztt/Library/Mobile Documents/iCloud~md~obsidian/Documents/cym/06-out/operativos/sistemas paramétricos/"
os.makedirs(out_dir, exist_ok=True)
gif_path = os.path.join(out_dir, "turing_gray_scott.gif")
png_path = os.path.join(out_dir, "turing_gray_scott_last.png")

# 2) Parámetros del modelo Gray–Scott
n = 200           # tamaño de grilla
steps = 2000      # iteraciones
Du, Dv = 0.16, 0.08
F, k = 0.060, 0.062
dt = 1.0

def laplacian(X):
    return (
        -1.0 * X
        + 0.2 * (np.roll(X, 1, 0) + np.roll(X, -1, 0) + np.roll(X, 1, 1) + np.roll(X, -1, 1))
        + 0.05 * (
            np.roll(np.roll(X, 1, 0), 1, 1)
            + np.roll(np.roll(X, 1, 0), -1, 1)
            + np.roll(np.roll(X, -1, 0), 1, 1)
            + np.roll(np.roll(X, -1, 0), -1, 1)
        )
    )

# 3) Estados iniciales
U = np.ones((n, n), dtype=np.float32)
V = np.zeros((n, n), dtype=np.float32)

r = 20
U[n//2 - r:n//2 + r, n//2 - r:n//2 + r] = 0.50
V[n//2 - r:n//2 + r, n//2 - r:n//2 + r] = 0.25

rng = np.random.default_rng(1234)
U += 0.02 * (rng.random((n, n), dtype=np.float32) - 0.5)
V += 0.02 * (rng.random((n, n), dtype=np.float32) - 0.5)
U = np.clip(U, 0.0, 1.0)
V = np.clip(V, 0.0, 1.0)

# 4) Simulación y captura espaciada para GIF
frames = []
capture_every = 10
for t in range(steps):
    Lu, Lv = laplacian(U), laplacian(V)
    UVV = U * (V * V)
    U += (Du * Lu - UVV + F * (1.0 - U)) * dt
    V += (Dv * Lv + UVV - (F + k) * V) * dt
    np.clip(U, 0.0, 1.0, out=U)
    np.clip(V, 0.0, 1.0, out=V)

    if t % capture_every == 0:
        frames.append((np.clip(V, 0, 1) * 255).astype(np.uint8))

# 5) Guardar GIF y PNG
imageio.mimsave(gif_path, frames, duration=0.08)
plt.figure(figsize=(6, 6))
plt.imshow(V, interpolation="nearest")
plt.axis("off")
plt.tight_layout()
plt.savefig(png_path, dpi=150, bbox_inches="tight", pad_inches=0)
plt.show()

print(f"GIF guardado en: {gif_path}")
print(f"PNG guardado en: {png_path}")
print('@html(<img src="attachments/turing_gray_scott.gif" style="max-width:100%;height:auto">)')
```








```dataviewjs
// Gray–Scott Class 1 (σ=2; F=0.034, k=0.055) + WebAudio (ruido → bandpass resonante)
// - Play/Stop cierra el AudioContext y desconecta todo (no queda colgado).
// - Canvas transparente; colores adaptados al tema (light/dark) leyendo CSS variables.

const el = this.container;
el.innerHTML = `
  <div id="wrap" style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:600px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <button id="btn"  style="padding:6px 10px;border:1px solid var(--background-modifier-border);border-radius:8px;background:var(--background-secondary);cursor:pointer">Play</button>
      <button id="rst"  style="padding:6px 10px;border:1px solid var(--background-modifier-border);border-radius:8px;background:var(--background-secondary);cursor:pointer">Reset</button>
      <span id="status" style="margin-left:auto;color:var(--text-muted)">Class 1 (F=0.034, k=0.055, σ=2)</span>
    </div>
    <canvas id="cv" width="192" height="192" style="width:100%;image-rendering:pixelated;border:1px solid var(--background-modifier-border);border-radius:8px;background:transparent"></canvas>
    <div style="display:flex;gap:10px;margin-top:8px;color:var(--text-muted);font-variant-numeric:tabular-nums">
      <span id="fps">fps: --</span>
      <span id="mean">mean V: --</span>
      <span id="xy">x,y: --</span>
    </div>
  </div>
`;

const wrap    = el.querySelector("#wrap");
const cv      = el.querySelector("#cv");
const ctx     = cv.getContext("2d", { willReadFrequently:true, alpha:true });
const statusEl= el.querySelector("#status");
const fpsEl   = el.querySelector("#fps");
const meanEl  = el.querySelector("#mean");
const xyEl    = el.querySelector("#xy");

// Colores según tema
function themeColors(){
  const cs = getComputedStyle(wrap);
  const text = cs.getPropertyValue("--text-normal") || cs.color || "#cccccc";
  const border = cs.getPropertyValue("--background-modifier-border") || "#444";
  return { text: text.trim() || "#ccc", border: border.trim() || "#444" };
}
let colors = themeColors();

const W = cv.width, H = cv.height;
// σ = Du/Dv = 2
const Du = 0.20, Dv = 0.10;
let F  = 0.0340, k = 0.0550;
const dt = 1.0;

let U = new Float32Array(W*H), V = new Float32Array(W*H);
let playing = false, rafId = null;

function clamp01(x){ return x<0?0:(x>1?1:x); }
function seed(){
  U.fill(1.0); V.fill(0.0);
  const patches=3, r=12;
  for (let p=0;p<patches;p++){
    const cx=(W*0.3)+p*(W*0.2), cy=(H*0.35)+((p%2)? H*0.15 : 0);
    for (let y=cy-r;y<cy+r;y++){
      for (let x=cx-r;x<cx+r;x++){
        const xi=((x|0)+W)%W, yi=((y|0)+H)%H, i=yi*W+xi;
        U[i]=0.5; V[i]=0.25;
      }
    }
  }
  for (let i=0;i<U.length;i++){
    U[i]=clamp01(U[i]+(Math.random()-0.5)*0.02);
    V[i]=clamp01(V[i]+(Math.random()-0.5)*0.02);
  }
}
seed();

function lap(A,x,y){
  const xm=(x-1+W)%W,xp=(x+1)%W,ym=(y-1+H)%H,yp=(y+1)%H;
  const c=A[y*W+x],n=A[ym*W+x],s=A[yp*W+x],w=A[y*W+xm],e=A[y*W+xp];
  const nw=A[ym*W+xm],ne=A[ym*W+xp],sw=A[yp*W+xm],se=A[yp*W+xp];
  return -1.0*c + 0.2*(n+s+w+e) + 0.05*(nw+ne+sw+se);
}
function step(){
  const U2=new Float32Array(W*H), V2=new Float32Array(W*H);
  for (let y=0;y<H;y++){
    for (let x=0;x<W;x++){
      const i=y*W+x, u=U[i], v=V[i];
      const Lu=lap(U,x,y), Lv=lap(V,x,y), uvv=u*v*v;
      U2[i]=clamp01(u+(Du*Lu-uvv+F*(1.0-u))*dt);
      V2[i]=clamp01(v+(Dv*Lv+uvv-(F+k)*v)*dt);
    }
  }
  U=U2; V=V2;
}

function strokeStyle(){
  // usa color de texto como foreground
  ctx.strokeStyle = colors.text;
  ctx.fillStyle   = colors.text;
}

const img = ctx.createImageData(W,H), pix = img.data;
function draw(){
  // limpiar a transparente
  ctx.clearRect(0,0,W,H);
  // convertir V a monocromo con alpha 1 (sobre fondo transparente)
  for (let i=0;i<V.length;i++){
    const c=(V[i]*255)|0, j=i<<2;
    pix[j]=pix[j+1]=pix[j+2]=c; pix[j+3]=255;
  }
  ctx.putImageData(img,0,0);

  // borde/marco discreto
  strokeStyle();
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5,0.5,W-1,H-1);
}

function patternStats(){
  let sum=0,sum2=0,cx=0,cy=0,nh=0;
  const thr=0.5;
  for (let y=0;y<H;y++){
    for (let x=0;x<W;x++){
      const v=V[y*W+x];
      sum+=v; sum2+=v*v;
      if (v>thr){ cx+=x; cy+=y; nh++; }
    }
  }
  const count=W*H;
  const mean=sum/count, varr=Math.max(0,sum2/count-mean*mean), std=Math.sqrt(varr);
  const px = nh>0? cx/nh : W/2, py = nh>0? cy/nh : H/2;
  return { mean, std, x:px/W, y:py/H };
}

// --------- WebAudio con teardown completo ----------
let actx=null, master=null, bp=null, noiseSrc=null, noiseGain=null;

async function audioStart(){
  if (!actx) actx = new (window.AudioContext||window.webkitAudioContext)();
  if (actx.state==="suspended") await actx.resume();
  if (!master){ master=actx.createGain(); master.gain.value=0.20; master.connect(actx.destination); }
  if (!bp){ bp=actx.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=800; bp.Q.value=4.0; bp.connect(master); }
  if (!noiseSrc){
    const len=actx.sampleRate*2, buf=actx.createBuffer(1,len,actx.sampleRate), ch=buf.getChannelData(0);
    for (let i=0;i<len;i++) ch[i]=Math.random()*2-1;
    noiseSrc=actx.createBufferSource(); noiseSrc.buffer=buf; noiseSrc.loop=true;
    noiseGain=actx.createGain(); noiseGain.gain.value=0.35;
    noiseSrc.connect(noiseGain).connect(bp);
    noiseSrc.start();
  }
}
async function audioStop(){
  try{ if (noiseSrc){ noiseSrc.stop(); noiseSrc.disconnect(); } }catch(e){}
  if (noiseGain){ noiseGain.disconnect(); }
  if (bp){ bp.disconnect(); }
  if (master){ master.disconnect(); }
  noiseSrc=noiseGain=bp=master=null;
  if (actx){
    try{ await actx.close(); }catch(e){}
    actx=null;
  }
}

function sonify(){
  if (!actx||!bp) return;
  const s=patternStats();
  const f=200 + s.x*(4000-200);
  const q=0.5 + s.y*(18-0.5);
  const t=actx.currentTime;
  bp.frequency.setTargetAtTime(f,t,0.05);
  bp.Q.setTargetAtTime(q,t,0.08);
  meanEl.textContent=`mean V: ${s.mean.toFixed(3)}`;
  xyEl.textContent  =`x,y: ${s.x.toFixed(2)}, ${s.y.toFixed(2)} | f≈${Math.round(f)}Hz Q≈${q.toFixed(1)}`;
}

// --------- Loop ----------
let frames=0, fpsTimer=performance.now();
const stepsPerFrame=2;

function loop(){
  if (playing){
    for (let n=0;n<stepsPerFrame;n++) step();
    draw();
    sonify();
  }
  const now=performance.now();
  frames++;
  if (now-fpsTimer>=1000){ fpsEl.textContent=`fps: ${frames}`; frames=0; fpsTimer=now; }
  rafId=requestAnimationFrame(loop);
}

// --------- Controles ----------
async function start(){
  await audioStart();
  if (!rafId) rafId=requestAnimationFrame(loop);
  playing=true;
  statusEl.textContent="running (Class 1 → homogéneo)";
  el.querySelector("#btn").textContent="Stop";
}
async function stop(){
  playing=false;
  statusEl.textContent="paused";
  el.querySelector("#btn").textContent="Play";
  await audioStop(); // mata todo: fuentes, nodos y context
}

el.querySelector("#btn").onclick = async ()=>{ if (!playing) await start(); else await stop(); };
el.querySelector("#rst").onclick = async ()=>{ await stop(); seed(); draw(); };

// actualizar colores si cambia el tema (Obsidian dispara evento)
const mo=new MutationObserver(()=>{ colors=themeColors(); draw(); });
mo.observe(document.documentElement,{attributes:true,attributeFilter:["class","style"]});

// primer frame
draw();
```







