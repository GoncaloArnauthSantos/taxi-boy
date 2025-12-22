/**
 * Authentication helpers for API routes
 * 
 * Provides utilities to check authentication status in API routes.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/supabase/server";
import { logError } from "@/cms/shared/logger";

/**
 * Check if the current request has a valid admin session
 * 
 * @returns Object with session status and user info, or null if not authenticated
 */
export const getAdminSession = async () => {
  try {
    const supabase = await createSupabaseServerClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    return {
      session,
      user: session.user,
    };
  } catch (error) {
    logError("Error getting admin session", error);
    return null;
  }
};

/**
 * Require authentication for an API route
 * Returns 401 Unauthorized if no valid session is found
 * 
 * @param request - Next.js request object
 * @returns NextResponse with 401 error if not authenticated, or null if authenticated
 */
export const requireAuth = async (
  _request: NextRequest
): Promise<NextResponse | null> => {
  const auth = await getAdminSession();

  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication required." },
      { status: 401 }
    );
  }

  return null;
};

