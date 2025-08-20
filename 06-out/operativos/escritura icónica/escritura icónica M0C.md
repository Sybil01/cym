# Programa de dos clases sobre escrituras lógico-formales con Spencer-Brown
Introducción a la escritura de distinciones de Spencer-Brown, comparación  con otros sistemas diagramáticos y aplicación en modelado agentes, materiales y procesos de  CyM.
La Clase 1 trabaja la distinción y la reducción operativa. La Clase 2 aborda la auto-referencia, la composición de procesos y un mini-proyecto aplicado con el modelo $I=\langle A,M,G,E,\Phi\rangle$.


## Clase 1 Distinguir marcar reducir de Laws of Form a grafos existenciales
- Objetivos
- Comprender la noción de trazar una distinción y la marca como operador
- Operar con las reglas de reducción *calling* y *crossing*
- Relacionar la escritura de Spencer-Brown con lógicas clásicas y los grafos existenciales de Peirce
- Conceptos clave
- Distinción marca espacio no marcado
- Reglas de *reducción* calling crossing
- Equivalencias con lógica proposicional $p\land q$ $p\lor q$ $\lnot p$ $p\Rightarrow q$ $\lnot(p\lor q)$ $p\leftrightarrow q$ $p\oplus q$
- Existential Graphs de Peirce como antecedente diagramático

### Secuencia didáctica 120 min
1. 0-10 Motivación por qué escribir con distinciones además de símbolos
2. 10-30 Marca y espacio ejercicios de lectura y borrado por calling
3. 30-55 Crossing y normalización reducción hasta forma canónica
4. 55-70 Puente con lógica proposicional traducir $p\Rightarrow q$ y $\lnot(p\lor q)$ a marcas y volver a símbolos
5. 70-90 Boundary Logic básica convenciones tipográficas y ejercicios de reescritura
6. 90-115 Peirce en 25 minutos regiones cortes negación por encerramiento comparación rápida con la marca
7. 115-120 Cierre y dudas

- Ejercicios en clase
- Reducir 6 formas dadas hasta su forma mínima justificando cada paso
- Traducir entre notación de marcas y fórmulas $p\leftrightarrow q$ y leyes de De Morgan
- Dibujar el mismo enunciado en grafos existenciales y con marca y comentar diferencias de lectura
- Tarea breve
- Hoja de 10 reducciones cronometradas
- mini mapa cómo expresar $p\oplus q$ con marcas y validarlo con tabla de verdad

## Clase 2 Auto referencia ensamblajes y procesos de Varela a cálculos de procesos
- Objetivos
- Introducir re entrada y cálculo para auto referencia a partir de Spencer-Brown y Varela
- Entender agencia distribuida como ensamblaje lógico material
- Conectar escrituras diagramáticas de procesos con $I=\langle A,M,G,E,\Phi\rangle$ y con exo fórmulas
- Conceptos clave
- Re entrada clausura operacional esquemas de Varela criterios de estabilidad
- Ensamblajes y agencia distribuida aplicados a instrumentos colectivos
- Reescritura de procesos composición alambres como tipos cajas como transformaciones
- Exo fórmulas como restricciones energéticas y de acoplamiento para componer atractores

###  Secuencia didáctica 120 min
1. 0-15 Repaso activo de la Clase 1 con dos reducciones en vivo
2. 15-40 Re entrada dibujar y leer bucles auto referenciales identificar condiciones de estabilidad
3. 40-65 Agencia distribuida con marcas modelar $A$ agentes acoplados condición de coordinación
4. 65-90 Cálculo diagramático de procesos composición equivalencia por reescritura
5. 90-110 Aplicación a exorganología modelar $I=\langle A,M,G,E,\Phi\rangle$ de un instrumento colectivo propio y extraer una exo fórmula mínima
6. 110-120 Presentaciones relámpago y retroalimentación

