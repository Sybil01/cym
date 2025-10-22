


sistema tentacular multiversal, compuesto por celulares como agentes distribuidos, que exploran una fuente central de godrays y componen, en conjunto, una música espacialmente inmersiva. El sistema responde tanto a orientación espacial (giro XYZ) como a posición relativa.

---

 ## Modelización MOAIE del sistema tentacular

Cada celular agente $C_i$ actúa como:
	•	Sensor de orientación espacial $(\theta_x, \theta_y, \theta_z)$
	•	Pantalla visual de parte del multiverso tentacular (Three.js/Shader)
	•	Nodo sonoro (sample, loop, o efecto vaporwave)
	•	Posible emisor o receptor dentro de un sistema distribuido

---

### Fórmula simbólica base
$$ 
\newcommand{\mat}{\blacksquare}
\newcommand{\obj}{\blacklozenge}
\newcommand{\agn}{\bullet}
\newcommand{\itf}{\leftrightarrow}
\newcommand{\ent}[1]{\boxed{#1}}
$$




$$
\forall i \in [1, N]:
\quad
C_i = \left\lbrace
\begin{array}{l}
\mat_{\text{pantalla}} \
\obj_{\text{dispositivo}} \
\agn_{\text{usuario girando}} \
\itf_{\text{orientación}(\theta_x, \theta_y, \theta_z)} \
\ent{\text{multiverso central: } \Phi(x,y,z,t)}
\end{array}
\right\rbrace
$$


---

 ### Fuente central de rayos divinos (“godrays”)

Denotamos al núcleo del multiverso luminoso como un campo vectorial centralizado:

$$
\Phi(x,y,z,t) = \text{GodRayField}_{\lambda,\kappa}(x,y,z,t)
$$

Donde:
	•	$\lambda$ controla la intensidad luminosa
	•	$\kappa$ modula la frecuencia de oscilación estética (por ejemplo, a tempo de vaporwave)

---

## Condición de acoplamiento angular

Un celular $C_i$ se alinea a un tentáculo de luz si:

$$
\vec{n}i \cdot \vec{r}{i\rightarrow 0} \approx 1
$$

Donde:
	•	$\vec{n}_i$ es el vector de orientación del dispositivo
	•	$\vec{r}_{i\rightarrow 0}$ es el vector que conecta el dispositivo al centro luminoso
	•	La condición máxima de acoplamiento ocurre cuando el ángulo es mínimo: $\angle(\vec{n}i, \vec{r}{i\rightarrow 0}) \approx 0$

---

### Sonido singular de un agente

Cada dispositivo emite un componente sonora $s_i(t)$ que depende de su acoplamiento angular y de su rotación dinámica:

$$
s_i(t) = A_i(t) \cdot \cos(\omega_i t + \phi_i)
$$

Con:
	•	$A_i(t) = f\left(\vec{n}i \cdot \vec{r}{i\rightarrow 0}\right)$ → amplitud controlada por orientación
	•	$\omega_i$ y $\phi_i$ determinados por sensores y shaders

---

## sistema total

El sonido global es:

$$
S(t) = \sum_{i=1}^{N} s_i(t)
$$

y la imagen renderizada se construye como:

$$
\mathcal{V}(t) = \bigcup_{i=1}^{N} \text{ShaderView}i\left(\theta{x,y,z}, \vec{r}_{i\rightarrow 0}, \Phi\right)
$$

---

## MOAIE total del sistema

$$
\sum_{i=1}^{N}
\left[
\agn_i \rightarrow \obj_i \rightarrow \itf_{\text{gyro+shader}} \rightarrow \mat_{\text{celular}} \rightarrow \ent{\Phi(x,y,z,t)}
\right]
\rightarrow
\ent{\text{Tentaculoverso Vaporwave}}
$$
