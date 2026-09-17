# Third-party code and fonts

## Kitkit School — tracing locator

Actual adapted code: `vendor/kitkit-trace-locator.js`, called by `trace.js` during pointer movement.

Original: Copyright (c) 2016 Enuma, Inc. All rights reserved.
Based on todomathandroid_kh and Todomath iOS (Locomotive Labs).

Source: https://github.com/XPRIZE/GLEXP-Team-KitkitSchool/blob/6ed6b76d17fd7560abc35dcdf7cf4a44ce70745e/mainapp/Classes/Common/Controls/TraceField/Utils/TraceLocator.cpp

Function: `TraceLocator::bestIndexByFinger`.
License: Apache-2.0, included in `vendor/KITKIT-LICENSE.txt`.

Modifications, September 17 2026: ported C++ bounded nearest-point search to JavaScript and flat SVG samples; scaled lookahead and tolerance to the lesson coordinates; uses turn angle rather than absolute heading in the search budget; removed automatic tail skipping. This improves handling of sparse pointer events while rejecting end jumps. This is a motor practice aid, not a handwriting grading system. The visible tracing demonstration is original application code.

## canvas-confetti 1.9.3

Source: https://github.com/catdad/canvas-confetti
Actual use: correct answers and completed tracing trigger `celebrate()`.
License: ISC, included in `CONFETTI-LICENSE.txt`.
Reduced-motion preference is respected.

## Fonts

- Cairo: https://github.com/google/fonts/tree/main/ofl/cairo — OFL, included in `assets/fonts/Cairo-OFL.txt`.
- Noto Naskh Arabic Bold: reused from the previous supplied application font assets; OFL, included in `assets/fonts/NotoNaskh-OFL.txt`.
- Lalezar: https://github.com/google/fonts/tree/main/ofl/lalezar — OFL, included in `assets/fonts/Lalezar-OFL.txt`.

WOFF versions are locally bundled. Lalezar is a temporary available display-font alternative; it is not Tufuli, Balabiloo, or Samka. Those requested fonts are not included. No claim is made that the illustrated characters come from Kitkit or the other reference repositories.
