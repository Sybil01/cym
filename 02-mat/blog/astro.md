Astro + MDX + remark-math + rehype-katex [potente y extensible]
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