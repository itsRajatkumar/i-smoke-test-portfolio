import { NextRequest, NextResponse } from "next/server";
import { insertEvent } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rateLimit";

const VALID_EVENTS = new Set([
  "chapter_enter",
  "chapter_dwell_ms",
  "station_open",
  "scroll_depth",
  "cta_click",
  "form_submit",
]);

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    // Rate limiting for events: 120 per minute per IP to prevent spam
    const { allowed } = checkRateLimit(`events_${ip}`, 120, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded." },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const { session_id, event, payload } = body;

    if (!session_id || typeof session_id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid session_id." },
        { status: 400 },
      );
    }

    if (!event || !VALID_EVENTS.has(event)) {
      return NextResponse.json(
        { error: "Invalid event type." },
        { status: 400 },
      );
    }

    await insertEvent(session_id, event, payload || {});
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