### Ejercicios en clase
- Dibujar una re entrada estable e inestable y explicar qué parámetros la vuelven estable
- Especificar con marcas la condición función colapsa si falta cualquier agente para un instrumento colectivo
- Bocetar un diagrama de proceso para voz→máscara→haptics→voz e identificar puntos de control
- Entregable final
- Lámina A4 con 1 diagrama con marcas del instrumento 2 traducción a procesos 3 exo fórmula de 3-5 cláusulas tipo fuentes sumideros umbrales acoplamientos 4 nota breve sobre estabilidad y controlabilidad.

## Materiales base sugeridos
- William Bricken Boundary Logic from the Beginning
- Louis H Kauffman Laws of Form exploraciones introductorias
- Francisco Varela A Calculus for Self Reference
- CS Peirce Existential Graphs tutoriales introductorios
- Sun Joo Shin The Logical Status of Diagrams fundamentos de validez diagramática
- Barwise y Etchemendy materiales de Hyperproof y visualización lógica para traducción simbólico diagramática
## Criterios de evaluación formativa
- Corrección de reducciones y traducciones entre escrituras
- Claridad del modelo del instrumento colectivo identificación de $A$ $M$ $G$ $E$ $\Phi$
- Exo fórmula con cláusulas operables y verificables
- Argumento breve sobre estabilidad sensibilidad y control del sistema propuesto
## Qué preparar antes de empezar
- Plantilla con 12 casillas para reducciones y una hoja de equivalencias básicas
- Lista de 6 enunciados lógicos relevantes a la práctica coordinación fallos redundancia
- Ejemplo propio de instrumento o boceto performativo para la parte aplicada de la Clase 2



# formas de escritura
## ASCII puro
- Marca: usa corchetes. Escribe [A] para “A marcado”.
- Concatenación: escribe X Y pegado como XY (dos expresiones adyacentes).
- Estado no marcado: como no existe un símbolo ASCII “vacío”, usaremos 0 para mostrar el resultado “en blanco”.
- Axiomas
- Calling: [][] → []
- Crossing: [[A]] → A
- Casos base
- [[]] → 0
- [][][A] → [][A] → [A]
- Ejemplos de reducción
- [[ [A] ]] → [A] → (no se reduce más sin contexto)
- [A][A] → [A]  (calling)
- [[ [ ] ]] se escribe como [[[]]] y reduce en dos pasos: [[[]]] → [0] → [0]  (si 0 se trata como un átomo)
- Re-entrada
- X = [X]  (ecuación de re-entrada; su “valor” no se estabiliza en 0 o en una marca única)

## LaTeX mínimo
- Convención simple: representar la marca con \boxed{•}. Para el “vacío” usamos \varnothing.
- Pega este preámbulo o macros en tu documento (o en un bloque de configuración de Obsidian)

\[
\newcommand{\lof}[1]{\boxed{#1}}%
\newcommand{\blank}{\varnothing}%
\newcommand{\m}{\boxed{\ }}%
\]

- Axiomas en LaTeX
- Crossing:
$$\lof{\lof{A}}=A$$
- Calling (dos marcas vacías se contraen):
$$\m\ \m=\m$$
- Caso base de crossing sobre la marca vacía:
$$\lof{\m}=\blank$$

- Ejemplos de reducción en LaTeX
- Llamadas repetidas a un mismo término:
$$\lof{A}\,\lof{A}\Rightarrow\lof{A}$$
- Doble anidamiento:
$$\lof{\lof{A}}\Rightarrow A$$
- Re-entrada:
$$X=\lof{X}$$

## Notas prácticas
- ASCII
- Usa [] para anidar y escribe 0 cuando el resultado es “no marcado” para no perderlo visualmente en texto plano.
- Evita paréntesis u otros signos para no confundirlos con la marca; quédate solo con [] y concatenación.
- LaTeX
- \boxed{} es suficiente para docencia y apuntes rápidos. Si prefieres un trazo más “geométrico”, puedes sustituir \lof por \fbox o por un entorno TikZ, pero \boxed mantiene el flujo matemático.