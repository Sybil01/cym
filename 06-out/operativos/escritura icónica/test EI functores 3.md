
**1. Descripción axiomática**
El proyecto parte de la idea de una *partitura espacial* que opera como modelo y meta‑modelo simultáneamente: no es un objeto musical fijo, sino un procedimiento abierto. Siguiendo el planteo esquizoanalítico de Guattari, la producción de subjetividad no se reduce a representaciones sino a modelizaciones de comportamientos, sensibilidad, percepción y memoria; el proyecto toma esto literalmente transformando los flujos de texto, sonido y movimiento en operadores. Se propone una cartografía sonora donde los materiales (`\mat_p`, `\mat_d`) y objetos (`\obj_i`, `\obj_h`) se conectan con agentes (`\agn_h`, `\agn_{ai}`) y entornos (`\ent{h}`, `\ent{d}`) por interfaces, creando un mapa que es a la vez geografía y partitura. En esta meta‑modelización, cada nodo-texto funciona como territorio, cada línea como phylum de movimientos, y el todo como topología acústica.

**2. Fórmula de escritura icónica**
Encabezado:

$$
\newcommand{\mat}{\blacksquare}
\newcommand{\obj}{\blacklozenge}
\newcommand{\agn}{\bullet}
\newcommand{\itf}{\leftrightarrow}
\newcommand{\ent}[1]{\boxed{#1}}
$$

* Fórmula simple:

  $$
  \left(\mat_p \,\itf\, \obj_i\right) \times \left(\agn_h \,\itf\, \ent{h}\right) 
  $$

  La partitura espacial emerge de la interacción entre materiales físicos y objetos instrumentales, cruzada con la relación entre un agente humano y un entorno híbrido.

* Fórmula compleja:

  $$
  \bigl[\bigl(\mat_d \,\diamond^{-1}\, \mat_p\bigr) \rightarrow \left(\obj_h \,\cup\, \obj_s\right)\bigr] \,\circlearrowright\, \bigl(\agn_{ai} \,\oplus\, \agn_h\bigr) \,\mapsto\, \ent{d}
  $$

  Aquí, la digitalización (`\diamond^{-1}`) del material físico produce hiperobjetos y objetos sintéticos; mediante una recurrencia creativa (`\circlearrowright`), esos objetos se unen con agentes artificiales y humanos, transformando el entorno digital.

**3. Desglose de términos**

* **\$\mat\_p\$**: material físico (papel, tinta, espacio escénico).
* **\$\mat\_d\$**: material digital (proyecciones, datos sonoros).
* **\$\obj\_i\$**: objeto instrumental (instrumentos musicales, dispositivos de proyección).
* **\$\obj\_h\$**: hiperobjeto, estructura espacial compleja que combina texto y sonido.
* **\$\obj\_s\$**: objeto sintético, resultado de algoritmos musicales.
* **\$\agn\_h\$**: agente humano (compositor/intérprete).
* **\$\agn\_{ai}\$**: agente artificial (sistemas generativos, IA).
* **\$\ent{h}\$**: entorno híbrido (espacio físico con interactividad digital).
* **\$\ent{d}\$**: entorno digital (sistemas de sonido e imágenes virtuales).
* **\$\itf\$**: interfaz, conexión directa entre entidades; genera intercambios de energía/información.
* **\$\times\$**: crossing, cruce entre dos relaciones independientes, generando un plano nuevo.
* **\$\cup\$**: unión, suma de posibles objetos.
* **\$\diamond^{-1}\$**: digitalización, operator que transforma lo físico en digital.
* **\$\rightarrow\$**: causalidad o implicación; transforma resultados de una operación en condiciones para la siguiente.
* **\$\circlearrowright\$**: recursión, repetición creativa; permite iterar transformaciones.
* **\$\oplus\$**: suma diferenciada, combinación de entidades con preservación de sus diferencias.
* **\$\mapsto\$**: mapeo, asociación de un conjunto a otro en el entorno.

**4. Ejemplo en JavaScript (DataviewJS/Obsidian)**

```dataviewjs
// Wrapper y botones
const wrapperId = 'moaie-wrapper-' + Date.now();
dv.container.innerHTML = `
  <div id="${wrapperId}" style="height:350px; border:1px solid #ccc;"></div>
  <div style="margin-top:8px;">
    <button id="moaie-start">Start</button>
    <button id="moaie-stop">Stop</button>
    <button id="moaie-reseed">Reseed</button>
    <span id="moaie-status" style="margin-left:8px;">Stopped</span>
  </div>
`;

async function loadThree() {
  if (!window.THREE) {
    await new Promise(res => {
      const sc = document.createElement('script');
      sc.src = 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.min.js';
      sc.onload = res;
      document.head.appendChild(sc);
    });
  }
}

await loadThree();

// Variables de escena y audio
let scene, camera, renderer, nodes = [], lines = [], animId;
let audioCtx, osc, gain, panner;
const wrapper = document.getElementById(wrapperId);

// Inicializa escena
function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, wrapper.clientWidth / wrapper.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
  wrapper.appendChild(renderer.domElement);

  // Crear nodos
  nodes = [];
  const count = 6;
  for (let i = 0; i < count; i++) {
    const geom = new THREE.SphereGeometry(0.2, 16, 16);
    const mat = new THREE.MeshBasicMaterial({color: i === 0 ? 0xff5533 : 0x3366cc});
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(Math.random()*6-3, Math.random()*4-2, Math.random()*4-2);
    scene.add(mesh);
    nodes.push(mesh);
  }
  // Crear líneas
  const pairs = [];
  for (let i = 0; i < count - 1; i++) {
    pairs.push([i, i+1]);
  }
  pairs.forEach(([a,b]) => {
    const geom = new THREE.BufferGeometry().setFromPoints([nodes[a].position, nodes[b].position]);
    const mat = new THREE.LineBasicMaterial({color:0x888888});
    const line = new THREE.Line(geom, mat);
    scene.add(line);
    lines.push(line);
  });

  // Audio
  if (!audioCtx) audioCtx = new AudioContext();
  osc = audioCtx.createOscillator();
  panner = audioCtx.createStereoPanner();
  gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 220;
  gain.gain.value = 0.2;
  osc.connect(panner).connect(gain).connect(audioCtx.destination);
  osc.start();
}

// Animación
function animate() {
  animId = requestAnimationFrame(animate);
  // Actualizar audio según posición del primer nodo
  if (osc && panner) {
    const n = nodes[0].position;
    osc.frequency.value = 220 + n.x * 30;
    panner.pan.value = Math.max(-1, Math.min(1, n.y / 5));
  }
  renderer.render(scene, camera);
}

// Controladores
document.getElementById('moaie-start').onclick = () => {
  if (!scene) initScene();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  animate();
  document.getElementById('moaie-status').textContent = 'Running';
};
document.getElementById('moaie-stop').onclick = () => {
  if (animId) cancelAnimationFrame(animId);
  if (osc) { osc.stop(); osc.disconnect(); }
  scene = null;
  nodes = [];
  lines = [];
  document.getElementById('moaie-status').textContent = 'Stopped';
};
document.getElementById('moaie-reseed').onclick = () => {
  if (scene) {
    // reposicionar nodos al azar
    nodes.forEach(n => {
      n.position.set(Math.random()*6-3, Math.random()*4-2, Math.random()*4-2);
    });
    lines.forEach((l, idx) => {
      const [a,b] = [nodes[idx], nodes[idx+1]];
      l.geometry.setFromPoints([a.position, b.position]);
    });
  }
};

// Resize observer
new ResizeObserver(() => {
  if (renderer && camera) {
    const w = wrapper.clientWidth;
    const h = wrapper.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
}).observe(wrapper);
```

**5. Preguntas conjeturales**

* ¿Cómo puede una partitura espacial integrar la subjetividad de intérpretes y oyentes sin fijar sus comportamientos en un modelo estable?
* ¿Qué roles pueden desempeñar agentes artificiales en la composición de mapas sonoros donde el texto funciona como territorio y no como representación?
* ¿No corre el riesgo este tipo de meta‑modelización de convertirse en un nuevo dispositivo de control cuando codifica afectos y percepciones?

**6. Bibliografía**

```bibtex
@book{GuattariRolnik2006,
  title     = {Micropolítica: Cartografías del deseo},
  author    = {Félix Guattari and Suely Rolnik},
  year      = {2006},
  publisher = {Traficantes de Sueños},
  note      = {Guattari plantea que la producción de subjetividad no es sólo representación sino modelización de comportamientos y percepciones}
}

```
