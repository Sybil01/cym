
## carátula.tex

```latex
\begin{titlepage}
  \newgeometry{top=3cm, bottom=3cm, left=3cm, right=3cm} % Opcional: Cambia los márgenes solo en la carátula
    \thispagestyle{empty} % Sin numeración en la carátula

    \begin{center}
    
        % Espacio superior
        \vspace*{2cm}

        % Logo UNTREF
        \includesvg[width=4cm]{UNTREF_Logo_2016}

        % Nombre de la Universidad
        \vspace{1cm}
        {\large \textbf{\universidad}}\\
        {\large \carrera}\\
        {\large \catedra}

        % Espacio antes del título
        \vspace{3cm}

        % Título de la tesis
            {\LARGE \textbf{\tituloDocumento}}

        
        % Espacio antes del subtítulo
        \vspace{2cm}
        
        {\large \subtitulo}

        % Espacio antes del autor
        \vspace{2cm}

        % Nombre del autor
        {\Large \textbf{\autor}}

        % Espacio antes del director y consejero
        \vspace{2cm}

        % Director y consejero
        {\large \textbf{Profesor:} Luciano Azzigotti}\\
        {\large \textbf{Ayudante:} Carolina Di Paola}

        % Espacio antes de la fecha
        \vfill

        % Ubicación y fecha
        {\large Caseros, Provincia de Buenos Aires}\\
        {\large \today}

    \end{center}
\restoregeometry % Restaurar márgenes originales
\end{titlepage}
```


## main.tex

