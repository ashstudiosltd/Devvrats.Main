import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                ...(process.env.NODE_ENV === "production"
                  ? {
                      domain: ".devvrats.in",
                      secure: true,
                    }
                  : {}),
              });
            });
          } catch {
            // Called from a Server Component where cookies cannot be written.
          }
        },
      },
    }
  );
}