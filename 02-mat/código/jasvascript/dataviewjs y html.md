
# que es dataviewjs

En Obsidian, un bloque dataviewjs permite ejecutar código JavaScript directamente dentro de una nota. A diferencia de un archivo HTML normal, el bloque no crea una página nueva sino que se inyecta dentro del [[DOM]] de la nota en curso. Eso explica la diferencia clave: no tenés document.body como raíz propia, sino un this.container donde se montan tus elementos.


```js
```dataviewjs
const root = this.container;
const p = document.createElement("pre");
p.textContent = "DataviewJS OK";
root.appendChild(p);
"```

```


```dataviewjs
const root = this.container;
const p = document.createElement("pre");
p.textContent = "DataviewJS OK";
root.appendChild(p);
```


##  ejemplo línea por línea:

`const root = this.container;`

	•	this.container es el nodo raíz que DataviewJS asigna al bloque actual dentro de la nota. En vez de escribir en toda la página, solo tenés permiso para modificar este “contenedor local”.
	•	Guardamos esa referencia en la constante root para usarla luego.

const p = document.createElement("pre");

	•	Creamos un elemento HTML <pre> (texto preformateado).
	•	En un archivo HTML usarías igual document.createElement, pero ahí se referiría al documento completo. Acá sigue siendo el mismo API DOM, solo que lo vamos a insertar dentro del container.

p.textContent = "DataviewJS OK";

	•	Asignamos el texto que mostrará el elemento <pre>.
	•	textContent asegura que se muestre como texto plano (no interpreta HTML).

root.appendChild(p);

	•	Finalmente, insertamos el <pre> dentro del contenedor del bloque dataviewjs.
	•	En HTML común, lo harías con document.body.appendChild(p) o el contenedor que quieras. En DataviewJS siempre conviene usar this.container para no contaminar otras partes de la nota.



## Diferencia con HTML

```html
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Mini ejemplo</title></head>
<body>
  <div id="app"></div>
  <script>
    // 1) raíz (antes: this.container)
    const root = document.getElementById("app"); // o document.body

    // 2) crear elemento
    const p = document.createElement("pre");

    // 3) contenido de texto
    p.textContent = "DataviewJS OK";

    // 4) montar en el DOM
    root.appendChild(p);
  </script>
