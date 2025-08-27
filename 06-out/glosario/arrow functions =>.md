

Las arrow functions`(()⇒{})` son una forma corta de escribir funciones en JavaScript.
- Sintaxis básica:

`const f = (x,y) ⇒ x+y;`   // función de una línea (retorno implícito)

- Para varias líneas se usan llaves:

```js
const f = (x) ⇒ { 
  const r = x*2; 
  return r; 
};
```


- A diferencia de function(){}, las arrow functions no crean su propio this; heredan el contexto exterior. Eso las hace muy prácticas en callbacks de eventos (como btn.onclick=()=>{...}), porque no cambia el valor de this.

En los patches que hicimos, las usamos como “flag functions” de control:
- `btn.onclick=()⇒on?stop():start();` es una arrow function que actúa como flag: según el estado (on), decide llamar a stop() o start().

