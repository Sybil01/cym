
```dataview
list from "" where type = "llm" AND !startswith(file.name, "t-")
```




## parámetros 

params_million: cantidad de parámetros del modelo, expresada en millones (por ejemplo, 345M).

embedding_dim: dimensión del espacio vectorial donde se representan los tokens (por ejemplo, 768).

max_tokens: número máximo de tokens que el modelo puede procesar por entrada o salida.

architecture: tipo de arquitectura utilizada (por ejemplo, Transformer, RNN, etc.).

training_data: descripción del corpus utilizado para entrenar el modelo.

training_size: tamaño aproximado del corpus (en número de muestras o tokens).

pretraining_method: tipo de tarea de aprendizaje usada en el preentrenamiento (por ejemplo, causal LM).

fine_tuning: información sobre el ajuste fino posterior al preentrenamiento (dataset, método).
license: tipo de licencia del modelo (MIT, Apache, propietaria, etc.).

code_url: enlace al código fuente del modelo si está disponible.

use_cases: casos de uso recomendados o implementados (chatbots, resumen, código, etc.).

input_format: tipo de entrada que acepta el modelo (texto plano, JSON, etc.).

output_format: formato de salida del modelo (texto generado, tokens, logits, etc.).

tech_innovation: aportes técnicos distintivos del modelo frente a otros anteriores.

props_: conexiones relevantes con otros conceptos (datasets, arquitecturas, etc.).

tags: etiquetas generales que describen el modelo (por ejemplo, conversacional, multilingüe).


## types

type: llm

- autoregressive
- encoder-decoder
- decoder-only
- multilingual
- instruction-tuned
- dialogue
- retrieval-augmented
- code generation
- alignment-tuned
- vision-language
- speech-language
- open-domain
- domain-specific
- zero-shot
- few-shot
- fine-tuned
- foundation model
- multimodal
- distilled
- quantized
- compact / efficient
- synthetic-data-trained
- continual learning