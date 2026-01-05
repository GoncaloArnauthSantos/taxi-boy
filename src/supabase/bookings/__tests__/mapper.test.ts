import { describe, it, expect } from "vitest";
import {
  mapBookingToInsert,
  mapRowToBooking,
  mapBookingPatchToUpdate,
} from "../mapper";
import type { Booking } from "@/domain/booking";

describe("mapBookingToInsert", () => {
  const validBookingInput: Omit<Booking, "id" | "createdAt" | "updatedAt" | "deletedAt"> = {
    clientName: "John Doe",
    clientEmail: "john@example.com",
    clientPhone: "912345678",
    clientPhoneCountryCode: "+351",
    clientCountry: "Portugal",
    clientLanguage: "English",
    clientSelectedDate: "2024-12-25T10:00:00.000Z",
    clientMessage: "Test message",
    tourId: "tour-123",
    status: "pending",
    price: 100,
    paymentStatus: "pending",
    paymentMethod: null,
  };

  it("should map all fields from camelCase to snake_case", () => {
    const result = mapBookingToInsert(validBookingInput);

    expect(result.client_name).toBe("John Doe");
    expect(result.client_email).toBe("john@example.com");
    expect(result.client_phone).toBe("912345678");
    expect(result.client_phone_country_code).toBe("+351");
    expect(result.client_country).toBe("Portugal");
    expect(result.client_language).toBe("English");
    expect(result.client_selected_date).toBe("2024-12-25T10:00:00.000Z");
    expect(result.client_message).toBe("Test message");
    expect(result.tour_id).toBe("tour-123");
    expect(result.status).toBe("pending");
    expect(result.price).toBe(100);
    expect(result.payment_status).toBe("pending");
    expect(result.payment_method).toBeNull();
  });

  it("should handle null clientMessage", () => {
    const input = {
      ...validBookingInput,
      clientMessage: null,
    };

    const result = mapBookingToInsert(input);

    expect(result.client_message).toBeNull();
  });

  it("should handle different status values", () => {
    const statuses: Booking["status"][] = ["pending", "confirmed", "cancelled"];

    statuses.forEach((status) => {
      const input = { ...validBookingInput, status };
      const result = mapBookingToInsert(input);
      expect(result.status).toBe(status);
    });
  });

  it("should handle different payment status values", () => {
    const paymentStatuses: Booking["paymentStatus"][] = ["pending", "paid", "failed"];

    paymentStatuses.forEach((paymentStatus) => {
      const input = { ...validBookingInput, paymentStatus };
      const result = mapBookingToInsert(input);
      expect(result.payment_status).toBe(paymentStatus);
    });
  });

  it("should handle different payment method values", () => {
    const paymentMethods: Booking["paymentMethod"][] = ["bank_transfer", "card", "cash", null];

    paymentMethods.forEach((paymentMethod) => {
      const input = { ...validBookingInput, paymentMethod };
      const result = mapBookingToInsert(input);
      expect(result.payment_method).toBe(paymentMethod);
    });
  });

  it("should handle zero price", () => {
    const input = { ...validBookingInput, price: 0 };
    const result = mapBookingToInsert(input);

    expect(result.price).toBe(0);
  });

  it("should handle large price values", () => {
    const input = { ...validBookingInput, price: 9999.99 };
    const result = mapBookingToInsert(input);

    expect(result.price).toBe(9999.99);
  });
});

