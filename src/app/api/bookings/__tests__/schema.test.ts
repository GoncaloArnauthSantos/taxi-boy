import { describe, it, expect } from "vitest";
import {
  bookingFormSchema,
  bookingPatchSchema,
  transformFormToBooking,
} from "../schema";

describe("bookingFormSchema", () => {
  const validFormData = {
    name: "John Doe",
    email: "john@example.com",
    phonePhoneCountryCode: "+351",
    phoneNumber: "912345678",
    country: "Portugal",
    language: "English",
    tourId: "tour-123",
    date: new Date(Date.now() + 86400000), // Tomorrow
    message: "Optional message",
  };

  describe("name validation", () => {
    it("should accept valid name", () => {
      const result = bookingFormSchema.safeParse(validFormData);

      expect(result.success).toBe(true);
    });

    it("should reject name shorter than 2 characters", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        name: "A",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "at least 2 characters"
        );
      }
    });

    it("should reject name longer than 100 characters", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        name: "A".repeat(101),
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "less than 100 characters"
        );
      }
    });

    it("should accept names with accented characters", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        name: "José María O'Connor-Smith",
      });

      expect(result.success).toBe(true);
    });

    it("should reject names with numbers", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        name: "John123",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "only contain letters"
        );
      }
    });

    it("should reject names with special characters (except allowed ones)", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        name: "John@Doe",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("email validation", () => {
    it("should accept valid email", () => {
      const result = bookingFormSchema.safeParse(validFormData);

      expect(result.success).toBe(true);
    });

    it("should reject invalid email format", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        email: "invalid-email",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid email address");
      }
    });

    it("should reject email without @", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        email: "johnexample.com",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("phonePhoneCountryCode validation", () => {
    it("should accept valid country code", () => {
      const result = bookingFormSchema.safeParse(validFormData);

      expect(result.success).toBe(true);
    });

    it("should reject empty country code", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        phonePhoneCountryCode: "",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Country code is required"
        );
      }
    });
  });

  describe("phoneNumber validation", () => {
    it("should accept valid phone number", () => {
      const result = bookingFormSchema.safeParse(validFormData);

      expect(result.success).toBe(true);
    });

    it("should accept phone number with formatting", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        phoneNumber: "(912) 345-678",
      });

      expect(result.success).toBe(true);
    });

    it("should reject phone number shorter than 6 digits", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        phoneNumber: "12345",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain("at least 6 digits");
      }
    });

    it("should reject phone number longer than 15 digits", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        phoneNumber: "1".repeat(16),
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain("less than 15 digits");
      }
    });

    it("should reject phone number with invalid characters", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        phoneNumber: "912345678@",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain("only contain digits");
      }
    });
  });

  describe("country validation", () => {
    it("should accept valid country name", () => {
      const result = bookingFormSchema.safeParse(validFormData);

      expect(result.success).toBe(true);
    });

    it("should reject country shorter than 2 characters", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        country: "A",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "at least 2 characters"
        );
      }
    });

    it("should reject country longer than 100 characters", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        country: "A".repeat(101),
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "less than 100 characters"
        );
      }
    });
  });

  describe("language validation", () => {
    it("should accept valid language", () => {
      const result = bookingFormSchema.safeParse(validFormData);

      expect(result.success).toBe(true);
    });

    it("should reject empty language", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        language: "",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "select a preferred language"
        );
      }
    });
  });

  describe("tourId validation", () => {
    it("should accept valid tour ID", () => {
      const result = bookingFormSchema.safeParse(validFormData);

      expect(result.success).toBe(true);
    });

    it("should reject empty tour ID", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        tourId: "",
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain("select a tour");
      }
    });
  });

  describe("date validation", () => {
    it("should accept future date", () => {
      const result = bookingFormSchema.safeParse(validFormData);

      expect(result.success).toBe(true);
    });

    it("should accept today's date", () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        date: today,
      });

      expect(result.success).toBe(true);
    });

    it("should reject past date", () => {
      const yesterday = new Date();

      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const result = bookingFormSchema.safeParse({
        ...validFormData,
        date: yesterday,
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "today or in the future"
        );
      }
    });

    it("should reject invalid date", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        date: "invalid-date",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("message validation", () => {
    it("should accept valid message", () => {
      const result = bookingFormSchema.safeParse(validFormData);

      expect(result.success).toBe(true);
    });

    it("should accept missing message (optional)", () => {
      const { message: _message, ...dataWithoutMessage } = validFormData;

      const result = bookingFormSchema.safeParse(dataWithoutMessage);

      expect(result.success).toBe(true);
    });

    it("should accept empty message", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        message: "",
      });

      expect(result.success).toBe(true);
    });

    it("should reject message longer than 1000 characters", () => {
      const result = bookingFormSchema.safeParse({
        ...validFormData,
        message: "A".repeat(1001),
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "less than 1000 characters"
        );
      }
    });
  });

  describe("complete form validation", () => {
    it("should accept complete valid form", () => {
      const result = bookingFormSchema.safeParse(validFormData);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validFormData);
      }
    });

    it("should reject form with multiple errors", () => {
      const result = bookingFormSchema.safeParse({
        name: "A",
        email: "invalid",
        phonePhoneCountryCode: "",
        phoneNumber: "123",
        country: "A",
        language: "",
        tourId: "",
        date: new Date("2020-01-01"),
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });
  });
});

