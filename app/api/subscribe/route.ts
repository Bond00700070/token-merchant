import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email(),
});

const RESEND_API = "https://api.resend.com";

export async function POST(req: Request) {
  let parsed;
  try {
    const json = await req.json();
    parsed = bodySchema.parse(json);
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid email" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  // If Resend is not configured, accept the subscription gracefully so the form
  // works in dev/preview. In production, configure both env vars.
  if (!apiKey || !audienceId) {
    return NextResponse.json({
      ok: true,
      message: "Subscribed (dev mode, no email provider configured).",
    });
  }

  const res = await fetch(`${RESEND_API}/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: parsed.email, unsubscribed: false }),
  });

  if (!res.ok && res.status !== 409) {
    const text = await res.text();
    return NextResponse.json(
      { ok: false, message: `Resend error: ${res.status} ${text}` },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
