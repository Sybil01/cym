

$$% Versión concentrada en el núcleo operativo
\begin{equation}
\ent{
\mat_{input} \threshold_{\tau} \mat_{output}^{binario} \branch \itf_{visual} \itf \agn_{humano}
}_f
\end{equation}$$

    A[Obj: Datos<br/>Archivo digital] --> B[Branch: Descomposición]
    B --> C[Itf: ADC<br/>Conversión Analógico-Digital]
    C --> D[Proceso de Umbral]
    
    subgraph D [Núcleo del Paradigma]
        E[Mat: Señal Analógica] --> F[Thresholdτ: Operación de Umbral]
        F --> G[Mat: Bit Binario<br/>0/1, Negro/Blanco]
    end
    
    D --> H[Itf: DAC<br/>Conversión Digital-Analógico]
    H --> I[Branch: Recomposición]
    I --> J[Obj: Pantalla<br/>Superficie de visualización]
    J --> K[Itf: Percepción]
    K --> L[Agn: Perceptor<br/>Ser humano]
    
    M[Ent: Entorno físico] -.-> A
    M -.-> D
    M -.-> L
