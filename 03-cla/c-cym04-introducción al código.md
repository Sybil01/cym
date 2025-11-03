---
title: código
tags:
  - class
type: class
---
<grid drag="60 55" drop="5 10" bg="black" align="left">
# Código
### Clase 4
</grid>
<grid drag="-5 10" drop="5 -10" bg="black">
![[cym-header]]
</grid>
test label 250930 luc zztt

# Introducción a la web web

## html
>[!note] > ver [[html]]
## css
>[!note] > ver [[css]]

##  js
>[!note] > ver [[js-01-fundamentos]]

### WebAudioApi
La Web Audio API es una API de JavaScript que permite crear, procesar y controlar audio directamente en el navegador, desde un audio importado hasta sonidos sintéticos, filtros, efectos, modular el volumen, la posición espacial, etc.
![[Pasted image 20250924090749.png]]
Es un sistema basado en nodos que se conectan entre sí formando una red de audio. Como última instancia, se conecta al nodo AudioDestinationNode, como salida del dispositivo.
![[Pasted image 20250924090727.png]]
- AudioContext: es el cerebro que maneja todo.
- Source: producen sonido (osciladores, archivos de audio, micrófono).
- Transformation: modifican el sonido (filtros, volumen, efectos).
- Destination: output.
<iframe height="600" width="800" src="https://codepen.io/carodip/pen/emJppWv" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>

 <iframe src="https://codepen.io/carodip/pen/rNdXbrv" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>

#### toneJS
Tone.js es un framework de audio web para el navegador basado en la WebAudioAPI.

acceso--> https://tonejs.github.io/

##### Tone.Transport
<iframe width="560" height="315" src="https://codepen.io/carodip/pen/eYbeMEV" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

##### Random

<iframe width="560" height="315" src="https://codepen.io/carodip/pen/mdaqxON" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

---
# Github pages

Github pages permite hospedar un sitio web directamente desde un repositorio en Github, con el dominio `github.io` o un dominio personalizado.

### pasos
1. Creá un repositorio de visibilidad pública
![](https://i.imgur.com/FlPGMZ9.png)
2. Inicializá un README o cargá tu html/css/js
3. Luego, en Settings, en la sección Code and automation, ir a Pages.
4. Seleccioná el source y el branch y guardá. Allí, debería crearte un link con el acceso a la página.

## visualStudioCode

1) crear un index.html / index.js / index.css en VisualStudioCode (esas tres secciones representan a mis 3 pestañas de Codepen)
2) agregar archivos css y js en el html (relacionar lo que en Codepen figura separado, unificarlo)
```html
<link rel="stylesheet" href="./index.css">
<link rel="javascript" href="./index.js">
```
3) hay dos formas de cargar los archivos a github:
	1) subiendo el archivo ![](https://i.imgur.com/yyzB4a4.png)
	2) desde la terminal del visualStudio **(SÓLO LA PRIMERA VEZ!)**
> [!INFO] > …or push an existing repository from the command line
git remote add origin https://github.com/dipaola-c/pruebacym2023.git
git branch -M main
git push -u origin main


- **En la terminal del visualStudio (dentro de nuestro folder), hacer git add . , luego git commit, i (insert) sobre data del commit, esc :wq , git push al repo remoto**
para más info ver: 
![[que es git#comandos básicos git]]



==Luego, en **VisualStudioCode**, para agregar cambios al repo remoto sobre los archivos ya existentes, guardarlos (control o command S) y en la terminal:==

>[!example] > git add .
 git commit -m "mensaje sobre el commit"
git push

4) En github, en la sección 'Settings', ir a 'Pages' y acceder a la url de nuestra web.

