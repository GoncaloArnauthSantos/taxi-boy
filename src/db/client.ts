/**
 * Supabase Database Client
 *
 * Creates and configures the Supabase client for database operations.
 * This client should only be used in Server Components or API routes.
 */

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const createClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "SUPABASE_URL environment variable is required. " +
      "Please set it in your .env.local file."
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "SUPABASE_ANON_KEY environment variable is required. " +
      "Please set it in your .env.local file."
    );
  }

  const client = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  return client;
};

