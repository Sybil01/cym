
1. clonar repo
```bash
git clone https://github.com/jackyzha0/quartz.git
cd quartz
npm i
```

2. crear un repo propio donde vas a alojar la publicación

```bash
# ejemplo de repo de publicaciones de cym
https://github.com/musiki/cym-p
```

3. correr npx quart

```bash
npx quartz create
```

4.borrar el .git

```bash
rm -rf .git
```

5. apuntar el url a nuestro repo de publicación
```bash
git init
git add .
git commit -m "first quartz"
git branch -M main
git remote add origin https://github.com/musiki/cym-p
git remote set-url origin https://github.com/musiki/cym-p.git
npx quartz sync --no-pull
```

6. crear deploy.yml

```
cd .github/workflows

nano deploy.yml

#copiar este código
```

### deploy.yml

el deploy.yml es un Github Actions para generar en ci/cd las páginas de quartz 

```bash
name: Deploy Quartz to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: quartz-pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - run: npm i -g npm@latest
      - run: npm ci || npm i

      - run: npx quartz build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
7. ir a github / settings / pages 
8. elegir Github Actions




- Idea: pensado para publicar directamente un vault de Obsidian como sitio estático; trae KaTeX por defecto y acepta HTML en notas, por lo que puedes incrustar scripts.
- Pasos:
1.Crear repo a partir del template de Quartz v4 y copiar tus notas a content/ (o clonar y adaptar).
2.Math: ya viene activo; usa delimitadores $…$ y $$…$$.
3.JS ejecutable: en una nota puedes escribir HTML+JS crudo. Ejemplo en una nota .md


<div id="demo"></div>
<script>
  const el=document.getElementById('demo');el.textContent='Hola desde JS';
</script>


Para reutilizar, coloca un archivo en public/js/app.js y referencia:

<script src="/js/app.js"></script>


4.Despliegue:
- GitHub Pages: usa la acción específica para build de Quartz o configura Pages para servir la carpeta de salida generada por la acción.  ￼
- Vercel: importa el repo y en “Build Command” usa npx quartz build.  ￼

- Pros: configuración mínima, KaTeX integrado, muy cercano a Obsidian. Concede HTML crudo, por tanto snippets activos funcionan.  ￼
- Contras: menos control fino del pipeline y de la seguridad de scripts; si tus alumnos pegan scripts externos, conviene enseñar prácticas básicas de CSP.

2.Eleventy (11ty) + Markdown-it + KaTeX [intermedio, muy controlable]

- Idea: SSG simple en Node que procesa Markdown; acepta HTML crudo y puedes activar KaTeX/MathJax vía plugins de Markdown-it.
- Pasos:
1.Inicializar:

npm i -D @11ty/eleventy markdown-it @mdit/plugin-katex


2.Configuración .eleventy.js mínima con KaTeX:

const markdownIt=require('markdown-it');
const katex=require('@mdit/plugin-katex');
module.exports=function(eleventyConfig){
  const md=markdownIt({html:true,linkify:true,typographer:true}).use(katex);
  eleventyConfig.setLibrary('md',md);
  eleventyConfig.addPassthroughCopy({'public':'/'}); // para js/css
  return {dir:{input:'src',output:'_site'}};
}

En src/posts/ tus .md de Obsidian; coloca estilos KaTeX en public/katex.min.css si el plugin no los inyecta.

3.JS ejecutable: igual que arriba, HTML+script en la nota o  desde public/js/app.js. Eleventy permite HTML directo en Markdown.  ￼
4.Math: delimitadores $…$ y $$…$$ con KaTeX.  ￼
5.Despliegue:
- GitHub Pages: workflow con actions-gh-pages que empuja _site a gh-pages; configura Pages para ese branch.  ￼
- Vercel: importa el repo, “Build Command”: npx @11ty/eleventy, “Output dir”: _site.  ￼

- Pros: curva de aprendizaje suave, control de pipeline y plantillas, HTML crudo admitido; perfecto para enseñar fundamentos.
- Contras: necesitas añadir KaTeX y CSS; más pasos que Quartz.



---




# 3.Astro + MDX + remark-math + rehype-katex [potente y extensible]
# 
- Idea: Astro es moderno y muy rápido; con MDX puedes mezclar Markdown y componentes y controlar islas interactivas. Perfecto para alumnos que sí codean y quieran “niveles pro”.
- Pasos:
1.Crear proyecto:

npm create astro@latest
npm i -D @astrojs/mdx remark-math rehype-katex

En astro.config.[m]js:

import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
  integrations:[mdx()],
  markdown:{remarkPlugins:[remarkMath],rehypePlugins:[rehypeKatex]}
});

Añade katex.min.css a tu layout base.

2.Contenido: coloca notas en src/content/posts/ usando .md o .mdx. Con MDX puedes insertar componentes y lógica si hace falta.  ￼
3.JS ejecutable:
- En .md, HTML crudo con  funciona porque Astro pasa HTML al output; en MDX, los  tienen matices, por lo que para interactividad es más limpio usar componentes Astro/JS con client:load o client:idle. Ejemplo:

---



// MyWidget.astro
—
<button on:click={()=>alert(‘Hi!’)}>Run
```
y en una nota .mdx: <MyWidget client:load />.
Ver detalles y advertencias sobre  en MDX.  ￼
4. Math: $…$ y $$…$$ con remark-math + rehype-katex (o rehype-mathjax si prefieres MathJax).  ￼
5. Despliegue:
- Vercel: cero config; importa el repo y listo o usa @astrojs/vercel para SSR si lo necesitas.  ￼
- GitHub Pages: posible con build estático y action que publique dist/.
- Pros: máxima flexibilidad, MDX, componentes, performance; ideal para posts con demos complejas.
- Contras: más piezas y decisiones; pequeños bordes con  en MDX si insistes en inline.