</body>
</html>
```


	•	En HTML 1-page: todo el documento es tuyo; podés usar <html>, <head>, <body>, y manipular document.body.
	•	En DataviewJS: no definís <html> ni <body>. El plugin ya te da un entorno y un container aislado. Solo podés renderizar dentro de ese bloque.
	•	El código JS es casi el mismo, pero el “scope visual” cambia: en la web manejás toda la ventana; en DataviewJS, solo la cajita del bloque donde pegaste tu script.






## hola mundo en dataviewjs

```dataviewjs
try {
  // =========================
  // Raíz y estilos
  // =========================
  const rootId = "cym-hello-web-root";
  let root = this.container.querySelector("#" + rootId);
  if (root) root.remove();
  root = this.container.createEl("div", {attr:{id:rootId}, cls:"cym-root"});
  const style = document.createElement("style");
  style.textContent = `
    .cym-root{position:relative;border:1px solid #ccc;padding:12px;border-radius:8px}
    .cym-ui{display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:12px;align-items:center;margin-bottom:12px}
    .cym-ui>div{display:flex;gap:8px;align-items:center}
    .cym-canvas-wrap{position:relative;width:100%;height:420px;background:transparent}
    .cym-hud{position:absolute;left:8px;top:8px;padding:8px 10px;background:rgba(0,0,0,.35);color:#fff;font:12px/1.2 system-ui,sans-serif;border-radius:6px;pointer-events:none;white-space:pre;min-width:220px}
    .cym-btn{padding:6px 10px;border:1px solid #aaa;border-radius:6px;background:#eee;cursor:pointer}
    .cym-btn:active{transform:translateY(1px)}
    .cym-number{width:110px}.cym-input{width:160px}
    canvas{outline:none}
  `;
  root.appendChild(style);

  // =========================
  // Carga Three.js (r149 no-module)
  // =========================
  function loadScriptOnce(src){return new Promise((res,rej)=>{if([...document.scripts].some(s=>s.src.includes(src)))return res();const s=document.createElement("script");s.src=src;s.onload=()=>res();s.onerror=e=>rej(e);document.head.appendChild(s);});}
  async function ensureThree(){
    if(!window.THREE){await loadScriptOnce("https://unpkg.com/three@0.149.0/build/three.min.js");}
  }

  // =========================
  // UI
  // =========================
  const ui = document.createElement("div"); ui.className="cym-ui"; root.appendChild(ui);
  const make = (html)=>{const d=document.createElement("div");d.innerHTML=html.trim();return d.firstElementChild;}

  const sliderWrap = document.createElement("div");
  const sliderLbl = make("<label>Velocidad</label>");
  const slider = make('<input type="range" min="0.1" max="5" step="0.1" value="1.2">');
  sliderWrap.append(sliderLbl, slider); ui.appendChild(sliderWrap);

  const clickWrap = document.createElement("div");
  const clickBtn = make('<button class="cym-btn">Botón</button>');
  clickWrap.append(document.createTextNode("Acción"), clickBtn); ui.appendChild(clickWrap);
  const clickState = {count:0}; clickBtn.addEventListener("click", ()=>{clickState.count++; updateHUD();});

  const textWrap = document.createElement("div");
  const textLbl = make("<label>Texto</label>");
  const textInput = make('<input class="cym-input" type="text" placeholder="Escribe...">');
  textInput.value = "Ciencia y Música";
  textInput.addEventListener("input", updateHUD);
  textWrap.append(textLbl, textInput); ui.appendChild(textWrap);

  const numWrap = document.createElement("div");
  const numLbl = make("<label>Número</label>");
  const numInput = make('<input class="cym-number" type="number" step="1" value="3">');
  numInput.addEventListener("input", updateHUD);
  numWrap.append(numLbl, numInput); ui.appendChild(numWrap);

  const audioWrap = document.createElement("div");
  const audioBtn = make('<button class="cym-btn">Play Sine</button>');
  audioWrap.append(document.createTextNode("Audio"), audioBtn); ui.appendChild(audioWrap);

  const canvasWrap = document.createElement("div"); canvasWrap.className="cym-canvas-wrap"; root.appendChild(canvasWrap);
  const hud = document.createElement("div"); hud.className="cym-hud"; hud.textContent="HUD"; canvasWrap.appendChild(hud);

  // =========================
  // WebAudio
  // =========================
  let audioCtx=null, osc=null, gain=null, isPlaying=false;
  function startTone(){
    if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    osc = audioCtx.createOscillator(); gain = audioCtx.createGain();
    const baseHz = 110 * Math.max(1, Number(numInput.value||1));
    osc.frequency.value = baseHz; gain.gain.value = 0.15;
    osc.connect(gain).connect(audioCtx.destination); osc.start();
    isPlaying=true; audioBtn.textContent="Stop Sine";
  }
  function stopTone(){
    try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
    try{if(gain){gain.disconnect();}}catch(e){}
    osc=null; gain=null; isPlaying=false; audioBtn.textContent="Play Sine";
  }
  audioBtn.addEventListener("click", ()=>{isPlaying?stopTone():startTone();});

  // =========================
  // Custom Orbit (desde cero)
  // - Drag izquierdo: orbitar
  // - Wheel: zoom (cambia radio)
  // =========================
  class SimpleOrbit {
    constructor(camera, dom, target=new THREE.Vector3(0,0,0)){
      this.camera = camera; this.dom = dom; this.target = target.clone();
      // Init a partir de la posición de la cámara
      const rel = new THREE.Vector3().subVectors(camera.position, this.target);
      this.sph = new THREE.Spherical().setFromVector3(rel); // {radius, phi, theta}
      // Límites suaves
      this.minPhi = 0.01; this.maxPhi = Math.PI - 0.01;
      this.minR = 1.2; this.maxR = 50;
      // Estado de interacción
      this.dragging = false; this.last = {x:0,y:0};
      // Sensibilidades
      this.rotSpeed = 0.008;
      this.zoomSpeed = 1.1; // factor por rueda

      // Listeners
      this._onDown = e => { this.dragging = true; this.last.x = e.clientX; this.last.y = e.clientY; this.dom.setPointerCapture?.(e.pointerId||0); };
      this._onMove = e => {
        if(!this.dragging) return;
        const dx = e.clientX - this.last.x;
        const dy = e.clientY - this.last.y;
        this.last.x = e.clientX; this.last.y = e.clientY;
        this.sph.theta -= dx * this.rotSpeed;
        this.sph.phi   -= dy * this.rotSpeed;
        this.sph.phi = Math.max(this.minPhi, Math.min(this.maxPhi, this.sph.phi));
        this.updateCamera();
      };
      this._onUp = e => { this.dragging = false; this.dom.releasePointerCapture?.(e.pointerId||0); };
      this._onWheel = e => {
        e.preventDefault();
        const dir = Math.sign(e.deltaY);
        if (dir > 0) this.sph.radius = Math.min(this.maxR, this.sph.radius * this.zoomSpeed);
        else this.sph.radius = Math.max(this.minR, this.sph.radius / this.zoomSpeed);
        this.updateCamera();
      };

      // Pointer events (compatibles)
      dom.addEventListener("pointerdown", this._onDown);
      dom.addEventListener("pointermove", this._onMove);
      dom.addEventListener("pointerup", this._onUp);
      dom.addEventListener("wheel", this._onWheel, {passive:false});

      this.updateCamera();
    }
    lookAt(target){ this.target.copy(target); this.updateCamera(); }
    updateCamera(){
      const v = new THREE.Vector3().setFromSpherical(this.sph).add(this.target);
      this.camera.position.copy(v);
      this.camera.lookAt(this.target);
    }
    dispose(){
      const d=this.dom;
      d.removeEventListener("pointerdown", this._onDown);
      d.removeEventListener("pointermove", this._onMove);
      d.removeEventListener("pointerup", this._onUp);
      d.removeEventListener("wheel", this._onWheel);
    }
  }

  // =========================
  // Three.js
  // =========================
  let scene,camera,renderer,orbit,sphere,t=0;
  function initThree(){
    const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 100);
    camera.position.set(3,2.2,3);

    renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setSize(W,H); renderer.setPixelRatio(window.devicePixelRatio||1);
    canvasWrap.appendChild(renderer.domElement);

    orbit = new SimpleOrbit(camera, renderer.domElement);

    scene.add(new THREE.AxesHelper(2.0));
    const dl = new THREE.DirectionalLight(0xffffff,1.0); dl.position.set(3,5,2); scene.add(dl);
    scene.add(new THREE.AmbientLight(0xffffff,0.25));

    sphere = new THREE.Mesh(new THREE.SphereGeometry(0.35,32,16), new THREE.MeshStandardMaterial({metalness:0.1,roughness:0.4}));
    sphere.position.set(0,0.35,0); scene.add(sphere);

    window.addEventListener("resize", onResize); onResize(); animate();
  }
  function onResize(){
    const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;
    camera.aspect=W/H; camera.updateProjectionMatrix(); renderer.setSize(W,H);
  }
  function animate(){
    requestAnimationFrame(animate);
    const v = parseFloat(slider.value); t += 0.01*v;
    sphere.position.x = Math.sin(t*1.3)*0.9;
    sphere.position.y = 0.35 + Math.abs(Math.sin(t*0.9))*0.5;
    sphere.position.z = Math.cos(t*1.1)*0.9;
    sphere.rotation.y += 0.01*v;

    if(isPlaying && osc){
      const baseHz = 110 * Math.max(1, Number(numInput.value||1));
      const mod = 1 + sphere.position.y;
      osc.frequency.setTargetAtTime(baseHz*mod, osc.context.currentTime, 0.02);
    }

    renderer.render(scene,camera);
    updateHUD();
  }
  function updateHUD(){
    const p = sphere ? sphere.position : {x:0,y:0,z:0};
    hud.textContent =
      "Slider (velocidad): " + slider.value + "\n" +
      "Clicks botón: " + clickState.count + "\n" +
      "Texto: " + textInput.value + "\n" +
      "Número: " + numInput.value + "\n" +
      "Esfera xyz: " + p.x.toFixed(3)+", "+p.y.toFixed(3)+", "+p.z.toFixed(3);
  }

  // =========================
  // Boot
  // =========================
  await ensureThree();
  initThree();

} catch(err) {
  const pre = document.createElement("pre");
  pre.style.whiteSpace = "pre-wrap";
  pre.textContent = "ERROR DataviewJS:\n" + (err && err.stack ? err.stack : err);
  this.container.appendChild(pre);
}
```




## hola mundo en html


```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ciencia y Música — Hello Web</title>
  <style>
    .cym-root { position: relative; border: 1px solid #ccc; padding: 12px; border-radius: 8px; max-width: 1100px; margin: 24px auto; }
    .cym-ui { display: grid; grid-template-columns: repeat(4, minmax(160px, 1fr)); gap: 12px; align-items: center; margin-bottom: 12px; }
    .cym-ui > div { display: flex; gap: 8px; align-items: center; }
    .cym-canvas-wrap { position: relative; width: 100%; height: 520px; background: transparent; }
    .cym-hud {
      position: absolute; inset: 8px auto auto 8px; padding: 8px 10px;
      background: rgba(0,0,0,0.35); color: #fff; font: 12px/1.2 system-ui, sans-serif; border-radius: 6px;
      pointer-events: none; white-space: pre; min-width: 220px;
    }
    .cym-btn { padding: 6px 10px; border: 1px solid #aaa; border-radius: 6px; background: #eee; cursor: pointer; }
    .cym-btn:active { transform: translateY(1px); }
    .cym-number { width: 110px; }
    .cym-input { width: 160px; }
  </style>
  <!-- Three.js r149 legacy + OrbitControls no-module (global THREE) -->
  <script src="https://unpkg.com/three@0.149.0/build/three.min.js"></script>
  <script src="https://unpkg.com/three@0.149.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>
  <div class="cym-root" id="cym-hello-web-root">
    <div class="cym-ui">
      <div>
        <label>Velocidad</label>
        <input id="slider" type="range" min="0.1" max="5" step="0.1" value="1.2" />
      </div>
      <div>
        Acción
        <button id="btn" class="cym-btn">Botón</button>
      </div>
      <div>
        <label>Texto</label>
        <input id="text" class="cym-input" type="text" value="Ciencia y Música" placeholder="Escribe..." />
      </div>
      <div>
        <label>Número</label>
        <input id="num" class="cym-number" type="number" step="1" value="3" />
      </div>
      <div>
        Audio
        <button id="audioBtn" class="cym-btn">Play Sine</button>
      </div>
    </div>
    <div class="cym-canvas-wrap" id="canvasWrap">
      <div class="cym-hud" id="hud">HUD</div>
    </div>
  </div>

  <script>
    // ============================================================
    // Ciencia y Música — Hello Web (Standalone)
    // ============================================================

    // -------------------------
    // 1) Referencias DOM
    // -------------------------
    const root = document.getElementById("cym-hello-web-root");
    const slider = document.getElementById("slider");
    const btn = document.getElementById("btn");
    const textInput = document.getElementById("text");
    const numInput = document.getElementById("num");
    const audioBtn = document.getElementById("audioBtn");
    const canvasWrap = document.getElementById("canvasWrap");
    const hud = document.getElementById("hud");

    // -------------------------
    // 2) Estado UI simple
    // -------------------------
    const clickState = { count: 0 };
    btn.addEventListener("click", () => { clickState.count++; updateHUD(); });
    textInput.addEventListener("input", updateHUD);
    numInput.addEventListener("input", updateHUD);

    // -------------------------
    // 3) WebAudio: sine tone
    // -------------------------
    let audioCtx = null, osc = null, gain = null, isPlaying = false;
    function startTone() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      osc = audioCtx.createOscillator();
      gain = audioCtx.createGain();
      const baseHz = 110 * Math.max(1, Number(numInput.value || 1));
      osc.frequency.value = baseHz;
      gain.gain.value = 0.15;
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      isPlaying = true; audioBtn.textContent = "Stop Sine";
    }
    function stopTone() {
      try { if (osc) { osc.stop(); osc.disconnect(); } } catch(e) {}
      try { if (gain) { gain.disconnect(); } } catch(e) {}
      osc = null; gain = null; isPlaying = false; audioBtn.textContent = "Play Sine";
    }
    audioBtn.addEventListener("click", () => { isPlaying ? stopTone() : startTone(); });

    // -------------------------
    // 4) Three.js escena
    // -------------------------
    let scene, camera, renderer, controls, sphere, t = 0;

    function initThree() {
      const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 100);
      camera.position.set(3, 2.2, 3);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      canvasWrap.appendChild(renderer.domElement);

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.dampingFactor = 0.08; controls.rotateSpeed = 0.6;

      const axes = new THREE.AxesHelper(2.0); scene.add(axes);
      const light = new THREE.DirectionalLight(0xffffff, 1.0); light.position.set(3, 5, 2); scene.add(light);
      scene.add(new THREE.AmbientLight(0xffffff, 0.25));

      const geo = new THREE.SphereGeometry(0.35, 32, 16);
      const mat = new THREE.MeshStandardMaterial({ metalness: 0.1, roughness: 0.4 });
      sphere = new THREE.Mesh(geo, mat); sphere.position.set(0, 0.35, 0);
      scene.add(sphere);

      window.addEventListener("resize", onResize);
      onResize();
      animate();
    }

    function onResize() {
      const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    }

    function animate() {
      requestAnimationFrame(animate);
      const v = parseFloat(slider.value);
      t += 0.01 * v;
      sphere.position.x = Math.sin(t * 1.3) * 0.9;
      sphere.position.y = 0.35 + Math.abs(Math.sin(t * 0.9)) * 0.5;
      sphere.position.z = Math.cos(t * 1.1) * 0.9;
      sphere.rotation.y += 0.01 * v;

      if (isPlaying && osc) {
        const baseHz = 110 * Math.max(1, Number(numInput.value || 1));
        const mod = 1 + sphere.position.y;
        osc.frequency.setTargetAtTime(baseHz * mod, osc.context.currentTime, 0.02);
      }

      controls.update();
      renderer.render(scene, camera);
      updateHUD();
    }

    function updateHUD() {
      const p = sphere ? sphere.position : {x:0,y:0,z:0};
      hud.textContent =
        "Slider (velocidad): " + slider.value + "\n" +
        "Clicks botón: " + clickState.count + "\n" +
        "Texto: " + textInput.value + "\n" +
        "Número: " + numInput.value + "\n" +
        "Esfera xyz: " +
          p.x.toFixed(3) + ", " + p.y.toFixed(3) + ", " + p.z.toFixed(3);
    }

    // -------------------------
    // 5) Inicio
    // -------------------------
    initThree();
  </script>
</body>
</html>
```







