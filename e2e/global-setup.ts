import { createClient } from "@supabase/supabase-js";
import type { FullConfig } from "@playwright/test";
import { loadEnvConfig } from "@next/env";
import {
  assertTestTableName,
  DEFAULT_E2E_BOOKINGS_TABLE_NAME,
} from "../src/lib/bookings/table-name";

async function globalSetup(_config: FullConfig): Promise<void> {
  // Playwright global setup does not auto-load .env.local like Next.js runtime.
  loadEnvConfig(process.cwd());

  const tableName =
    process.env.E2E_BOOKINGS_TABLE_NAME || DEFAULT_E2E_BOOKINGS_TABLE_NAME;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminEmail = process.env.E2E_ADMIN_EMAIL;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;

  assertTestTableName(
    tableName,
    "Refusing E2E cleanup for non-test table"
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for E2E cleanup."
    );
  }
  if (!adminEmail || !adminPassword) {
    throw new Error(
      "E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD are required for E2E cleanup."
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (signInError) {
    throw new Error(`E2E cleanup login failed: ${signInError.message}`);
  }

  const { error: cleanupError } = await supabase
    .from(tableName)
    .delete()
    .not("id", "is", null);

  if (cleanupError) {
    throw new Error(`E2E cleanup failed: ${cleanupError.message}`);
  }
}

export default globalSetup;