Recomendación por perfil mixto de alumnos
- Curso corto y zero-friction: Quartz v4.
- Curso con fundamentos web: Eleventy.
- Curso avanzado con componentes y “islas”: Astro.

Notas de seguridad y clase
- Enseña a separar demos JS en public/js y a incluirlos con  para no llenar las notas de código. En Astro, preferir componentes con client:*.
- Si usan scripts de terceros, explica CSP y el riesgo de pegar  indiscriminadamente.

Training Data vs Recent Sources
- Training Data: experiencia general con SSGs, Eleventy, Astro, Vercel/GitHub Pages y uso de HTML crudo en Markdown.
- Recent Sources:
- Quartz v4 overview, LaTeX y guía de hosting a Vercel/GitHub Pages.  ￼
- Eleventy: Markdown/HTML crudo, despliegue a GitHub Pages.  ￼
- KaTeX/MathJax plugins y uso con Astro/MDX.  ￼
- Astro deploy en Vercel y MDX integration; caveats de  en MDX.  ￼

BibTeX

@misc{Quartz2025,
  author={Zhao, Jacky},
  title={Quartz 4 Documentation},
  year={2025},
  howpublished={\url{https://quartz.jzhao.xyz/}},
  note={LaTeX y Hosting}, pages={n.p.}
}
@misc{QuartzLatex2025,
  author={Zhao, Jacky},
  title={Quartz Feature: LaTeX},
  year={2025},
  howpublished={\url{https://quartz.jzhao.xyz/features/Latex}},
  pages={n.p.}
}
@misc{QuartzHosting2025,
  author={Zhao, Jacky},
  title={Hosting Quartz (Vercel)},
  year={2025},
  howpublished={\url{https://quartz.jzhao.xyz/hosting}},
  pages={n.p.}
}
@misc{EleventyMarkdown,
  author={Eleventy},
  title={Markdown Language Support},
  year={2024},
  howpublished={\url{https://www.11ty.dev/docs/languages/markdown/}},
  pages={n.p.}
}
@misc{EleventyDeployGP,
  author={Eleventy},
  title={Deploy an Eleventy project to GitHub Pages},
  year={2024},
  howpublished={\url{https://www.11ty.dev/docs/deployment/}},
  pages={n.p.}
}
@misc{mditKatex2025,
  author={Markdown-it Plugins},
  title={@mdit/plugin-katex},
  year={2025},
  howpublished={\url{https://mdit-plugins.github.io/katex.html}},
  pages={n.p.}
}
@misc{remarkMath,
  author={remarkjs},
  title={remark-math / rehype-katex / rehype-mathjax},
  year={2024},
  howpublished={\url{https://github.com/remarkjs/remark-math}},
  pages={n.p.}
}
@misc{AstroVercelDocs,
  author={Astro},
  title={Deploy your Astro Site to Vercel},
  year={2025},
  howpublished={\url{https://docs.astro.build/en/guides/deploy/vercel/}},
  pages={n.p.}
}
@misc{AstroMDXDocs,
  author={Astro},
  title={MDX in Astro},
  year={2025},
  howpublished={\url{https://docs.astro.build/en/guides/integrations-guide/mdx/}},
  pages={n.p.}
}
@misc{AstroScriptMDXIssue,
  author={withastro},
  title={inject script tag in mdx content (issue \#6327)},
  year={2023},
  howpublished={\url{https://github.com/withastro/astro/issues/6327}},
  pages={n.p.}
}

¿Quieres que te deje un starter listo para cada opción con estructura de carpetas y un post de ejemplo con $\int e^{x}dx=e^{x}+C$ y un snippet JS ejecutable?