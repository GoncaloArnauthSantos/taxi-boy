import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../webhook/route";
import { createMockBooking } from "@/app/api/bookings/__tests__/helpers";
import {
  BookingPaymentMethod,
  BookingPaymentStatus,
  BookingStatus,
} from "@/domain/booking";

vi.mock("@/lib/stripe", () => ({
  getStripeClient: vi.fn(),
  getStripeWebhookSecret: vi.fn(),
}));

vi.mock("@/app/api/bookings/store", () => ({
  getBookingById: vi.fn(),
  updateBooking: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  LogModule: {
    Payment: "Payment",
  },
}));

import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";
import { getBookingById, updateBooking } from "@/app/api/bookings/store";

const makeRequest = (signature?: string) =>
  new NextRequest("http://localhost:3000/api/payments/webhook", {
    method: "POST",
    body: JSON.stringify({ any: "payload" }),
    headers: signature ? { "stripe-signature": signature } : {},
  });

describe("POST /api/payments/webhook", () => {
  const constructEvent = vi.fn();
  const mockStripe = {
    webhooks: {
      constructEvent,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getStripeClient).mockReturnValue(mockStripe as never);
    vi.mocked(getStripeWebhookSecret).mockReturnValue("whsec_test");
  });

  it("returns 400 when signature is missing", async () => {
    const response = await POST(makeRequest());
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing stripe-signature header");
    expect(constructEvent).not.toHaveBeenCalled();
  });

  it("returns 400 when signature is invalid", async () => {
    constructEvent.mockImplementation(() => {
      throw new Error("bad signature");
    });

    const response = await POST(makeRequest("sig_test"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid webhook signature");
  });

  it("marks booking as paid for checkout.session.completed", async () => {
    constructEvent.mockReturnValue({
      id: "evt_1",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_1",
          payment_intent: "pi_123",
          metadata: { bookingId: "booking-123" },
        },
      },
    });
    vi.mocked(getBookingById).mockResolvedValue(createMockBooking({ id: "booking-123" }));

    const response = await POST(makeRequest("sig_test"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(updateBooking).toHaveBeenCalledWith(
      "booking-123",
      expect.objectContaining({
        paymentStatus: BookingPaymentStatus.PAID,
        paymentMethod: BookingPaymentMethod.CARD,
        status: BookingStatus.CONFIRMED,
        stripeSessionId: "cs_test_1",
        stripePaymentIntentId: "pi_123",
      })
    );
  });

  it("ignores duplicated completed event by session id", async () => {
    constructEvent.mockReturnValue({
      id: "evt_dup",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_dup_1",
          payment_intent: "pi_dup",
          metadata: { bookingId: "booking-123" },
        },
      },
    });
    vi.mocked(getBookingById).mockResolvedValue(
      createMockBooking({ id: "booking-123", stripeSessionId: "cs_dup_1" })
    );

    const response = await POST(makeRequest("sig_test"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(updateBooking).not.toHaveBeenCalled();
  });

  it("marks booking as failed for async failure event", async () => {
    constructEvent.mockReturnValue({
      id: "evt_fail_1",
      type: "checkout.session.async_payment_failed",
      data: {
        object: {
          id: "cs_fail_1",
          payment_intent: "pi_fail_1",
          metadata: { bookingId: "booking-123" },
        },
      },
    });

    vi.mocked(getBookingById).mockResolvedValue(
      createMockBooking({ id: "booking-123", paymentStatus: BookingPaymentStatus.PENDING })
    );

    const response = await POST(makeRequest("sig_test"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(updateBooking).toHaveBeenCalledWith(
      "booking-123",
      expect.objectContaining({
        paymentStatus: BookingPaymentStatus.FAILED,
        paymentMethod: BookingPaymentMethod.CARD,
        stripeSessionId: "cs_fail_1",
        stripePaymentIntentId: "pi_fail_1",
      })
    );
  });

  it("does not downgrade paid booking on failure event", async () => {
    constructEvent.mockReturnValue({
      id: "evt_fail_paid",
      type: "checkout.session.async_payment_failed",
      data: {
        object: {
          id: "cs_paid_1",
          payment_intent: "pi_paid_1",
          metadata: { bookingId: "booking-123" },
        },
      },
    });
    vi.mocked(getBookingById).mockResolvedValue(
      createMockBooking({
        id: "booking-123",
        paymentStatus: BookingPaymentStatus.PAID,
        stripeSessionId: "cs_old_paid",
      })
    );

    const response = await POST(makeRequest("sig_test"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(updateBooking).not.toHaveBeenCalled();
  });
});

