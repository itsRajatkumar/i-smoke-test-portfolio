# PLAN — Sonia's 3D Career Journey

## 1. Data model (sonia.json → chapters)

Seven chapters in scroll order, each with a palette and sky tone:

| # | Chapter | Years | Sky / Palette | Stations |
|---|---------|-------|---------------|----------|
| 1 | **School** | 1999 – 2002 | warm dawn (peach-orange) | Ryan International, Vidya Mandir |
| 2 | **College** | 2002 – 2006 | soft morning gold | MDU |
| 3 | **B-schools** | 2007 – 2009 | late morning amber | IIM-B, Symbiosis |
| 4 | **Corporate** | 2006 – 2013 | daylight (clear blue-white) | Bosch, FARO, Creaform |
| 5 | **Entrepreneur** | 2013 – 2015 | afternoon warm | Own venture, ShowMeLeads, Appirio, Sonia Specialist, Brand Tadkaa |
| 6 | **Global leadership** | 2016 – 2020 | cool corporate (slate-indigo) | Lasersec, RoundGlass |
| 7 | **Fractional CMO era** | 2020 – present | neon cyan → lime gradient | i-SmokeStack, Datt Medi, Lasersec (VP PM), AYU Inc, AYU Life, Celestial AI |

> **Overlap note:** B-schools overlap with Bosch (2007-08). Sort order on the path follows `start` year; a chapter gate fires when the first station of that chapter scrolls in.

---

## 2. Scene layout (top → bottom)

```
                        ┌──────────────────────┐
                        │  Sky gradient sphere  │
                        └──────────────────────┘
                              │
           ┌──────── growing tower (1 block / chapter) ────────┐
           │  stacks upward in BG as visitor scrolls           │
           └───────────────────────────────────────────────────┘
                              │
     ─── winding path (ExtrudeGeometry from a CatmullRom curve) ───
           │        │        │       │       │       │       │
        School   College  B-schl  Corp    Entrep  Global  Fract.
         ▲                                                   ▲
      path start                                       i-SmokeStack tower
                                                   "Do More by Doing Less"
                                                        + contact form
```

- **Character:** low-poly humanoid from primitives (box torso, sphere head, cylinder limbs). Walks along the path; position driven by scroll progress via GSAP `ScrollTrigger`.
- **Landmarks:** one per station — a small primitive cluster (e.g., cube "building" with a signboard mesh showing `station.name`). Tap/hover → card overlay.
- **Tower:** starts as 1 block at chapter 1, adds a stacked block per chapter entered; visible in BG.
- **i-SmokeStack tower** at the path end: taller, cyan-lime lit, with tagline text.

---

## 3. UI layers

