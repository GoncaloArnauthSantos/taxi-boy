/**
 * Supabase Client for Server Components and API Routes
 *
 * Creates a Supabase client for server-side operations (Server Components, API routes).
 * This client uses @supabase/ssr which is the recommended approach for Next.js.
 *
 * This single client handles both:
 * - Database operations (queries, inserts, updates, etc.)
 * - Authentication operations (login, logout, session management)
 *
 * The client automatically manages cookies, which is essential for authentication
 * and also allows you to access the current user's session in database queries
 * (useful for Row-Level Security policies).
 */

import { logError, LogModule } from "@/lib/logger";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Validate and get Supabase environment variables
 * Shared validation logic for all Supabase clients
 */
const getSupabaseEnv = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL environment variable is required. " +
        "Please set it in your .env.local file."
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required. " +
        "Please set it in your .env.local file."
    );
  }

  return { supabaseUrl, supabaseAnonKey };
};

/**
 * Create Supabase client for server-side operations (default)
 * Use this for most server-side operations (API routes, Server Components with dynamic rendering)
 * This client uses cookies, so it can access the current user's session
 * 
 * Use this for:
 * - Most database operations (create, read, update, delete)
 * - Admin authentication (login, logout, session verification)
 * - Operations that may need user context in the future
 * 
 * Note: This forces dynamic rendering. For static generation, use createSupabaseServerPublicClient
 */
export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          logError({
            message: "Error setting cookies",
            error,
            context: { cookiesToSet },
            module: LogModule.Database,
          });
        }
      },
    },
  });
};

/**
 * @deprecated Use createSupabaseServerClient instead
 * Kept for backward compatibility
 */
export const createSupabaseServerPrivateClient = createSupabaseServerClient;

/**
 * Create Supabase client for public server-side operations
 * Use this for operations that don't need user session/cookies (e.g., public bookings, tours)
 * This client doesn't use cookies, so it can be used in static pages during build
 * 
 * Use this for:
 * - Public data fetching (bookings, tours, etc.)
 * - Operations that don't require authentication
 * - Server Components that need static generation
 */
export const createSupabaseServerPublicClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  // Use createClient from @supabase/supabase-js (no cookies, no SSR)
  // This allows static generation during build
  return createClient(supabaseUrl, supabaseAnonKey);
};

