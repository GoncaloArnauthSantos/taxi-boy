/**
 * Supabase Client for Client Components
 *
 * Creates a Supabase client for client-side operations (Client Components).
 * This client runs in the browser and handles both:
 * - Database operations (queries, inserts, updates, etc.)
 * - Authentication operations (login, logout, session management)
 *
 * Use this in Client Components that need to interact with Supabase.
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * Create Supabase client for client-side operations
 * Use this in Client Components ("use client")
 */
export const createSupabaseClient = () => {
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

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

