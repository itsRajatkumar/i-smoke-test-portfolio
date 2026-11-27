import { NextRequest, NextResponse } from "next/server";
import { getAdminData } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!password || password !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { contacts, events } = await getAdminData();

    // 1. Unique visitors (distinct session_id)
    const uniqueSessionIds = new Set(events.map((e) => e.session_id));
    const totalVisitors = uniqueSessionIds.size;

    // 2. Chapter drop-off funnel
    const chapterOrder = [
      "School",
      "College",
      "B-schools",
      "Corporate",
      "Entrepreneur",
      "Global leadership",
      "Fractional CMO era",
    ];

    const chapterEnterSessions: Record<string, Set<string>> = {};
    chapterOrder.forEach((ch) => {
      chapterEnterSessions[ch] = new Set();
    });

    events.forEach((e) => {
      if (e.event === "chapter_enter" && e.payload?.chapter) {
        const ch = String(e.payload.chapter);
        if (chapterEnterSessions[ch]) {
          chapterEnterSessions[ch].add(e.session_id);
        }
      }
    });

    const funnel = chapterOrder.map((name) => ({
      chapter: name,
      visitors: chapterEnterSessions[name]?.size || 0,
    }));

    // 3. Most opened stations
    const stationCounts: Record<string, number> = {};
    events.forEach((e) => {
      if (e.event === "station_open" && e.payload?.station) {
        const stName = String(e.payload.station);
        stationCounts[stName] = (stationCounts[stName] || 0) + 1;
      }
    });

    const mostOpenedStations = Object.entries(stationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 4. Scroll depth distribution
    const scrollDepths: Record<string, number> = {
      "25%": 0,
      "50%": 0,
      "75%": 0,
      "100%": 0,
    };
    events.forEach((e) => {
      if (e.event === "scroll_depth" && e.payload?.depth) {
        const d = String(e.payload.depth);
        if (scrollDepths[d] !== undefined) {
          scrollDepths[d] += 1;
        }
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalVisitors,
        totalEvents: events.length,
        totalContacts: contacts.length,
        funnel,
        mostOpenedStations,
        scrollDepths,
      },
      contacts,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
