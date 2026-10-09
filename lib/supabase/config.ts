function publicKey(key: string) {
  if (key.startsWith("sb_publishable_")) return true;
  try { return JSON.parse(atob(key.split(".")[1])).role === "anon"; } catch { return false; }
}
export function supabaseConfigured() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && (parsed.pathname === "/" || parsed.pathname === "") && publicKey(key);
  } catch { return false; }
}
