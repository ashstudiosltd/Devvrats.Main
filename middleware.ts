import { supabaseConfigured } from "@/lib/supabase/config";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function middleware(request: NextRequest) {
  // The public Anu demo does not require a Supabase session.
  if (request.nextUrl.pathname === "/api/anu/chat") return NextResponse.next();
  if (!supabaseConfigured()) return NextResponse.next();
  let response = NextResponse.next({
    request,
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response = NextResponse.next({
              request,
            });
            response.cookies.set(name, value, {
              ...options,
              ...(process.env.NODE_ENV === "production"
                ? {
                    domain: ".devvrats.in",
                    secure: true,
                  }
                : {}),
            });
          });
        },
      },
    }
  );
  await supabase.auth.getUser();
  return response;
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};