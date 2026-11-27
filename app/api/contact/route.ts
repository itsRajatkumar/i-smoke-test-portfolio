import { NextRequest, NextResponse } from "next/server";
import { insertContact } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rateLimit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    // 1. Rate limiting (5 requests per 15 mins per IP)
    const { allowed } = checkRateLimit(`contact_${ip}`, 5, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name, email, message, company_website } = body;

    // 2. Honeypot check (bots fill hidden field)
    if (company_website) {
      // Return 200 to silently discard bot submissions
      return NextResponse.json({ success: true });
    }

    // 3. Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid name." },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Message must be at least 5 characters long." },
        { status: 400 },
      );
    }

    // 4. Insert into Supabase
    const result = await insertContact(
      name.trim(),
      email.trim().toLowerCase(),
      message.trim(),
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to submit message." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
