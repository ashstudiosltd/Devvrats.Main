import { supabaseConfigured } from "./config";
import { createBrowserClient } from "@supabase/ssr";
export function createClient() {
  if (!supabaseConfigured()) throw new Error("Configure the Supabase project root URL and publishable key. Secret keys must never be used in browser configuration.");
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookieOptions: {
        ...(process.env.NODE_ENV === "production"
          ? {
              domain: ".devvrats.in",
            }
          : {}),
      },
    }
  );
}