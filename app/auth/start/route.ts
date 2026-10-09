import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { authReturn } from "@/lib/auth-return";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = authReturn(url.searchParams.get("next"), url.origin);
  const provider = url.searchParams.get("provider");
  const retry = new URL("/registration", url.origin);
  retry.searchParams.set("next", next);
  retry.searchParams.set("error", "auth");
  if (!supabaseConfigured() || (provider !== "google" && provider !== "github")) return NextResponse.redirect(retry);
  const store = await cookies();
  // Bind this login attempt to its originating site, independently of provider redirects.
  store.set("devvrats-auth-return", next, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/auth", maxAge: 600 });
  const callback = new URL("/auth/callback", url.origin);
  const client = await createClient();
  const { data, error } = await client.auth.signInWithOAuth({ provider, options: { redirectTo: callback.href, skipBrowserRedirect: true } });
  return NextResponse.redirect(!error && data.url ? data.url : retry);
}
