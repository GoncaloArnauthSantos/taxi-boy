import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { logError, LogModule } from "./lib/logger";

/**
 * Global middleware to protect /admin routes using Supabase Auth.
 *
 * Rules:
 * - /admin/login
 *   - no session   -> can access
 *   - with session -> redirect to /admin
 * - /admin/* (all other admin routes)
 *   - no session   -> redirect to /admin/login
 *   - with session -> allow access
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    logError({
      message: "Supabase env vars missing",
      error: new Error("Supabase env vars missing"),
      context: { hasUrl: !!supabaseUrl, hasKey: !!supabaseAnonKey },
      module: LogModule.App,
    });
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // /admin/login
  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  // Any other /admin/* route
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  // All other routes are not affected
  return response;
}

// Only run middleware for /admin/* routes
export const config = {
  matcher: [
    "/admin/:path*",
    // Match all /admin routes including /admin itself
    "/admin",
  ],
};
