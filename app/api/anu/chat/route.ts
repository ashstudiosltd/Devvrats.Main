import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;
const visits = new Map<string, { count: number; reset: number }>();
function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  // Local development works with Anu's existing dev server. Production must be configured.
  const base = process.env.ANU_API_URL || (process.env.NODE_ENV === "development" ? "http://127.0.0.1:5173" : "");
  if (!base) return json({ error: "Anu is temporarily unavailable. Please try again later." }, 503);
  const now = Date.now();
  for (const [key, visit] of visits) if (visit.reset <= now) visits.delete(key);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const visit = visits.get(ip) || { count: 0, reset: now + 600_000 };
  if (visit.count >= 20 || (!visits.has(ip) && visits.size >= 10_000)) return json({ error: "Please give Anu a little rest and try again in a few minutes." }, 429);
  visit.count++; visits.set(ip, visit);
  try {
    if (Number(request.headers.get("content-length") || 0) > 40_000) return json({ error: "Please send a shorter message." }, 413);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 40_000) return json({ error: "Please send a shorter message." }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return json({ error: "Please enter a message." }, 400); }
    if (!body || typeof body.message !== "string" || !body.message.trim() || body.message.length > 1000) return json({ error: "Please keep your message under 1,000 characters." }, 400);
    if (!Array.isArray(body.history) || body.history.length > 14 || body.history.some((item: { role?: unknown; text?: unknown } | null) => !item || !["user", "assistant"].includes(String(item.role)) || typeof item.text !== "string" || item.text.length > 4000)) return json({ error: "This preview conversation is full. Start a new chat to continue." }, 400);
    const response = await fetch(new URL("/api/integrations/main/chat", base), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.ANU_INTEGRATION_SECRET ? { "x-anu-integration-key": process.env.ANU_INTEGRATION_SECRET } : {}) },
      body: JSON.stringify({ message: body.message.trim(), history: body.history }),
      signal: AbortSignal.timeout(50_000),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) return json({ error: typeof data.error === "string" ? data.error : "Anu couldn't reply. Please try again." }, response.status);
    if (typeof data.reply !== "string" || !data.reply.trim()) return json({ error: "Anu couldn't reply. Please try again." }, 502);
    return json({ reply: data.reply });
  } catch {
    return json({ error: "Anu couldn't connect just now. Please try again in a moment." }, 502);
  }
}
