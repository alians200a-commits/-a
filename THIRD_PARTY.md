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

## 0.6 mini-game reference review

- https://github.com/fraenze-st/Memory-Game/blob/master/app.js — inspected pair selection and delayed mismatch concealment as a conceptual reference. No license file was found in the inspected tree; no source code or images from it are included. The new `MemoryRound` implementation explicitly rejects selecting the same card twice, locks a mismatch until concealment, and tracks distinct pairs.
- https://github.com/bradtraversy/vanillawebprojects/tree/master/memory-cards — inspected the flashcard reveal interaction and 3D front/back presentation. Used as an interaction reference only; the implementation and artwork here are original, with no imported CSS or JavaScript from that repository.
- Existing licensed Anime.js, canvas-confetti, and adapted Kitkit tracing remain the actual third-party runtime code. See their sections above.

## 0.6 scene assets and teaching sources

Five newly generated independent illustrations: house interior, sharing sweets, playing at a goal, handing grandfather a cane, and observing a campfire with a parent. They reuse the established two child character designs. `scenes.js` maps each source word to its own image, including نار in the completion exercise. The original gazelle scene remains only for غزال and the home illustration.

`game-core.js`, `games.js` and `play.css` implement original picture/word matching, picture-to-word memory, letter catching, and a workbook coloring activity. The matching and memory use the five reading words; catching uses the exact six-letter row from reading p.12. Coloring uses ملك، مال، هدى، هادي from the uploaded activity book p.5 activity 2. UI instructions and reward copy are new; no claim that the game mechanics appear verbatim in the books.

Optional synthesized success chimes use Web Audio, disabled by default. These are interface sounds, not pronunciation recordings or narration.
