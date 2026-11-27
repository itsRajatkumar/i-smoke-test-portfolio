# Sonia S. — 3D Career Journey

A 3D interactive, one-page career journey site for **Sonia S.** (founder profile), created for the developer challenge at **i-SmokeStack**.

---

## 🌟 Overview & Architecture

- **Low-Poly 3D World (No External Assets):** The world, landmarks, foliage, towers, and character are crafted entirely from Three.js primitives (`boxGeometry`, `cylinderGeometry`, `sphereGeometry`, `coneGeometry`, `torusGeometry`).
- **Female Character in Indian Attire:** Custom sculpted female protagonist in traditional Indian attire (royal teal silk kurta, gold zari embroidery, draped crimson dupatta with dynamic gait sway physics, cream churidar, embroidered juttis, jhumka earrings, and bindi).
- **Dynamic Era Palettes:** Continuous sky, fog, and ambient light transitions across 7 life chapters:
  1. **School (1999–2002):** Warm dawn (peach-orange)
  2. **College (2002–2006):** Morning gold
  3. **B-schools (2007–2009):** Late morning amber
  4. **Corporate (2006–2013):** Clear daylight blue
  5. **Entrepreneur (2013–2015):** Warm afternoon terracotta
  6. **Global Leadership (2016–2020):** Cool corporate slate
  7. **Fractional CMO Era (2020–present):** Neon cyan-to-lime gradient
- **Growing Chapter Tower:** Background monolithic tower that stacks blocks upward as the visitor progresses through each life chapter.
- **i-SmokeStack Monument:** Terminal beacon standing tall at the end of the journey inscribed with the motto: *"Do More by Doing Less"*.
- **Interactive Station Cards:** Click or tap any landmark along the path to open station details (role, location, dates, verbatim historical notes from `sonia.json`).
- **Year Counter Ticker:** Smooth HUD ticker counting years (1999 → 2026) without displaying ages.
- **Contact Form:** Docked in the final scene with spam-trapping honeypot, sliding-window rate limiting, and Supabase integration.
- **Anonymous Analytics Engine:** Zero-PII analytics tracking chapter transitions, dwell times, station opens, scroll milestones, and form submissions.
- **Admin Dashboard (`/admin`):** Password-gated admin portal displaying real-time visitor stats, chapter drop-off funnels, most-inspected stations, and contact messages.
- **Accessibility & 2D Fallback:** Automatic WebGL detection routing to an accessible 2D view on unsupported devices, plus native `prefers-reduced-motion` support.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- pnpm (or npm / yarn)

### 2. Installation
```bash
pnpm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
# Supabase (Optional - in-memory fallback enabled by default)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Dashboard Password (defaults to admin123 if unset)
ADMIN_PASSWORD=your_secure_password
```

### 4. Running Locally
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the 3D career journey.
Visit [http://localhost:3000/admin](http://localhost:3000/admin) to view the analytics dashboard (password: `admin123` or your env var).

### 5. Building for Production
```bash
pnpm run build
pnpm run start
```

---

## 🗄️ Database Setup (Supabase)

If deploying with Supabase, run the SQL script provided in [supabase-schema.sql](file:///d:/P%20Projects/Test/I%20Smoke%20task/supabase-schema.sql) in your Supabase SQL Editor:
- Creates `contacts` table with RLS.
- Creates `events` table with RLS and indexed lookup columns.

---

## 🛡️ Adherence to Constraints
- **Zero invented metrics/facts:** All career data matches `sonia.json` verbatim.
- **Year counter only:** Years 1999 → 2026, never ages.
- **Zero external 3D files:** All meshes, characters, and landmarks built purely with Three.js code primitives.
- **Zero PII in analytics:** All sessions use anonymous UUIDs isolated to `sessionStorage`.