```latex
\documentclass[spanish]{report}

% -------------------------
% PAQUETES GENERALES
% -------------------------
\usepackage[utf8]{inputenc}       % Codificación UTF-8
\usepackage[spanish]{babel}       % Configuración del idioma en español
\usepackage{graphicx, tikz, amsmath, amssymb, xcolor, fancyhdr, svg, geometry, hyperref, csquotes} 
\renewcommand{\familydefault}{\sfdefault} % Fuente sans-serif por defecto
\usepackage{listings}
\usepackage{color}
\renewcommand{\lstlistingname}{Resultado}

% colores más suaves para el resaltado
\definecolor{blue}{HTML}{0C429F}
\definecolor{dkgreen}{HTML}{009681}
\definecolor{gray}{HTML}{CCCCCC}
\definecolor{mauve}{HTML}{4327C2}

\lstset{frame=tb,
  language=R,
  aboveskip=8mm,
  belowskip=8mm,
  captionpos=b,
  showstringspaces=false,
  columns=flexible,
  basicstyle={\scriptsize\ttfamily},
  numbers=left,
  numberstyle=\tiny\ttfamily\color{gray},
  keywordstyle=\color{blue},
  commentstyle=\color{dkgreen},
  stringstyle=\color{mauve},
  breaklines=true,
  breakatwhitespace=true,
  tabsize=5
}

% -------------------------
% CONFIGURACIÓN DE FECHA Y HORA
% -------------------------
\usepackage{datetime2} 
\DTMsetdatestyle{ddmmyyyy} % Formato de fecha dd-mm-yyyy
\newcommand{\fechaHoy}{\DTMdisplaydate{\year}{\month}{\day}{-1}} % Generar fecha en español

% -------------------------
% CONFIGURACIÓN DE FORMATO Y MÁRGENES
% -------------------------
\setlength{\headheight}{19.7pt}  % Asegurar espacio suficiente para fancyhdr
\addtolength{\topmargin}{-7.7pt} % Ajuste del margen superior para compensar el header
\usepackage{float}                % Mejor control de figuras flotantes
\setlength{\intextsep}{80pt}       % Espaciado global entre figuras y texto
\newcommand{\headervshift}{0cm} % Ajuste vertical del logo
\newcommand{\headersep}{4cm} % Espaciado entre header y texto
\newcommand{\sectionsep}{1cm} % Espaciado entre secciones


% -------------------------
% CONFIGURACIÓN DEL HEADER
% -------------------------
\pagestyle{fancy}
\fancyhf{}

% Página número a la izquierda antes del logo
\lhead{\thepage \quad \vspace{-5pt}\includesvg[width=1cm]{UNTREF_Logo_2016}}

% Autor, año, título y cátedra a la derecha
\rhead{\textit{\apellidos \quad \annoActual \quad \tituloDocumento \quad \abreviaturaCatedra}}

\renewcommand{\headrulewidth}{0.0pt} % Sin línea en header

% Define colors
\definecolor{indigo}{rgb}{0.29, 0.0, 0.51}


% -------------------------
% VARIABLES PRINCIPALES
% -------------------------
\newcommand{\tituloDocumento}{Paradigmas operativos}
\newcommand{\subtitulo}{Noción de paradigma operativo como estructura lógica-metodológica que articula intuición y razón en la creación artística con base científica y algorítmica}
\newcommand{\autor}{Nombre apellido}
\newcommand{\apellidos}{Apellido}
\newcommand{\catedra}{Ciencia y música}
\newcommand{\carrera}{Licenciatura en Música}
\newcommand{\universidad}{UNIVERSIDAD NACIONAL DE TRES DE FEBRERO}

\newcommand{\abreviaturaCatedra}{cym}
\newcommand{\annoActual}{\the\year} % Año actual

% -------------------------
% CONFIGURACIÓN DE CITAS Y BIBLIOGRAFÍA (APA)
% -------------------------
\usepackage[
    backend=biber,
    style=apa,
    urldate=long,
    maxcitenames=3,
    maxbibnames=99,
    backref=false,
    language=spanish
]{biblatex}

\DeclareLanguageMapping{spanish}{spanish-apa}

% Personalización de la bibliografía en APA
\AtEveryBibitem{%
    \clearfield{month}   % Eliminar mes
    \clearfield{issn}    % Eliminar ISSN
    \clearfield{doi}     % Opcionalmente eliminar DOI
}

% Modificar formato de las citas
\DeclareFieldFormat{titlecase}{\MakeSentenceCase{#1}}
\DeclareFieldFormat{postnote}{#1}  % Evita agregar "p." en páginas
\renewcommand*{\mkbibnamefamily}[1]{\textbf{#1}} % Apellidos en negrita

% Agregar archivo de bibliografía
\addbibresource{ref.bib}

% -------------------------
% CONFIGURACIÓN DE HIPERVÍNCULOS
% -------------------------
\hypersetup{
    colorlinks=true,     % Habilitar colores en enlaces
    linkcolor=black,     % Color negro para enlaces internos
    citecolor=blue,      % Color azul para citas
    filecolor=black,     
    urlcolor=black,      
    pdfborder={0 0 0}    % Quitar bordes en hipervínculos
}

% -------------------------
% INFORMACIÓN DEL DOCUMENTO
% -------------------------
\title{\tituloDocumento}
\author{\autor}
\date{\fechaHoy}



% -------------------------
% DOCUMENTO PRINCIPAL
% -------------------------
\begin{document}

\input{caratula}
% \maketitle

% -------------------------
% TITULO EN PRIMERA PÁGINA
% -------------------------
\begin{center}
    {\Large \tituloDocumento}\\[0.5cm]
    {\large \autor}\\[0.3cm]
    {\small \fechaHoy}\\[1cm]
    {\large \universidad}\\
    {\large \carrera}\\
    {\large \catedra}\end{center}
    
\vspace*{2cm}
\thispagestyle{empty} % Sin header en portada

\pagestyle{fancy} % Aplicar header en el resto del documento

% -------------------------
% SECCIONES
% -------------------------


\section{Introducción - Paradigma operativo}
\vspace{\sectionsep}
Introducción (incluye la literatura revisada o estado del arte)

\subsection{Obras referenciales y/o estado del arte}
\vspace{\sectionsep}
Identificar en obras referenciales qué paradigma operativo subyace. \parencite{sadin2018}.

\begin{figure} [H]
\centering
\includegraphics[scale=0.7]{ikeda.png}
\caption{Ryoji Ikeda}
\label{blackhole}
\end{figure}


\section{Metodología}
\vspace{\sectionsep}
Matriz elegida

\begin{equation}
P = \Phi(D_m, S_a)
\end{equation}

traducir a una fórmula lógica, matemática o de diagrama de flujo:
- $P$ es el primer prototipo,
- $D_m$ es el diseño mecánico,
- $S_a$ la simulación acústica.

\begin{lstlisting}[language=JavaScript, caption=Un ejemplo de código JavaScript, label=lst:js_example]
function saludar(nombre) {
    console.log("¡Hola, " + nombre + "!");
}

saludar("Mundo");
\end{lstlisting}

Aquí se define la operación matricial del paradigma


% -------------------------
% GRÁFICO EN TIKZ
% -------------------------
\begin{figure}[htbp]
\centering
\begin{tikzpicture}[grow=right, sibling distance=3cm, level distance=2cm,
    every node/.style={rectangle, rounded corners, draw, align=center, text width=3.5cm},
    level 1/.style={sibling distance=4cm},
    level 2/.style={sibling distance=3cm},
    level 3/.style={sibling distance=2cm}]

  \node[fill=red!50] {Idea Inicial}
    child { node[fill=orange!50] {Diseño} 
      child { node[fill=yellow!30] {Prototipo} }
      child { node[fill=green!30] {Optimización} }
    }
    child { node[fill=blue!30] {Relaciones} 
      child { node[fill=indigo!30] {Aceptación} }
      child { node[fill=violet!30] {Trascendencia} }
    };

\end{tikzpicture}
\caption{Ejemplo gráfico 1}
\end{figure}

\section{Demostración}
\vspace{\sectionsep}
Diseñar una micro-obra en 7 días partiendo de un único paradigma operativo elegido

\section{Conclusiones, crítica, refutación}
\vspace{\sectionsep}
Reflexiones


% -------------------------
% BIBLIOGRAFÍA
% -------------------------
\printbibliography 

\end{document}
```


## ref.bib

```bibtex
@book{sadin2018,
  author    = {Éric Sadin},
  title     = {La humanidad aumentada: La administración digital del mundo},
  year      = {2018},
  publisher = {Caja Negra}
}
```