describe("mapRowToBooking", () => {
  const validBookingRow = {
    id: "booking-123",
    client_name: "John Doe",
    client_email: "john@example.com",
    client_phone: "912345678",
    client_phone_country_code: "+351",
    client_country: "Portugal",
    client_language: "English",
    client_selected_date: "2024-12-25T10:00:00.000Z",
    client_message: "Test message",
    tour_id: "tour-123",
    status: "pending",
    price: 100,
    payment_status: "pending",
    payment_method: null,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    deleted_at: null,
  };

  it("should map all fields from snake_case to camelCase", () => {
    const result = mapRowToBooking(validBookingRow);

    expect(result.id).toBe("booking-123");
    expect(result.clientName).toBe("John Doe");
    expect(result.clientEmail).toBe("john@example.com");
    expect(result.clientPhone).toBe("912345678");
    expect(result.clientPhoneCountryCode).toBe("+351");
    expect(result.clientCountry).toBe("Portugal");
    expect(result.clientLanguage).toBe("English");
    expect(result.clientSelectedDate).toBe("2024-12-25T10:00:00.000Z");
    expect(result.clientMessage).toBe("Test message");
    expect(result.tourId).toBe("tour-123");
    expect(result.status).toBe("pending");
    expect(result.price).toBe(100);
    expect(result.paymentStatus).toBe("pending");
    expect(result.paymentMethod).toBeNull();
    expect(result.createdAt).toBe("2024-01-01T00:00:00.000Z");
    expect(result.updatedAt).toBe("2024-01-01T00:00:00.000Z");
    expect(result.deletedAt).toBeNull();
  });

  it("should handle null clientMessage", () => {
    const row = {
      ...validBookingRow,
      client_message: null,
    };

    const result = mapRowToBooking(row);

    expect(result.clientMessage).toBeNull();
  });

  it("should handle null paymentMethod", () => {
    const row = {
      ...validBookingRow,
      payment_method: null,
    };

    const result = mapRowToBooking(row);

    expect(result.paymentMethod).toBeNull();
  });

  it("should handle non-null paymentMethod", () => {
    const row = {
      ...validBookingRow,
      payment_method: "card",
    };

    const result = mapRowToBooking(row);

    expect(result.paymentMethod).toBe("card");
  });

  it("should handle null deletedAt", () => {
    const row = {
      ...validBookingRow,
      deleted_at: null,
    };

    const result = mapRowToBooking(row);

    expect(result.deletedAt).toBeNull();
  });

  it("should handle non-null deletedAt (soft deleted)", () => {
    const row = {
      ...validBookingRow,
      deleted_at: "2024-01-02T00:00:00.000Z",
    };

    const result = mapRowToBooking(row);

    expect(result.deletedAt).toBe("2024-01-02T00:00:00.000Z");
  });

  it("should handle different status values", () => {
    const statuses = ["pending", "confirmed", "cancelled"];

    statuses.forEach((status) => {
      const row = { ...validBookingRow, status };
      const result = mapRowToBooking(row);
      expect(result.status).toBe(status);
    });
  });

  it("should handle different payment status values", () => {
    const paymentStatuses = ["pending", "paid", "failed"];

    paymentStatuses.forEach((paymentStatus) => {
      const row = { ...validBookingRow, payment_status: paymentStatus };
      const result = mapRowToBooking(row);
      expect(result.paymentStatus).toBe(paymentStatus);
    });
  });

  it("should handle different payment method values", () => {
    const paymentMethods = ["bank_transfer", "card", "cash"];

    paymentMethods.forEach((paymentMethod) => {
      const row = { ...validBookingRow, payment_method: paymentMethod };
      const result = mapRowToBooking(row);
      expect(result.paymentMethod).toBe(paymentMethod);
    });
  });
});

