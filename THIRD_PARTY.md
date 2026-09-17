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
- Lalezar: https://github.com/google/fonts/tree/main/ofl/lalezar — OFL, included in `assets/fonts/Lalezar-OFL.txt`.

WOFF versions are locally bundled. Lalezar is a temporary available display-font alternative; it is not Tufuli, Balabiloo, or Samka. Those requested fonts are not included. No claim is made that the illustrated characters come from Kitkit or the other reference repositories.

## User-supplied interaction reference

Source: https://github.com/alians200a-commits/mudarrisi-reading-app/blob/959c514abb5ee8beae1ceea292eae5b4f82cf64a/app/unit1_fx.js

The user explicitly requested reference/reuse from this repository. `motion.js` adapts radial spark distribution and pointer-normalized card tilt. It replaces optional GSAP with native Web Animations, avoids global MutationObservers and illustration parallax, only emits spark particles on correct answers, and adds a correct-letter flight into the collection slot. Motion respects reduced-motion preference. Other referenced files inspected: unit1_fx.css, fish_catch_fx_v3.js, ba_flow_polish.js. No fish-game code or curriculum was imported.

Version 0.4 loads exactly two custom fonts: Lalezar for h1/h2 and Cairo everywhere else. Noto Naskh was removed from the shipped files at the user's request.
