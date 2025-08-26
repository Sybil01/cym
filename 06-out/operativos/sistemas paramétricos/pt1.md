
```dataviewjs
(()=> {
  const A=0.60, H=0.30, C=0.10, D=0.80; // activación, inhibición, consumo, difusión
  dv.span("Binomios: Activación–Difusión / Inhibición–Consumo");
  const filas=[
    ["Activación (A)","aporte local (+)","+A·u",A.toFixed(2)],
    ["Inhibición (H)","control local (−)","−H·u",H.toFixed(2)],
    ["Consumo (C)","decaimiento/agotamiento (−)","−C·u",C.toFixed(2)],
    ["Difusión (D)","suavizado espacial","D∇²u",D.toFixed(2)]
  ];
  dv.table(["Parámetro","Rol","Término tipo","Valor"],filas);
  const balance=(A-H-C).toFixed(2);
  dv.paragraph(`Balance local (A−H−C)=${balance} | Difusión D=${D.toFixed(2)} | Esquema: Δu/Δt ≈ (A−H−C)·u + D∇²u`);
})();
```

Paso a paso:
1. Separá funciones locales de espaciales. A y H actúan localmente sobre la cantidad del morfógeno u; C modela pérdida basal; D actúa espacialmente como difusión (Laplaciano ∇²).
2. Activación (A) no es difundir. A aporta señal local positiva (+A·u); D no crea señal, la redistribuye en el espacio (suaviza y propaga).
3. Inhibición (H) no es lo mismo que consumo (C). H es una interacción regulatoria negativa que suprime la activación en la reacción (−H·u). C es un término de agotamiento/decadencia que drena el morfógeno aunque no haya interacción inhibidora (−C·u).
4. La línea Δu/Δt ≈ (A−H−C)·u + D∇²u es un esquema didáctico para situar los signos y roles. En un modelo de reacción‑difusión real (p. ej., Gray‑Scott), estos términos se detallan con ecuaciones para dos especies y coeficientes de difusión distintos.
