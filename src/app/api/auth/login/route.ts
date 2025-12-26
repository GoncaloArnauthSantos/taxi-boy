import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo, LogModule } from "@/lib/logger";
import { createSupabaseServerClient } from "@/supabase/server";

/**
 * POST /api/auth/login
 *
 * Authenticate admin user with email and password.
 *
 * @param request - Next.js request object
 * @param request.body - JSON body with email and password
 * @param {string} request.body.email - Admin email
 * @param {string} request.body.password - Admin password
 *
 * @returns {Promise<NextResponse>} Response with success or error
 * @returns {number} status - HTTP status code
 *   - 200: Login successful
 *   - 400: Invalid request body
 *   - 401: Invalid credentials
 *   - 500: Server error
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logError({
        message: "Login failed",
        error,
        context: { email },
        module: LogModule.Auth,
      });
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    logInfo({
      message: "Admin login successful",
      context: { userId: data.user.id, email },
      module: LogModule.Auth,
    });

    return NextResponse.json(
      { message: "Login successful", user: data.user },
      { status: 200 }
    );
  } catch (error) {
    logError({
      message: "Error during login",
      error,
      module: LogModule.Auth,
    });

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process login" },
      { status: 500 }
    );
  }
};

