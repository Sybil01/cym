```dataviewjs
// ---------- UI ----------
const root = dv.el('div', '', {cls: 'ytfx'});
root.innerHTML = `
<div class="ui">
  <div class="row">
    <input id="yturl" type="text" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ o path/local/video.mp4" style="flex:1;">
    <label>Local? <input id="islocal" type="checkbox"></label>
    <label>Three.js? <input id="usethree" type="checkbox" checked></label>
    <button id="load">cargar</button>
    <button id="play">▶︎</button>
    <button id="pause">⏸︎</button>
    <span id="tlabel">0:00</span>
  </div>
  <div class="row sliders">
    <label>hue <input id="hue" type="range" min="0" max="360" value="0"></label>
    <label>contrast <input id="contrast" type="range" min="50" max="200" value="100"></label>
    <label>saturate <input id="saturate" type="range" min="0" max="300" value="100"></label>
    <label>invert <input id="invert" type="range" min="0" max="100" value="0"></label>
    <label>blur <input id="blur" type="range" min="0" max="10" step="0.1" value="0"></label>
    <label>glitch <input id="glitch" type="range" min="0" max="1" step="0.01" value="0"></label>
    <label>rgb split <input id="rgbsplit" type="range" min="0" max="20" value="0"></label>
    <label>blend
      <select id="blend">
        <option value="overlay">overlay</option>
        <option value="screen">screen</option>
        <option value="difference">difference</option>
        <option value="multiply">multiply</option>
        <option value="normal">normal</option>
      </select>
    </label>
  </div>
</div>
<div class="stage">
  <div id="player"></div>
  <canvas id="glitchCanvas"></canvas>
