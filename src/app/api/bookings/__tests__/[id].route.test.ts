/**
 * Integration Tests for /api/bookings/[id] route
 * 
 * Tests GET, PATCH, and DELETE endpoints with mocked dependencies.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { GET, PATCH, DELETE } from "../[id]/route";
import { createMockBooking } from "./helpers";
import { createTestRequest, expectErrorResponse, expectSuccessResponse, expectValidationErrors } from "@/__tests__/helpers/test-utils";
import { VALID_UUID } from "@/__tests__/helpers/constants";

// Mock dependencies
vi.mock("../store", () => ({
  getBookingById: vi.fn(),
  updateBooking: vi.fn(),
  deleteBooking: vi.fn(),
  isDateAvailable: vi.fn(),
}));

vi.mock("@/app/api/auth/helpers", () => ({
  requireAuth: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
  LogModule: {
    API: "API",
    Database: "Database",
  },
}));

import { getBookingById, updateBooking, deleteBooking, isDateAvailable } from "../store";
import { requireAuth } from "@/app/api/auth/helpers";

describe("GET /api/bookings/[id]", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return booking when found", async () => {
    const mockBooking = createMockBooking({ id: VALID_UUID });

    vi.mocked(getBookingById).mockResolvedValue(mockBooking);

    const request = createTestRequest("GET", `/api/bookings/${VALID_UUID}`);
    const response = await GET(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    const data = await expectSuccessResponse(response, 200);

    expect(data).toEqual(mockBooking);
    expect(getBookingById).toHaveBeenCalledWith(VALID_UUID);
  });

  it("should return 404 when booking not found", async () => {
    vi.mocked(getBookingById).mockResolvedValue(null);

    const request = createTestRequest("GET", `/api/bookings/${VALID_UUID}`);
    const response = await GET(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    await expectErrorResponse(response, 404, "Booking not found");
  });

  it("should return 400 when ID is not a valid UUID", async () => {
    const request = createTestRequest("GET", "/api/bookings/invalid-id");
    const response = await GET(request, {
      params: Promise.resolve({ id: "invalid-id" }),
    });
    await expectErrorResponse(response, 400, "Invalid booking ID format");
    expect(getBookingById).not.toHaveBeenCalled();
  });

  it("should return 500 on database error", async () => {
    vi.mocked(getBookingById).mockRejectedValue(new Error("Database error"));

    const request = createTestRequest("GET", `/api/bookings/${VALID_UUID}`);
    const response = await GET(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    await expectErrorResponse(response, 500, "Failed to fetch booking");
  });
});

describe("PATCH /api/bookings/[id]", () => {
  const mockBooking = createMockBooking({ id: VALID_UUID });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null); // Authenticated
  });

  it("should update booking successfully", async () => {
    const updatedBooking = createMockBooking({
      id: VALID_UUID,
      status: "confirmed",
      paymentStatus: "paid",
    });

    vi.mocked(getBookingById).mockResolvedValue(mockBooking);
    vi.mocked(updateBooking).mockResolvedValue(updatedBooking);

    const request = createTestRequest("PATCH", `/api/bookings/${VALID_UUID}`, {
      body: {
        status: "confirmed",
        paymentStatus: "paid",
      },
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    const data = await expectSuccessResponse(response, 200);

    expect(data).toEqual(updatedBooking);
    expect(updateBooking).toHaveBeenCalledWith(
      VALID_UUID,
      expect.objectContaining({
        status: "confirmed",
        paymentStatus: "paid",
      })
    );
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(requireAuth).mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );

    const request = createTestRequest("PATCH", `/api/bookings/${VALID_UUID}`, {
      body: { status: "confirmed" },
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });

    await expectErrorResponse(response, 401);
    expect(updateBooking).not.toHaveBeenCalled();
  });

  it("should return 400 when validation fails", async () => {
    vi.mocked(getBookingById).mockResolvedValue(mockBooking);

    const request = createTestRequest("PATCH", `/api/bookings/${VALID_UUID}`, {
      body: {
        status: "invalid-status", // Invalid status
      },
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    await expectValidationErrors(response);
    expect(updateBooking).not.toHaveBeenCalled();
  });

  it("should return 400 when ID is not a valid UUID", async () => {
    const request = createTestRequest("PATCH", "/api/bookings/invalid-id", {
      body: { status: "confirmed" },
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: "invalid-id" }),
    });
    await expectErrorResponse(response, 400, "Invalid booking ID format");
    expect(getBookingById).not.toHaveBeenCalled();
  });

  it("should return 404 when booking not found", async () => {
    vi.mocked(getBookingById).mockResolvedValue(null);

    const request = createTestRequest("PATCH", `/api/bookings/${VALID_UUID}`, {
      body: { status: "confirmed" },
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    await expectErrorResponse(response, 404, "Booking not found");
    expect(updateBooking).not.toHaveBeenCalled();
  });

  it("should return 409 when date is not available", async () => {
    const futureDate = new Date(Date.now() + 172800000).toISOString(); // Day after tomorrow

    vi.mocked(getBookingById).mockResolvedValue(mockBooking);
    vi.mocked(isDateAvailable).mockResolvedValue(false);

    const request = createTestRequest("PATCH", `/api/bookings/${VALID_UUID}`, {
      body: {
        clientSelectedDate: futureDate,
      },
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("Selected date is not available");
    expect(data.details).toContain("already has another booking");
    expect(updateBooking).not.toHaveBeenCalled();
  });

  it("should not check date availability if date is unchanged", async () => {
    const updatedBooking = createMockBooking({
      id: VALID_UUID,
      status: "confirmed",
    });

    vi.mocked(getBookingById).mockResolvedValue(mockBooking);
    vi.mocked(updateBooking).mockResolvedValue(updatedBooking);

    const request = createTestRequest("PATCH", `/api/bookings/${VALID_UUID}`, {
      body: {
        clientSelectedDate: mockBooking.clientSelectedDate, // Same date
        status: "confirmed",
      },
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });

    await expectSuccessResponse(response, 200);
    expect(isDateAvailable).not.toHaveBeenCalled();
  });

  it("should update multiple fields", async () => {
    const updatedBooking = createMockBooking({
      id: VALID_UUID,
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "card",
      price: 150,
    });

    vi.mocked(getBookingById).mockResolvedValue(mockBooking);
    vi.mocked(updateBooking).mockResolvedValue(updatedBooking);

    const request = createTestRequest("PATCH", `/api/bookings/${VALID_UUID}`, {
      body: {
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "card",
        price: 150,
      },
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    const data = await expectSuccessResponse(response, 200);

    expect(data.status).toBe("confirmed");
    expect(data.paymentStatus).toBe("paid");
    expect(data.paymentMethod).toBe("card");
    expect(data.price).toBe(150);
  });

  it("should return 400 when JSON is invalid", async () => {
    const request = new NextRequest("http://localhost:3000/api/bookings/" + VALID_UUID, {
      method: "PATCH",
      body: "invalid json",
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    await expectErrorResponse(response, 400, "Invalid JSON in request body");
  });

  it("should return 500 on unexpected error", async () => {
    vi.mocked(getBookingById).mockRejectedValue(new Error("Unexpected error"));

    const request = createTestRequest("PATCH", `/api/bookings/${VALID_UUID}`, {
      body: { status: "confirmed" },
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    await expectErrorResponse(response, 500, "Failed to update booking");
  });
});

describe("DELETE /api/bookings/[id]", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(null); // Authenticated
  });

  it("should delete booking successfully", async () => {
    vi.mocked(deleteBooking).mockResolvedValue(true);

    const request = createTestRequest("DELETE", `/api/bookings/${VALID_UUID}`);

    const response = await DELETE(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    const data = await expectSuccessResponse(response, 200);

    expect(data.message).toBe("Booking deleted successfully");
    expect(deleteBooking).toHaveBeenCalledWith(VALID_UUID);
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(requireAuth).mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );

    const request = createTestRequest("DELETE", `/api/bookings/${VALID_UUID}`);

    const response = await DELETE(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });

    await expectErrorResponse(response, 401);
    expect(deleteBooking).not.toHaveBeenCalled();
  });

  it("should return 404 when booking not found", async () => {
    vi.mocked(deleteBooking).mockResolvedValue(false);

    const request = createTestRequest("DELETE", `/api/bookings/${VALID_UUID}`);

    const response = await DELETE(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    await expectErrorResponse(response, 404, "Booking not found");
  });

  it("should return 400 when ID is not a valid UUID", async () => {
    const request = createTestRequest("DELETE", "/api/bookings/invalid-id");

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "invalid-id" }),
    });
    await expectErrorResponse(response, 400, "Invalid booking ID format");
    expect(deleteBooking).not.toHaveBeenCalled();
  });

  it("should return 500 on database error", async () => {
    vi.mocked(deleteBooking).mockRejectedValue(new Error("Database error"));

    const request = createTestRequest("DELETE", `/api/bookings/${VALID_UUID}`);

    const response = await DELETE(request, {
      params: Promise.resolve({ id: VALID_UUID }),
    });
    await expectErrorResponse(response, 500, "Failed to delete booking");
  });
});

