"use client";

export type EventType =
  | "chapter_enter"
  | "chapter_dwell_ms"
  | "station_open"
  | "scroll_depth"
  | "cta_click"
  | "form_submit";

/**
 * Returns or generates a persistent anonymous session ID stored only in sessionStorage.
 * Strictly avoids PII.
 */
export function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return "server-session";

  let sid = sessionStorage.getItem("sonia_anon_sid");
  if (!sid) {
    sid =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("sonia_anon_sid", sid);
  }
  return sid;
}

/**
 * Sends an anonymous analytics event to /api/events.
 */
export async function trackEvent(
  event: EventType,
  payload: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;

  const sessionId = getAnonymousSessionId();

  try {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        event,
        payload,
      }),
      keepalive: true,
    }).catch(() => {
      // Non-blocking fail-safe
    });
  } catch {
    // Fail-safe
  }
}
