import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/supabase/server";
import { logInfo, LogModule } from "@/lib/logger";

/**
 * POST /api/auth/logout
 *
 * Log out the current admin user.
 *
 * @param request - Next.js request object
 *
 * @returns {Promise<NextResponse>} Response with success message
 * @returns {number} status - HTTP status code (200 on success)
 */
export const POST = async (_request: NextRequest): Promise<NextResponse> => {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.auth.signOut();

    if (user) {
      logInfo({
        message: "Admin logout successful",
        context: { userId: user.id },
        module: LogModule.Auth,
      });
    }

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch {
    // Even if there's an error, try to clear the session
    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  }
};