| Layer | What | Tech |
|-------|------|------|
| 3D canvas | path, character, landmarks, tower, sky | `<Canvas>` via r3f + drei `Sky`, `OrbitControls` (disabled in scroll mode) |
| HUD overlay | year counter (1999 → 2026), chapter title, Sonia's headline | HTML `position:fixed` div, animated by GSAP |
| Info card | role, place, years, note — from `sonia.json` | Drei `Html` or a React portal; click-outside / ESC to close |
| Contact form | final scene | Regular React form inside an `Html` drei element or a fullscreen section below the canvas |
| 2D fallback | plain list of chapters & stations | Rendered when `<canvas>` fails (WebGL detect via `drei`'s `useDetectGPU` or a manual check) |

---

## 4. Year counter logic

- Map total scroll range → 1999 … 2026.
- Display as a large top-left counter; tween with GSAP `snap`.
- Never show an age — only the year.

---

## 5. Palette transitions

- Each chapter stores `{ bg, fog, ambient, accent }` colours.
- On `chapter_enter`, GSAP tweens `scene.background`, `scene.fog.color`, ambient-light colour, and the sky component's `sunPosition` / gradient.
- Final chapter ramps to the cyan-to-lime gradient.

---

## 6. Responsive & accessibility

| Concern | Approach |
|---------|----------|
| **Mobile** | Fewer geometry segments, no shadows, touch-scroll drives the same ScrollTrigger; landmarks are larger hit-targets |
| **prefers-reduced-motion** | Disable character walk animation, instant palette jumps, still allow scroll |
| **No WebGL** | Detect on mount → render `<FallbackList>` (a plain styled list of chapters, each expandable to show its stations) |

---

## 7. Backend routes (Next.js API routes)

### `POST /api/contact`
- Fields: name, email, message.
- Honeypot hidden field → reject if filled.
- Rate limit: 5 req / IP / 15 min (in-memory map, fine for Vercel serverless cold starts).
- Store row in Supabase `contacts` table.
- Optional: send email via Resend / Supabase Edge Function (stretch — only if time).

### `POST /api/events`
- Body: `{ session_id, event, payload }`.
- `session_id` = random UUID stored in sessionStorage (not a cookie, no PII).
- Events: `chapter_enter`, `chapter_dwell_ms`, `station_open`, `scroll_depth`, `cta_click`, `form_submit`.
- Insert into Supabase `events` table.

### `GET /admin` (page, password-gated)
- Env var `ADMIN_PASSWORD`; simple server-side check or middleware.
- Dashboards (server-rendered or light client charts):
  - Unique visitors (count distinct `session_id` per day).
  - Chapter drop-off funnel.
  - Most-opened stations (bar chart).
  - Contact messages list.

---

## 8. Tech stack & key deps

```
next            (app router)
react
@react-three/fiber
@react-three/drei
three
gsap  +  @gsap/react  +  ScrollTrigger
@supabase/supabase-js
tailwindcss     (utility styling for overlays & fallback)
```

No external 3D model files — everything from Three.js primitives.

---

## 9. File / folder sketch

```
app/
  layout.tsx          – fonts, metadata, global CSS
  page.tsx            – 3D scene or fallback
  admin/
    page.tsx          – password-gated dashboard
  api/
    contact/route.ts
    events/route.ts
components/
  Scene.tsx           – r3f Canvas, sky, lighting
  Path.tsx            – CatmullRom path + ground
  Character.tsx       – low-poly walker
  Landmark.tsx        – per-station primitive
  Tower.tsx           – growing chapter tower
  ISmokeStackTower.tsx
  InfoCard.tsx        – station detail overlay
  YearCounter.tsx     – HUD year display
  ContactForm.tsx
  FallbackList.tsx    – 2D accessible list
lib/
  chapters.ts         – import sonia.json, group by chapter, attach palettes
  supabase.ts         – client init
  rateLimit.ts
public/
  sonia.json          – data source (copied here so it's fetchable)
```

---

## 10. Build slices (per MASTER_PROMPT process)

### Slice 1 — World + walk + first 3 chapters
- Scaffold Next.js project, install deps.
- Build `Scene`, `Path`, `Character`; wire scroll → character position.
- Render School, College, B-schools landmarks.
- Sky palette transitions for those 3 eras.
- Growing tower (3 blocks).
- Deploy to Vercel.

### Slice 2 — All chapters + cards + year ticker
- Add remaining 4 chapters with landmarks.
- `InfoCard` on tap/hover.
- `YearCounter` HUD.
- i-SmokeStack tower at path end.
- Mobile responsive pass.
- 2D fallback.

### Slice 3 — Contact + analytics
- `ContactForm` in final scene.
- `/api/contact` with honeypot + rate limit + Supabase insert.
- `/api/events` + client-side event emitter.
- `/admin` page.

### Slice 4 — Polish
- `prefers-reduced-motion` behaviour.
- Performance profiling (draw calls, mobile GPU).
- Final palette tuning.
- README.

After each slice: browser test at desktop & mobile widths, fix, commit, append to `AI_LOG.md`.

---

## Resolved decisions

1. **Supabase** — schema provided in `supabase-schema.sql`; user will provision.
2. **Vercel** — new project.
3. **Contact email** — Supabase-only (no email sending).
4. **Domain / branding** — no custom domain.
5. **"Sonia Specialist"** — appears once, in the Entrepreneur chapter.

---

*Plan approved. Building slice by slice.*
