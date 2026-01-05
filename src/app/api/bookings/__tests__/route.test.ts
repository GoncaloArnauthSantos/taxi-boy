/**
 * Integration Tests for /api/bookings route
 * 
 * Tests GET and POST endpoints with mocked dependencies.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import { createMockBooking, createMockTour } from "./helpers";
import { createTestRequest, expectErrorResponse, expectSuccessResponse, expectValidationErrors } from "@/__tests__/helpers/test-utils";
import type { Booking } from "@/domain/booking";

// Mock dependencies
vi.mock("../store", () => ({
  createBooking: vi.fn(),
  getAllBookings: vi.fn(),
  isDateAvailable: vi.fn(),
}));

vi.mock("@/cms/tours", () => ({
  getTourByID: vi.fn(),
}));

vi.mock("@/email/send", () => ({
  sendBookingConfirmationEmails: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  LogModule: {
    API: "API",
    Database: "Database",
    Email: "Email",
  },
}));

import { createBooking, getAllBookings, isDateAvailable } from "../store";
import { getTourByID } from "@/cms/tours";
import { sendBookingConfirmationEmails } from "@/email/send";

describe("GET /api/bookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all bookings when no filters provided", async () => {
    const mockBookings: Booking[] = [
      createMockBooking({ id: "booking-1" }),
      createMockBooking({ id: "booking-2" }),
    ];

    vi.mocked(getAllBookings).mockResolvedValue(mockBookings);

    const request = createTestRequest("GET", "/api/bookings");
    const response = await GET(request);
    const data = await expectSuccessResponse(response, 200);

    expect(data).toEqual(mockBookings);
    expect(getAllBookings).toHaveBeenCalledWith({});
  });

  it("should filter bookings by status", async () => {
    const mockBookings: Booking[] = [
      createMockBooking({ id: "booking-1", status: "confirmed" }),
    ];

    vi.mocked(getAllBookings).mockResolvedValue(mockBookings);

    const request = createTestRequest("GET", "/api/bookings", {
      searchParams: { status: "confirmed" },
    });
    const response = await GET(request);
    const data = await expectSuccessResponse(response, 200);

    expect(data).toEqual(mockBookings);
    expect(getAllBookings).toHaveBeenCalledWith({ status: "confirmed" });
  });

  it("should filter bookings by paymentStatus", async () => {
    const mockBookings: Booking[] = [
      createMockBooking({ id: "booking-1", paymentStatus: "paid" }),
    ];

    vi.mocked(getAllBookings).mockResolvedValue(mockBookings);

    const request = createTestRequest("GET", "/api/bookings", {
      searchParams: { paymentStatus: "paid" },
    });
    const response = await GET(request);
    const data = await expectSuccessResponse(response, 200);

    expect(data).toEqual(mockBookings);
    expect(getAllBookings).toHaveBeenCalledWith({ paymentStatus: "paid" });
  });

  it("should filter bookings by future=true", async () => {
    const mockBookings: Booking[] = [
      createMockBooking({
        id: "booking-1",
        clientSelectedDate: new Date(Date.now() + 86400000).toISOString(),
      }),
    ];

    vi.mocked(getAllBookings).mockResolvedValue(mockBookings);

    const request = createTestRequest("GET", "/api/bookings", {
      searchParams: { future: "true" },
    });
    const response = await GET(request);
    const data = await expectSuccessResponse(response, 200);

    expect(data).toEqual(mockBookings);
    expect(getAllBookings).toHaveBeenCalledWith({ future: true });
  });

  it("should filter bookings by past=true", async () => {
    const mockBookings: Booking[] = [
      createMockBooking({
        id: "booking-1",
        clientSelectedDate: new Date(Date.now() - 86400000).toISOString(),
      }),
    ];

    vi.mocked(getAllBookings).mockResolvedValue(mockBookings);

    const request = createTestRequest("GET", "/api/bookings", {
      searchParams: { past: "true" },
    });
    const response = await GET(request);
    const data = await expectSuccessResponse(response, 200);

    expect(data).toEqual(mockBookings);
    expect(getAllBookings).toHaveBeenCalledWith({ past: true });
  });

  it("should return error when future=true and past=true (conflicting filters)", async () => {
    const request = createTestRequest("GET", "/api/bookings", {
      searchParams: { future: "true", past: "true" },
    });
    const response = await GET(request);
    await expectErrorResponse(response, 500, "Failed to fetch bookings");
  });

  it("should combine multiple filters", async () => {
    const mockBookings: Booking[] = [
      createMockBooking({
        id: "booking-1",
        status: "confirmed",
        paymentStatus: "paid",
      }),
    ];

    vi.mocked(getAllBookings).mockResolvedValue(mockBookings);

    const request = createTestRequest("GET", "/api/bookings", {
      searchParams: { status: "confirmed", paymentStatus: "paid", future: "true" },
    });
    const response = await GET(request);
    const data = await expectSuccessResponse(response, 200);

    expect(data).toEqual(mockBookings);
    expect(getAllBookings).toHaveBeenCalledWith({
      status: "confirmed",
      paymentStatus: "paid",
      future: true,
    });
  });

  it("should return 500 on database error", async () => {
    vi.mocked(getAllBookings).mockRejectedValue(new Error("Database error"));

    const request = createTestRequest("GET", "/api/bookings");
    const response = await GET(request);
    await expectErrorResponse(response, 500, "Failed to fetch bookings");
  });
});

describe("POST /api/bookings", () => {
  const validFormData = {
    name: "John Doe",
    email: "john@example.com",
    phonePhoneCountryCode: "+351",
    phoneNumber: "912345678",
    country: "Portugal",
    language: "English",
    tourId: "tour-123",
    date: new Date(Date.now() + 86400000), // Tomorrow
    message: "Test message",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create booking successfully", async () => {
    const mockTour = createMockTour({ id: "tour-123", price: 100 });
    const mockBooking = createMockBooking({ tourId: "tour-123" });

    vi.mocked(getTourByID).mockResolvedValue(mockTour);
    vi.mocked(isDateAvailable).mockResolvedValue(true);
    vi.mocked(createBooking).mockResolvedValue(mockBooking);

    const request = createTestRequest("POST", "/api/bookings", {
      body: validFormData,
    });

    const response = await POST(request);
    const data = await expectSuccessResponse(response, 201);

    expect(data).toEqual(mockBooking);
    expect(getTourByID).toHaveBeenCalledWith("tour-123");
    expect(isDateAvailable).toHaveBeenCalled();
    expect(createBooking).toHaveBeenCalled();
    expect(sendBookingConfirmationEmails).toHaveBeenCalledWith(
      mockBooking,
      mockTour
    );
  });

  it("should return 400 when validation fails", async () => {
    const invalidData = {
      name: "A", // Too short
      email: "invalid-email",
    };

    const request = createTestRequest("POST", "/api/bookings", {
      body: invalidData,
    });

    const response = await POST(request);
    const details = await expectValidationErrors(response);

    expect(Array.isArray(details)).toBe(true);
  });

  it("should return 400 when JSON is invalid", async () => {
    const request = new NextRequest("http://localhost:3000/api/bookings", {
      method: "POST",
      body: "invalid json",
    });

    const response = await POST(request);
    await expectErrorResponse(response, 400, "Invalid JSON in request body");
  });

  it("should return 404 when tour not found", async () => {
    vi.mocked(getTourByID).mockResolvedValue(null);

    const request = createTestRequest("POST", "/api/bookings", {
      body: validFormData,
    });

    const response = await POST(request);
    await expectErrorResponse(response, 404, "Tour not found");
    expect(createBooking).not.toHaveBeenCalled();
  });

  it("should return 409 when date is not available", async () => {
    const mockTour = createMockTour({ id: "tour-123" });

    vi.mocked(getTourByID).mockResolvedValue(mockTour);
    vi.mocked(isDateAvailable).mockResolvedValue(false);

    const request = createTestRequest("POST", "/api/bookings", {
      body: validFormData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("Selected date is not available");
    expect(data.details).toContain("already has a booking");
    expect(createBooking).not.toHaveBeenCalled();
  });

  it("should use tour price from CMS", async () => {
    const mockTour = createMockTour({ id: "tour-123", price: 150 });
    const mockBooking = createMockBooking({ price: 150 });

    vi.mocked(getTourByID).mockResolvedValue(mockTour);
    vi.mocked(isDateAvailable).mockResolvedValue(true);
    vi.mocked(createBooking).mockResolvedValue(mockBooking);

    const request = createTestRequest("POST", "/api/bookings", {
      body: validFormData,
    });

    const response = await POST(request);
    const data = await expectSuccessResponse(response, 201);

    expect(data.price).toBe(150);
    expect(createBooking).toHaveBeenCalledWith(
      expect.objectContaining({ price: 150 })
    );
  });

  it("should set default status and paymentStatus to pending", async () => {
    const mockTour = createMockTour({ id: "tour-123" });
    const mockBooking = createMockBooking({
      status: "pending",
      paymentStatus: "pending",
    });

    vi.mocked(getTourByID).mockResolvedValue(mockTour);
    vi.mocked(isDateAvailable).mockResolvedValue(true);
    vi.mocked(createBooking).mockResolvedValue(mockBooking);

    const request = createTestRequest("POST", "/api/bookings", {
      body: validFormData,
    });

    const response = await POST(request);
    const data = await expectSuccessResponse(response, 201);

    expect(data.status).toBe("pending");
    expect(data.paymentStatus).toBe("pending");
    expect(createBooking).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "pending",
        paymentStatus: "pending",
      })
    );
  });

  it("should handle date as ISO string", async () => {
    const mockTour = createMockTour({ id: "tour-123" });
    const mockBooking = createMockBooking();

    const formDataWithStringDate = {
      ...validFormData,
      date: new Date(Date.now() + 86400000).toISOString(),
    };

    vi.mocked(getTourByID).mockResolvedValue(mockTour);
    vi.mocked(isDateAvailable).mockResolvedValue(true);
    vi.mocked(createBooking).mockResolvedValue(mockBooking);

    const request = createTestRequest("POST", "/api/bookings", {
      body: formDataWithStringDate,
    });

    const response = await POST(request);
    await expectSuccessResponse(response, 201);
    expect(getTourByID).toHaveBeenCalled();
  });

  it("should not block response if email sending fails", async () => {
    const mockTour = createMockTour({ id: "tour-123" });
    const mockBooking = createMockBooking();

    vi.mocked(getTourByID).mockResolvedValue(mockTour);
    vi.mocked(isDateAvailable).mockResolvedValue(true);
    vi.mocked(createBooking).mockResolvedValue(mockBooking);
    vi.mocked(sendBookingConfirmationEmails).mockRejectedValue(
      new Error("Email failed")
    );

    const request = createTestRequest("POST", "/api/bookings", {
      body: validFormData,
    });

    const response = await POST(request);
    const data = await expectSuccessResponse(response, 201);

    // Should still return 201 even if email fails
    expect(data).toEqual(mockBooking);
  });

  it("should return 500 on unexpected error", async () => {
    vi.mocked(getTourByID).mockRejectedValue(new Error("Unexpected error"));

    const request = createTestRequest("POST", "/api/bookings", {
      body: validFormData,
    });

    const response = await POST(request);
    await expectErrorResponse(response, 500, "Failed to create booking");
  });
});

