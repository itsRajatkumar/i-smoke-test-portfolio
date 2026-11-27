# AI_LOG

## Slice 1 — World + walk + 3 chapters

**Date:** 2026-11-27

### Decisions

- **Scroll driver:** GSAP ScrollTrigger (not drei `ScrollControls`) so the
  scroll state is easily shared between the DOM layer (year counter, cards —
  coming in Slice 2) and the R3F render loop via a plain mutable
  `scrollState` object.
- **Canvas pointer events:** set to `none` for Slice 1 (no 3D interaction
  yet). Will enable in Slice 2 for landmark tap/hover cards.
- **Path geometry:** `CatmullRomCurve3` with 18 control points spanning
  x = −40 → 78, winding in the XZ plane at y ≈ 0. Character stays on the
  ground.
- **Character:** built from primitives — sphere head, box torso, cylinder
  limbs. Walk cycle driven by scroll-delta.
- **Tower:** placed at (20, 0, −22); blocks stack upward, one per chapter
  entered (all 7 chapters active even though only 3 have landmarks so far).
- **Palette transitions:** full 7-chapter colour shifts active from Slice 1
  (warm dawn → daylight → cool corporate → neon cyan-lime).
- **"Sonia Specialist"** appears once, in the Entrepreneur chapter.
- **sonia.json** imported as a TypeScript module (bundled by webpack), not
  fetched at runtime from `public/`.
