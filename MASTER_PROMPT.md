You are building a one-page 3D "career journey" site for Sonia S. (founder
profile), for a developer challenge at i-SmokeStack. Do NOT write code until
I approve PLAN.md.

HARD RULES
- Every fact on screen comes from sonia.json. Never invent facts, metrics,
  quotes or ages. Show a YEAR counter (1999 → 2026), never an age.
- The profile text "$X million to $5X million" is placeholder text. Don't use it.
- Not a template, not a résumé, not a normal website. Keep it simple, don't
  over-engineer.

EXPERIENCE
Visitor scrolls; a low-poly character walks one continuous path through 3D
chapters: School → College → B-schools → Corporate → Entrepreneur →
Global leadership → Fractional CMO era. Sky/palette shifts by era (warm dawn
→ daylight → cool corporate → neon cyan-to-lime gradient at the end). Each
chapter adds one block to a growing tower in the background; the path ends
at the i-SmokeStack tower ("Do More by Doing Less"). Tap/hover a landmark
to open a short card (role, place, years, note). Final scene: contact form.

TECH
Next.js + react-three-fiber + drei + GSAP. Build the character and landmarks
from primitives (no external assets). Deploy on Vercel. Supabase for storage.

BACKEND + ANALYTICS
- POST /api/contact: validate, honeypot + rate limit, store, optional email.
- POST /api/events: anonymous session id, no PII. Track chapter_enter,
  chapter_dwell_ms, station_open, scroll_depth, cta_click, form_submit.
- /admin (password via env var): visitors, chapter drop-off funnel, most
  opened stations, messages.

QUALITY
Responsive (lighter scene + touch scroll on mobile), prefers-reduced-motion,
and a plain 2D fallback list if WebGL is unavailable.

PROCESS
Plan first. Then one slice at a time: (1) world+walk+3 chapters, deploy;
(2) cards+year ticker; (3) contact+analytics; (4) polish. After each slice
run it in the browser at desktop and mobile widths and fix issues. Commit
after each slice. Append decisions to AI_LOG.md.