</div>
<style>
.ytfx .ui{display:flex; flex-direction:column; gap:8px; margin-bottom:8px;}
.ytfx .row{display:flex; gap:8px; align-items:center; flex-wrap:wrap;}
.ytfx .sliders label{display:flex; gap:6px; align-items:center; white-space:nowrap;}
.ytfx .stage{position:relative; width:100%; max-width:960px; aspect-ratio:16/9; background:#000;}
.ytfx #player, .ytfx #glitchCanvas{position:absolute; inset:0; width:100%; height:100%;}
.ytfx #glitchCanvas{pointer-events:none;}
.ytfx #player video { width:100%; height:100%; } /* para local */
</style>
`;

// ---------- Helpers ----------
function ytId(u){
  if(!u) return null;
  const m = u.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return m ? m[1] : (u.length===11 ? u : null);
}

function el(id){ return root.querySelector('#'+id); }

const hue = el('hue');
const contrast = el('contrast');
const saturate = el('saturate');
const invert = el('invert');
const blur = el('blur');
const glitch = el('glitch');
const rgbsplit = el('rgbsplit');
const blend = el('blend');
const tlabel = el('tlabel');
const islocal = el('islocal');
const usethree = el('usethree');

const canvas = el('glitchCanvas');
const ctx = canvas.getContext('2d', {alpha:true});
const DPR = Math.max(1, window.devicePixelRatio || 1);

// ---------- Player setup ----------
let player; // YT.Player o HTMLVideoElement
let isYouTube = false;
let iframeEl = null;
let threeScene = null;
let threeCamera = null;
let threeRenderer = null;
let threeMesh = null;
let threeVideoTexture = null;
let threeComposer = null;
let threeGlitchPass = null;

function resize(){
  const r = canvas.getBoundingClientRect();
  canvas.width = Math.round(r.width * DPR / 2); // baja res para perf
  canvas.height = Math.round(r.height * DPR / 2);
  canvas.style.transform = 'scale(2)'; // upscale para full size
  if(threeRenderer) {
    threeRenderer.setSize(canvas.width, canvas.height);
    threeCamera.aspect = canvas.width / canvas.height;
    threeCamera.updateProjectionMatrix();
  }
}
resize();
window.addEventListener('resize', resize);

function loadThreeJS(callback) {
  if(window.THREE) { callback(); return; }
  const s1 = document.createElement('script');
  s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s1.onload = () => {
    const s2 = document.createElement('script');
    s2.src = 'https://threejs.org/examples/js/postprocessing/EffectComposer.js';
    s2.onload = () => {
      const s3 = document.createElement('script');
      s3.src = 'https://threejs.org/examples/js/postprocessing/ShaderPass.js';
      s3.onload = () => {
        const s4 = document.createElement('script');
        s4.src = 'https://threejs.org/examples/js/postprocessing/GlitchPass.js';
        s4.onload = callback;
        document.head.appendChild(s4);
      };
      document.head.appendChild(s3);
    };
    document.head.appendChild(s2);
  };
  document.head.appendChild(s1);
}

function setupThreeJS(video) {
  threeScene = new THREE.Scene();
  threeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  threeRenderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
  threeRenderer.setSize(canvas.width, canvas.height);

  threeVideoTexture = new THREE.VideoTexture(video);
  threeVideoTexture.minFilter = THREE.LinearFilter;
  threeVideoTexture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({map: threeVideoTexture});
  threeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  threeScene.add(threeMesh);

  threeComposer = new THREE.EffectComposer(threeRenderer);
  const renderPass = new THREE.RenderPass(threeScene, threeCamera);
  threeComposer.addPass(renderPass);

  threeGlitchPass = new THREE.GlitchPass();
  threeComposer.addPass(threeGlitchPass);
}

function ensureYTApi(ready){
  if(window.YT && window.YT.Player) { ready(); return; }
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
  window.onYouTubeIframeAPIReady = () => ready();
}

function createOrLoad(input){
  const id = ytId(input);
  isYouTube = !!id;
  usethree.disabled = isYouTube; // disable Three.js para YT
  if(isYouTube) usethree.checked = false;
  const playerDiv = el('player');
  playerDiv.innerHTML = ''; // limpiar

  if(isYouTube){
    ensureYTApi(() => {
      player = new YT.Player('player', {
        videoId: id,
        playerVars: { controls:1, rel:0, modestbranding:1 },
        events: {
          onReady: () => { applyFilters(); startTicker(); hookIframeFilters(); },
          onStateChange: () => {}
        }
      });
    });
  } else {
    player = document.createElement('video');
    player.src = input;
    player.controls = true;
    player.loop = true; // para DJ loop
    player.style.width = '100%';
    player.style.height = '100%';
    playerDiv.appendChild(player);
    applyFilters();
    startTicker();
    if(usethree.checked){
      loadThreeJS(() => {
        setupThreeJS(player);
        player.style.display = 'none'; // hide video, render in Three.js
      });
    } else {
      player.style.display = '';
    }
  }
}

// ---------- Filters on player (CSS) ----------
function hookIframeFilters(){
  if(!isYouTube) return;
  const retryHook = () => {
    iframeEl = root.querySelector('#player iframe');
    if(iframeEl){
      applyFilters();
    } else {
      setTimeout(retryHook, 100);
    }
  };
  retryHook();
}

function filterString(){
  return `hue-rotate(${hue.value}deg) contrast(${contrast.value}%) saturate(${saturate.value}%) invert(${invert.value}%) blur(${blur.value}px)`;
}

function applyFilters(){
  const target = isYouTube ? iframeEl : el('player');
  if(target) target.style.filter = filterString();
}

// ---------- Glitch processing ----------
let rafId = 0;
function drawGlitch(){
  const g = parseFloat(glitch.value);
  const split = parseFloat(rgbsplit.value);
  const mode = blend.value || 'overlay';
  canvas.style.mixBlendMode = mode;
  if(canvas.width===0 || canvas.height===0){ resize(); }

  if(!player) { rafId = requestAnimationFrame(drawGlitch); return; }

  const w = canvas.width, h = canvas.height;
  const time = performance.now() / 1000;

  if(usethree.checked && !isYouTube && threeComposer){
    // Three.js render con glitch shader
    threeGlitchPass.goWild = g > 0.5; // modo intenso
    threeGlitchPass.curF = g * 100; // hack para intensity (ajusta según doc)
    threeVideoTexture.needsUpdate = true;
    threeComposer.render();

    // Aplicar RGB split custom (no en glitch pass, así que shader extra , pero por ahora simula)
    if(split > 0){
      ctx.drawImage(canvas, 0, 0); // draw three output to 2d for extra
      let imgData = ctx.getImageData(0, 0, w, h);
      let pixels = imgData.data;
      const shift = split * (1 + Math.sin(time*3)*0.5);
      for(let y=0; y<h; y++){
        for(let x=0; x<w; x++){
          const i = (y*w + x) * 4;
          const rx = Math.min(w-1, Math.max(0, x + shift));
          const ri = (y*w + rx) * 4;
          pixels[i] = pixels[ri];
          const bx = Math.min(w-1, Math.max(0, x - shift));
          const bi = (y*w + bx) * 4;
          pixels[i+2] = pixels[bi+2];
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
  } else {
    ctx.clearRect(0,0,w,h);
    if(isYouTube){
      // Overlay mejorado para YT
      if(g > 0){
        const density = Math.floor(400 * g);
        ctx.globalAlpha = 0.15 + 0.35 * g;
        for(let i=0;i<density;i++){
          const x = Math.random()*w, y=Math.random()*h;
          const s = 1 + Math.random()*4;
          ctx.fillStyle = `hsl(${Math.random()*360}, 90%, 60%)`;
          ctx.fillRect(x, y, s, s);
        }
        const bands = Math.floor(10*g);
        for(let b=0;b<bands;b++){
          const y0 = Math.random()*h;
          const bh = (6 + Math.random()*18);
          const dx = (Math.random()*60 - 30) * g * Math.sin(time*6);
          ctx.globalAlpha = 0.2 + 0.35*g;
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.fillRect(dx, y0, w, bh);
          // Scanlines dinámicas
          for(let sl=0; sl<5; sl++){
            const sly = (y0 + sl*2 + Math.sin(time*12)*20) % h;
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, sly, w, 1);
          }
        }
      }
      if(split > 0){
        ctx.globalAlpha = 0.25 * (split/20);
        ctx.fillStyle = 'red';
        ctx.fillRect(split, 0, w, h);
        ctx.fillStyle = 'green';
        ctx.fillRect(-split, 0, w, h);
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, split, w, h);
      }
    } else {
      // 2D para local sin Three.js
      player.style.display = (g > 0 || split > 0) ? 'none' : '';
      ctx.drawImage(player, 0, 0, w, h);
      if(g > 0 || split > 0){
        let imgData = ctx.getImageData(0, 0, w, h);
        let pixels = imgData.data;
        if(split > 0){
          const shift = split * (1 + Math.sin(time*3)*0.5);
          for(let y=0; y<h; y++){
            for(let x=0; x<w; x++){
              const i = (y*w + x) * 4;
              const rx = Math.min(w-1, Math.max(0, x + shift));
              const ri = (y*w + rx) * 4;
              pixels[i] = pixels[ri];
              const bx = Math.min(w-1, Math.max(0, x - shift));
              const bi = (y*w + bx) * 4;
              pixels[i+2] = pixels[bi+2];
            }
          }
        }
        if(g > 0){
          const density = Math.floor(150 * g);
          for(let i=0; i<density; i++){
            const x = Math.floor(Math.random()*w);
            const y = Math.floor(Math.random()*h);
            const idx = (y*w + x)*4;
            pixels[idx] += (Math.random()-0.5)*120*g;
            pixels[idx+1] += (Math.random()-0.5)*120*g;
            pixels[idx+2] += (Math.random()-0.5)*120*g;
          }
          const lines = Math.floor(7 * g);
          for(let l=0; l<lines; l++){
            const y0 = Math.floor(Math.random()*h);
            const height = Math.floor(12 + Math.random()*25);
            const dx = Math.floor((Math.random()-0.5)*60*g * Math.sin(time*5));
            for(let ly=y0; ly<y0+height && ly<h; ly++){
              for(let x=0; x<w; x++){
                const srcX = Math.min(w-1, Math.max(0, x - dx));
                const srcI = (ly*w + srcX)*4;
                const destI = (ly*w + x)*4;
                pixels[destI] = pixels[srcI];
                pixels[destI+1] = pixels[srcI+1];
                pixels[destI+2] = pixels[srcI+2];
                pixels[destI+3] = pixels[srcI+3];
              }
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
    }
  }

  rafId = requestAnimationFrame(drawGlitch);
}

// ---------- Time ticker ----------
function fmtTime(s){
  s = Math.max(0, Math.floor(s||0));
  const m = Math.floor(s/60), r = s%60;
  return `${m}:${r.toString().padStart(2,'0')}`;
}
function startTicker(){
  function tick(){
    try{
      const t = isYouTube ? (player && player.getCurrentTime ? player.getCurrentTime() : 0) : (player ? player.currentTime : 0);
      tlabel.textContent = fmtTime(t);
    }catch(e){}
    requestAnimationFrame(tick);
  }
  tick();
}

// ---------- Events ----------
[hue,contrast,saturate,invert,blur].forEach(inp => inp.addEventListener('input', applyFilters));
[glitch,blend,rgbsplit,usethree].forEach(inp => inp.addEventListener('input', () => {
  if(usethree.checked && !isYouTube && player && !threeComposer){
    loadThreeJS(() => setupThreeJS(player));
    player.style.display = 'none';
  } else if(!usethree.checked && !isYouTube){
    player.style.display = '';
  }
}));

el('load').addEventListener('click', ()=>{
  const input = el('yturl').value.trim();
  if(!input){ alert('Ingresa URL o path'); return; }
  if(islocal.checked && !ytId(input)){
    createOrLoad(input);
  } else {
    const id = ytId(input);
    if(!id){ alert('URL o ID de YouTube no válido'); return; }
    createOrLoad(id);
  }
});

el('play').addEventListener('click', ()=> { 
  try{ 
    if(isYouTube) player.playVideo(); 
    else player.play(); 
  }catch(e){} 
});
el('pause').addEventListener('click', ()=> { 
  try{ 
    if(isYouTube) player.pauseVideo(); 
    else player.pause(); 
  }catch(e){} 
});

// arrancar glitch
cancelAnimationFrame(rafId); drawGlitch();
```







