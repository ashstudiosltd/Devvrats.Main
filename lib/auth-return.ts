// Only first-party destinations may receive the browser after OAuth.
export function authReturn(value: string | null, origin: string) {
  const allowed = new Set(["https://devvrats.in", "https://www.devvrats.in", "https://anu.devvrats.in", "https://sabha.devvrats.in"]);
  if (process.env.NODE_ENV !== "production") for (const port of [3000,3001,5173]) allowed.add(`http://localhost:${port}`);
  try {
    const target = new URL(value || "/", origin);
    if (target.username || target.password || !allowed.has(target.origin) || target.pathname.startsWith("/auth") || target.pathname.startsWith("/registration")) return new URL("/", origin).href;
    return target.href;
  } catch { return new URL("/", origin).href; }
}
