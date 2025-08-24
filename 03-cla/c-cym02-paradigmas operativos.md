---
title: arte y ciencia estado de la cuestión
tags:
  - class
type: class
---

<grid drag="60 55" drop="5 10" bg="black" align="left">
# Paradigmas Operativos
#### Clase 2
</grid>
<grid drag="-5 10" drop="5 -10" bg="black">
![[cym-header]]
</grid>

<grid drag="25 55" drop="-5 10" bg="black" align="top">
-> Spencer-Brown<br>
-> Pierce y el lenguaje icónico<br>
-> Términos del Método Científico<br>
-> Energía<br>
-> Intro a JS<br>
</grid>

---

que es modelar algo?
- especulacion - teorizacion - comprobacion experimental  (annus mirabilis Einstein)
- 
topoi -> po -> métodos -> entornos
obras

# George Spencer-Brown

3. Influencias principales
	•	George Boole: por la lógica algebraica.
	•	Charles Peirce: por la notación lógica icónica y el diagrama existencial.
	•	Bertrand Russell: en su formación matemática, aunque luego lo supera críticamente.
	•	Norbert Wiener y la cibernética: gran influencia formal y espiritual.
	•	Buddhismo Zen y misticismo Vedanta: influyen en el contenido existencial de su lógica.
	•	Wittgenstein (temprano): forma axiomática y aforística.

---
### obras principales

1957
Probability and Scientific Inference
Epistemología
Exploración de la inducción en ciencia.
1969
Laws of Form
Lógica/Formalismo
Su obra magna. Fusiona lógica, ontología y mística.
1972
Only Two Can Play This Game
Novela filosófica
Obra en clave poética con estructura lógica.
1973–1990s
Tertium Organum (inédito)
Filosofía total
Pretendía superar Aristóteles y Kant en un nuevo formalismo.



```run-python
import matplotlib.pyplot as plt

# Crear diagrama con Spencer-Brown en el centro y los 4 modos de Harman alrededor
fig, ax = plt.subplots(figsize=(7,7))

# Centro (Spencer-Brown)
ax.text(0, 0, "Distinguir\n(Spencer-Brown)", ha="center", va="center",
        fontsize=12, fontweight="bold", bbox=dict(facecolor="white", edgecolor="black"))

# Cuatro operaciones fundamentales (Harman)
positions = {
    "Retraer\n(Objeto real)": (0, 1),
    "Aparecer\n(Objeto sensual)": (1, 0),
    "Persistir\n(Calidad real)": (0, -1),
    "Variar\n(Calidad sensual)": (-1, 0)
}

for label, (x, y) in positions.items():
    ax.text(x, y, label, ha="center", va="center",
            fontsize=11, bbox=dict(facecolor="lightgray", edgecolor="black"))
    ax.arrow(0, 0, x*0.8, y*0.8, head_width=0.05, head_length=0.1, fc="black", ec="black")

# Ajustes visuales
ax.set_xlim(-1.5, 1.5)
ax.set_ylim(-1.5, 1.5)
ax.axis("off")
ax.set_title("Operaciones fundamentales de la modelización artística\n(Spencer-Brown + Harman)", fontsize=13)

plt.show()
```



