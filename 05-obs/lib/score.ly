\version "2.24.0"
\paper {
  tagline = ##f
  paper-width  = #(* 20 cm)
  paper-height = #(* 5 cm)
  system-count = #1
}
\score {
  {
    \clef treble
    \key c \major
    \cadenzaOn
    c'4 d''2. | b'8
    \cadenzaOff
  }
  \layout { }
}