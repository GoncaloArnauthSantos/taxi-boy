/**
 * Integration Tests for /api/auth/login route
 * 
 * Tests POST endpoint with mocked Supabase authentication.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../route";

// Mock dependencies
vi.mock("@/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  LogModule: {
    Auth: "Auth",
  },
}));

import { createSupabaseServerClient } from "@/supabase/server";
import { logError, logInfo } from "@/lib/logger";

describe("POST /api/auth/login", () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createSupabaseServerClient).mockResolvedValue(
      mockSupabase as unknown as Awaited<ReturnType<typeof createSupabaseServerClient>>
    );
  });

  it("should login successfully with valid credentials", async () => {
    const mockUser = {
      id: "user-123",
      email: "admin@example.com",
      created_at: "2024-01-01T00:00:00.000Z",
    };

    const mockSession = {
      user: mockUser,
      access_token: "token-123",
    };

    vi.mocked(mockSupabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: mockUser,
        session: mockSession,
      },
      error: null,
    });

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@example.com",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Login successful");
    expect(data.user).toEqual(mockUser);
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "password123",
    });
    expect(logInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Admin login successful",
        context: expect.objectContaining({
          userId: "user-123",
          email: "admin@example.com",
        }),
      })
    );
  });

  it("should return 400 when email is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email and password are required");
    expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("should return 400 when password is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@example.com",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email and password are required");
    expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("should return 400 when both email and password are missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email and password are required");
    expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("should return 401 when credentials are invalid", async () => {
    const mockError = {
      message: "Invalid login credentials",
      status: 400,
    };

    vi.mocked(mockSupabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: null,
        session: null,
      },
      error: mockError,
    });

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@example.com",
        password: "wrongpassword",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid email or password");
    expect(logError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Login failed",
        error: mockError,
        context: expect.objectContaining({
          email: "admin@example.com",
        }),
      })
    );
  });

  it("should return 400 when JSON is invalid", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: "invalid json",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid JSON in request body");
    expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("should return 500 on unexpected error", async () => {
    vi.mocked(createSupabaseServerClient).mockRejectedValue(
      new Error("Database connection failed")
    );

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@example.com",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to process login");
    expect(logError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error during login",
      })
    );
  });

});

