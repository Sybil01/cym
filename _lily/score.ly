\version "2.24.0"

\header { title = "Escala de Do Mayor (JS → LilyPond → SVG)" }
\score {
  \relative c' {
    \clef treble
    \key c \major
    \time 4/4
    \tempo 4 = 96
    c d e f | g a b c
  }
  \layout { }
}
