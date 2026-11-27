"use client";

import { chapters } from "@/lib/chapters";

/**
 * Plain 2D list shown when WebGL is unavailable.
 * Shows every chapter and its stations in an accessible layout.
 */
export function FallbackList() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Sonia S. — Career Journey</h1>
      <p className="text-sm text-neutral-400 mb-8">
        Your browser does not support WebGL. Here is a plain view of the
        journey.
      </p>

      {chapters.map((ch) => (
        <section key={ch.name} className="mb-8">
          <h2
            className="text-xl font-semibold mb-3"
            style={{ color: ch.palette.accent }}
          >
            {ch.name}
          </h2>

          <ul className="space-y-3">
            {ch.stations.map((s) => (
              <li
                key={`${s.name}-${s.start}`}
                className="border border-white/10 rounded-lg p-4"
              >
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-neutral-300">{s.role}</p>
                <p className="text-xs text-neutral-500">
                  {s.start} – {s.end}
                  {s.place ? ` · ${s.place}` : ""}
                </p>
                {s.note && (
                  <p className="text-xs text-neutral-400 mt-1">{s.note}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
