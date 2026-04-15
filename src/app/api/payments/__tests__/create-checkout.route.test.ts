import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../create-checkout/route";
import { createMockBooking } from "@/app/api/bookings/__tests__/helpers";
import { BookingPaymentStatus } from "@/domain/booking";

vi.mock("@/app/api/bookings/store", () => ({
  getBookingById: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripeClient: vi.fn(),
}));

vi.mock("@/cms/tours/api", () => ({
  getTourByID: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  LogModule: {
    Payment: "Payment",
  },
}));

import { getBookingById } from "@/app/api/bookings/store";
import { getStripeClient } from "@/lib/stripe";
import { getTourByID } from "@/cms/tours/api";

const makeRequest = (body: Record<string, unknown>) =>
  new NextRequest("http://localhost:3000/api/payments/create-checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });

describe("POST /api/payments/create-checkout", () => {
  const createCheckoutSession = vi.fn();
  const mockStripe = {
    checkout: {
      sessions: {
        create: createCheckoutSession,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getStripeClient).mockReturnValue(mockStripe as never);
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await POST(makeRequest({}));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Missing required field");
    expect(getBookingById).not.toHaveBeenCalled();
  });

  it("returns 404 when booking does not exist", async () => {
    vi.mocked(getBookingById).mockResolvedValue(null);

    const response = await POST(
      makeRequest({
        bookingId: "booking-123",
      })
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Booking not found");
  });

  it("returns 404 when booking tour does not exist", async () => {
    vi.mocked(getBookingById).mockResolvedValue(createMockBooking());
    vi.mocked(getTourByID).mockResolvedValue(null);

    const response = await POST(
      makeRequest({
        bookingId: "booking-123",
      })
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Tour not found");
  });

  it("returns 400 when booking is already paid", async () => {
    vi.mocked(getBookingById).mockResolvedValue(
      createMockBooking({ paymentStatus: BookingPaymentStatus.PAID })
    );
    vi.mocked(getTourByID).mockResolvedValue({
      id: "tour-123",
      title: "Lisbon Tour",
    } as never);

    const response = await POST(
      makeRequest({
        bookingId: "booking-123",
      })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Booking already paid");
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });

  it("creates checkout session and returns Stripe URL", async () => {
    vi.mocked(getBookingById).mockResolvedValue(
      createMockBooking({
        id: "booking-123",
        tourId: "tour-123",
        clientEmail: "john@example.com",
        price: 99.99,
      })
    );
    vi.mocked(getTourByID).mockResolvedValue({
      id: "tour-123",
      title: "Lisbon Tour",
    } as never);
    createCheckoutSession.mockResolvedValue({
      url: "https://checkout.stripe.com/test-session",
    });

    const response = await POST(
      makeRequest({
        bookingId: "booking-123",
      })
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toBe("https://checkout.stripe.com/test-session");
    expect(createCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: "john@example.com",
        success_url:
          "http://localhost:3000/checkout/booking-123/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/booking?error=cancelled",
        metadata: {
          bookingId: "booking-123",
        },
      })
    );
    expect(createCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 9999,
            }),
          }),
        ],
      })
    );
  });

  it("returns 500 when Stripe does not return a URL", async () => {
    vi.mocked(getBookingById).mockResolvedValue(createMockBooking());
    vi.mocked(getTourByID).mockResolvedValue({
      id: "tour-123",
      title: "Lisbon Tour",
    } as never);
    createCheckoutSession.mockResolvedValue({ url: null });

    const response = await POST(
      makeRequest({
        bookingId: "booking-123",
      })
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to create checkout session");
  });
});