describe("mapBookingPatchToUpdate", () => {
  it("should include only provided fields", () => {
    const patch = {
      status: "confirmed" as const,
    };

    const result = mapBookingPatchToUpdate(patch);

    expect(result.status).toBe("confirmed");
    expect(result.client_name).toBeUndefined();
    expect(result.client_email).toBeUndefined();
    expect(Object.keys(result)).toHaveLength(1);
  });

  it("should handle multiple fields", () => {
    const patch = {
      status: "confirmed" as const,
      paymentStatus: "paid" as const,
      paymentMethod: "card" as const,
      price: 150,
    };

    const result = mapBookingPatchToUpdate(patch);

    expect(result.status).toBe("confirmed");
    expect(result.payment_status).toBe("paid");
    expect(result.payment_method).toBe("card");
    expect(result.price).toBe(150);
    expect(Object.keys(result)).toHaveLength(4);
  });

  it("should map all fields correctly when all provided", () => {
    const patch: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt" | "deletedAt">> = {
      clientName: "Jane Doe",
      clientEmail: "jane@example.com",
      clientPhone: "987654321",
      clientPhoneCountryCode: "+351",
      clientCountry: "Spain",
      clientLanguage: "Spanish",
      clientSelectedDate: "2024-12-26T10:00:00.000Z",
      clientMessage: "Updated message",
      tourId: "tour-456",
      status: "confirmed",
      price: 200,
      paymentStatus: "paid",
      paymentMethod: "card",
    };

    const result = mapBookingPatchToUpdate(patch);

    expect(result.client_name).toBe("Jane Doe");
    expect(result.client_email).toBe("jane@example.com");
    expect(result.client_phone).toBe("987654321");
    expect(result.client_phone_country_code).toBe("+351");
    expect(result.client_country).toBe("Spain");
    expect(result.client_language).toBe("Spanish");
    expect(result.client_selected_date).toBe("2024-12-26T10:00:00.000Z");
    expect(result.client_message).toBe("Updated message");
    expect(result.tour_id).toBe("tour-456");
    expect(result.status).toBe("confirmed");
    expect(result.price).toBe(200);
    expect(result.payment_status).toBe("paid");
    expect(result.payment_method).toBe("card");
  });

  it("should handle null clientMessage", () => {
    const patch = {
      clientMessage: null,
    };

    const result = mapBookingPatchToUpdate(patch);

    expect(result.client_message).toBeNull();
  });

  it("should handle null paymentMethod", () => {
    const patch = {
      paymentMethod: null,
    };

    const result = mapBookingPatchToUpdate(patch);

    expect(result.payment_method).toBeNull();
  });

  it("should not include undefined fields", () => {
    const patch = {
      status: "confirmed" as const,
      clientName: undefined,
      price: undefined,
    };

    const result = mapBookingPatchToUpdate(patch);

    expect(result.status).toBe("confirmed");
    expect(result.client_name).toBeUndefined();
    expect(result.price).toBeUndefined();
    expect(Object.keys(result)).toHaveLength(1);
  });

  it("should handle falsy values (0, empty string, false)", () => {
    const patch = {
      price: 0,
      clientMessage: "",
    };

    const result = mapBookingPatchToUpdate(patch);

    // Should include falsy values (they are !== undefined)
    expect(result.price).toBe(0);
    expect(result.client_message).toBe("");
  });

  it("should return empty object when patch is empty", () => {
    const result = mapBookingPatchToUpdate({});

    expect(Object.keys(result)).toHaveLength(0);
  });

  it("should handle all status values", () => {
    const statuses: Booking["status"][] = ["pending", "confirmed", "cancelled"];

    statuses.forEach((status) => {
      const result = mapBookingPatchToUpdate({ status });
      expect(result.status).toBe(status);
    });
  });

  it("should handle all payment status values", () => {
    const paymentStatuses: Booking["paymentStatus"][] = ["pending", "paid", "failed"];

    paymentStatuses.forEach((paymentStatus) => {
      const result = mapBookingPatchToUpdate({ paymentStatus });
      expect(result.payment_status).toBe(paymentStatus);
    });
  });

  it("should handle all payment method values", () => {
    const paymentMethods: Booking["paymentMethod"][] = ["bank_transfer", "card", "cash", null];

    paymentMethods.forEach((paymentMethod) => {
      const result = mapBookingPatchToUpdate({ paymentMethod });
      expect(result.payment_method).toBe(paymentMethod);
    });
  });
});

