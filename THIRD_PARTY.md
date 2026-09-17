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

## Anime.js 3.2.2 — actual UI runtime in 0.5

Source: https://github.com/juliangarnier/anime/tree/v3.2.2
Bundled unmodified `lib/anime.min.js` as `vendor/anime.min.js`. MIT notice is in `vendor/ANIME-LICENSE.txt`.
`motion.js` calls `anime.timeline` and `anime.stagger` for page entrances, sequential activity controls, and earned flower reveals. Timelines pause when changing views and reduced-motion bypasses animation. Characters remain still illustrations.
API example inspected: https://github.com/juliangarnier/anime/blob/v3.2.2/documentation/examples/timeline.html

## Learning-route interface reference — idea only

https://github.com/sanidhyy/duolingo-clone/blob/main/app/(main)/learn/lesson-button.tsx
Read the current/completed lesson node and circular progress implementation. The garden uses the general idea of a route with current and completed stations, with original HTML/CSS and four activity stations rather than the reference's React implementation. No code, branded characters, or assets from this repository were copied.

Other visual libraries inspected but NOT incorporated: Hover.css and Animate.css. No claim that these are dependencies or sources of the implemented animation code.

## World artwork

`assets/world.webp` is a newly generated, text-free garden illustration, created from the approved visual direction and encoded as WebP. All controls, labels, words, progress, and book surfaces are live HTML/CSS. The generated visual concept itself is not used as a clickable screenshot.
