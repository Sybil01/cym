
1.Crear proyecto Astro básico

```bash
npm create astro@latest          # crea un proyecto Astro desde el starter recomendado
cd mi-sitio-astro                # entra al folder del proyecto
npm i                            # instala dependencias iniciales
```

2.Instalar soporte de matemáticas

```bash
npm i -D @astrojs/mdx remark-math rehype-katex   # activa MDX y KaTeX para fórmulas en Markdown/MDX
npm i -D @astrojs/adapter-static                  # adaptador estático para GitHub Pages
```

3.Configurar Astro (astro.config.mjs)

Crea/edita astro.config.mjs con:

```js
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import staticAdapter from '@astrojs/adapter-static'
export default defineConfig({
  site: 'https://TU_USUARIO.github.io/TU_REPO/',  // URL final de Pages para rutas absolutas correctas
  output: 'static',                                // salida estática para Pages
  adapter: staticAdapter(),                        // usa el adaptador de páginas estáticas
  integrations: [mdx()],                           // habilita MDX
  markdown: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] } // soporte KaTeX
})
```

4.Crear una portada que liste las notas traídas desde 06-out
Crea src/pages/index.astro:


```ts
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('src/pages/content') // aquí copiaremos 06-out en el build
function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p))
    else if (/\.(md|mdx)$/i.test(entry.name)) out.push(p)
  }
  return out
}
const files = fs.existsSync(ROOT) ? walk(ROOT) : []
const toSlug = (p) ⇒ p.replace(/^.*?src\/pages\/content\//,'').replace(/\.(md|mdx)$/i,'')
---
<html>
  <head>
    <meta charset="utf-8" />
    <title>Notas</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" />
  </head>
  <body>
    <h1>Notas publicadas</h1>
    <ul>
      {files.map(f => <li><a href={`/n/${encodeURIComponent(toSlug(f))}`}>{toSlug(f)}</a></li>)}
    </ul>
  </body>
</html>
```

5.Crear la ruta dinámica para renderizar cada nota Markdown/MDX
Crea src/pages/n/[...slug].astro:

---


```js
import fs from 'node:fs'
import path from 'node:path'
import { Markdown } from 'astro/components'

const slugArr = Array.isArray(Astro.params.slug) ? Astro.params.slug : [Astro.params.slug].filter(Boolean)
const rel = slugArr.join('/') + '.md' // prioridad .md
const relx = slugArr.join('/') + '.mdx' // alternativa .mdx
const base = path.resolve('src/pages/content')
const file = fs.existsSync(path.join(base, rel)) ? path.join(base, rel) : path.join(base, relx)
const raw = fs.readFileSync(file, 'utf8')
```
---

<html>
  <head>
    <meta charset="utf-8" />
    <title>{slugArr.join('/')}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" />
  </head>
  <body>
    <a href="/">← inicio</a>
    <Markdown>{raw}</Markdown>
  </body>
</html>

6.Añadir un paso de prebuild local opcional (no obligatorio)

mkdir -p scripts                                 # crea carpeta de scripts

Crea scripts/prebuild.js para desarrollo local (opcional):

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'vault/06-out'                       // origen local opcional (si quieres clonar el repo aparte)
const DEST = 'src/pages/content'                 // destino que Astro usará para renderizar

if (fs.existsSync(SRC)) {
  fs.rmSync(DEST, { recursive: true, force: true })
  execSync(`mkdir -p ${DEST} && cp -R "${SRC}/." "${DEST}/"`, { stdio: 'inherit' })
  console.log('Contenido copiado localmente a src/pages/content')
} else {
  console.log('Saltando copia local, se hará en CI desde GitHub')
}

Y en package.json agrega:

{
  "scripts": {
    "prebuild": "node scripts/prebuild.js",       // copia local opcional antes del build
    "build": "astro build",
    "dev": "astro dev",
    "preview": "astro preview"
  }
}

7.Workflow de GitHub Pages que trae solo 06-out del repo musiki/cym
Crea .github/workflows/deploy.yml:

name: Deploy Astro to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: astro-pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4                         # checkout de tu repo Astro

      - name: Checkout folder 06-out from musiki/cym
        uses: actions/checkout@v4                         # checkout selectivo de la carpeta externa
        with:
          repository: musiki/cym
          ref: main
          path: vault
          sparse-checkout: |
            06-out
          sparse-checkout-cone: true

      - name: Prepare content directory
        run: |
          rm -rf src/pages/content
          mkdir -p src/pages/content
          cp -R vault/06-out/. src/pages/content
        # copia exactamente musiki/cym/06-out → src/pages/content

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm ci || npm i                              # instala deps
      - run: npm run build || npx astro build            # construye el sitio (dist/)

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist                                   # sube dist/ como artifact para Pages

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4                    # publica el artifact en GitHub Pages

8.Activar Pages en el repo

GitHub → Settings → Pages → Source: GitHub Actions   # indica que Pages se alimenta del workflow

9.Commit y push

git add -A                          # agrega todos los cambios al índice
git commit -m "Astro + KaTeX + Pages + 06-out de musiki/cym"   # mensaje de commit
git push                            # sube a main y dispara el workflow

10.Verificar despliegue

GitHub → Actions → revisa que el job termine en verde y que se generó dist/
GitHub → Settings → Pages → revisa la URL publicada y ábrela en el navegador

Notas clave
•El workflow siempre trae solo 06-out del repo musiki/cym en cada build, sin symlinks locales.
•Si 06-out tiene index.md, podrás enlazarlo como /n/index; la portada src/pages/index.astro ya lista cualquier .md/.mdx.
•KaTeX funciona de inmediato; si prefieres MathJax, cambia rehype-katex por rehype-mathjax y carga el script de MathJax.
•Si musiki/cym fuera privado, añade un token en secrets.VAULT_TOKEN y pasa token: ${{ secrets.VAULT_TOKEN }} al segundo checkout.

¿Quieres que agregue un pequeño layout con estilos mínimos y navegación por carpetas para esa lista inicial?