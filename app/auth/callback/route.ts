import { cookies } from "next/headers";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { authReturn } from "@/lib/auth-return";
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const store = await cookies();
  const next = authReturn(store.get("devvrats-auth-return")?.value || searchParams.get("next"), origin);
  store.set("devvrats-auth-return", "", { path: "/auth", maxAge: 0, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  const retry = new URL("/registration", origin);
  retry.searchParams.set("next", next);
  retry.searchParams.set("error", "auth");
  const code = searchParams.get("code");
  if (!code || !supabaseConfigured()) return NextResponse.redirect(retry);
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(error ? retry : next);
}