describe("bookingPatchSchema", () => {
  describe("status validation", () => {
    it("should accept valid status values", () => {
      expect(bookingPatchSchema.safeParse({ status: "pending" }).success).toBe(
        true
      );

      expect(
        bookingPatchSchema.safeParse({ status: "confirmed" }).success
      ).toBe(true);

      expect(
        bookingPatchSchema.safeParse({ status: "cancelled" }).success
      ).toBe(true);
    });

    it("should reject invalid status", () => {
      const result = bookingPatchSchema.safeParse({ status: "invalid" });

      expect(result.success).toBe(false);
    });

    it("should accept missing status (optional)", () => {
      const result = bookingPatchSchema.safeParse({});

      expect(result.success).toBe(true);
    });
  });

  describe("paymentStatus validation", () => {
    it("should accept valid payment status values", () => {
      expect(
        bookingPatchSchema.safeParse({ paymentStatus: "pending" }).success
      ).toBe(true);

      expect(
        bookingPatchSchema.safeParse({ paymentStatus: "paid" }).success
      ).toBe(true);

      expect(
        bookingPatchSchema.safeParse({ paymentStatus: "failed" }).success
      ).toBe(true);

    });

    it("should reject invalid payment status", () => {
      const result = bookingPatchSchema.safeParse({
        paymentStatus: "invalid",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("paymentMethod validation", () => {
    it("should accept valid payment method values", () => {
      expect(
        bookingPatchSchema.safeParse({ paymentMethod: "bank_transfer" }).success
      ).toBe(true);

      expect(
        bookingPatchSchema.safeParse({ paymentMethod: "card" }).success
      ).toBe(true);

      expect(
        bookingPatchSchema.safeParse({ paymentMethod: "cash" }).success
      ).toBe(true);
    });

    it("should reject invalid payment method", () => {
      const result = bookingPatchSchema.safeParse({
        paymentMethod: "invalid",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("price validation", () => {
    it("should accept positive price", () => {
      const result = bookingPatchSchema.safeParse({ price: 100 });
      
      expect(result.success).toBe(true);
    });

    it("should reject negative price", () => {
      const result = bookingPatchSchema.safeParse({ price: -10 });

      expect(result.success).toBe(false);
    });

    it("should reject zero price", () => {
      const result = bookingPatchSchema.safeParse({ price: 0 });

      expect(result.success).toBe(false);
    });

    it("should accept missing price (optional)", () => {
      const result = bookingPatchSchema.safeParse({});

      expect(result.success).toBe(true);
    });
  });

  describe("clientMessage validation", () => {
    it("should accept valid message", () => {
      const result = bookingPatchSchema.safeParse({
        clientMessage: "Test message",
      });

      expect(result.success).toBe(true);
    });

    it("should reject message longer than 1000 characters", () => {
      const result = bookingPatchSchema.safeParse({
        clientMessage: "A".repeat(1001),
      });

      expect(result.success).toBe(false);
    });

    it("should accept missing message (optional)", () => {
      const result = bookingPatchSchema.safeParse({});

      expect(result.success).toBe(true);
    });
  });

  describe("clientSelectedDate validation", () => {
    it("should accept future date string", () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const result = bookingPatchSchema.safeParse({
        clientSelectedDate: futureDate,
      });

      expect(result.success).toBe(true);
    });

    it("should accept today's date string", () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const result = bookingPatchSchema.safeParse({
        clientSelectedDate: today.toISOString(),
      });

      expect(result.success).toBe(true);
    });

    it("should reject past date string", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const result = bookingPatchSchema.safeParse({
        clientSelectedDate: yesterday.toISOString(),
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "today or in the future"
        );
      }
    });

    it("should accept missing date (optional)", () => {
      const result = bookingPatchSchema.safeParse({});

      expect(result.success).toBe(true);
    });
  });

  describe("strict mode", () => {
    it("should reject unknown fields", () => {
      const result = bookingPatchSchema.safeParse({
        status: "pending",
        unknownField: "value",
      });

      expect(result.success).toBe(false);
    });

    it("should accept partial updates", () => {
      const result = bookingPatchSchema.safeParse({
        status: "confirmed",
      });

      expect(result.success).toBe(true);
    });

    it("should accept multiple fields", () => {
      const result = bookingPatchSchema.safeParse({
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "card",
        price: 150,
      });

      expect(result.success).toBe(true);
    });
  });
});

describe("transformFormToBooking", () => {
  const validFormData = {
    name: "John Doe",
    email: "john@example.com",
    phonePhoneCountryCode: "+351",
    phoneNumber: "912345678",
    country: "Portugal",
    language: "English",
    tourId: "tour-123",
    date: new Date("2024-12-25T10:00:00Z"),
    message: "Test message",
  };

  it("should transform form data to booking correctly", () => {
    const result = transformFormToBooking(validFormData, 100);

    expect(result.clientName).toBe("John Doe");
    expect(result.clientEmail).toBe("john@example.com");
    expect(result.clientPhone).toBe("912345678");
    expect(result.clientPhoneCountryCode).toBe("+351");
    expect(result.clientCountry).toBe("Portugal");
    expect(result.clientLanguage).toBe("English");
    expect(result.tourId).toBe("tour-123");
    expect(result.price).toBe(100);
  });

  it("should set correct default values", () => {
    const result = transformFormToBooking(validFormData, 100);

    expect(result.status).toBe("pending");
    expect(result.paymentStatus).toBe("pending");
    expect(result.paymentMethod).toBeNull();
  });

  it("should format date as ISO string", () => {
    const result = transformFormToBooking(validFormData, 100);

    expect(result.clientSelectedDate).toBe("2024-12-25T10:00:00.000Z");
  });

  it("should set message to null when message is undefined", () => {
    const { message: _message, ...dataWithoutMessage } = validFormData;
    const result = transformFormToBooking(dataWithoutMessage, 100);

    expect(result.clientMessage).toBeNull();
  });

  it("should preserve empty string message (not convert to null)", () => {
    const result = transformFormToBooking(
      { ...validFormData, message: "" },
      100
    );

    // Empty string is preserved, only undefined/null becomes null
    expect(result.clientMessage).toBe("");
  });

  it("should preserve message when provided", () => {
    const result = transformFormToBooking(validFormData, 100);

    expect(result.clientMessage).toBe("Test message");
  });

  it("should use provided price", () => {
    const result = transformFormToBooking(validFormData, 250);

    expect(result.price).toBe(250);
  });
});
