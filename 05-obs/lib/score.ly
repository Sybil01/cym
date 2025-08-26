\version "2.24.0"
\header { title = "Escala de Do Mayor (JS→LilyPond→SVG)" }
\paper {
  tagline = ##f
  paper-width  = #(* 20 cm)
  paper-height = #(* 5 cm)
  system-count = #1
}
\score {
  \relative c' {
    \clef bass
    \key c \major
    \time 4/4
    \tempo 4 = 80
    cis d e f | g a b c
  }
  \layout { }
}