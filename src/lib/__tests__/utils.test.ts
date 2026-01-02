import { describe, it, expect } from "vitest";
import {
  cn,
  getLanguageFlag,
  getIcon,
  buildMailtoLink,
  buildWhatsAppLink,
  phonePreview,
} from "../utils";

describe("cn", () => {
  it("should merge multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle undefined and null values", () => {
    expect(cn("foo", undefined, "bar", null)).toBe("foo bar");
  });

  it("should merge Tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should handle empty strings", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });
});

describe("getLanguageFlag", () => {
  it("should return correct flag for known languages", () => {
    expect(getLanguageFlag("English")).toBe("🇬🇧");
    expect(getLanguageFlag("Portuguese")).toBe("🇵🇹");
    expect(getLanguageFlag("French")).toBe("🇫🇷");
    expect(getLanguageFlag("German")).toBe("🇩🇪");
    expect(getLanguageFlag("Spanish")).toBe("🇪🇸");
    expect(getLanguageFlag("Italian")).toBe("🇮🇹");
  });

  it("should return default flag for unknown language", () => {
    expect(getLanguageFlag("Unknown")).toBe("🌐");
    expect(getLanguageFlag("Japanese")).toBe("🌐");
  });

  it("should be case sensitive", () => {
    expect(getLanguageFlag("english")).toBe("🌐");
    expect(getLanguageFlag("ENGLISH")).toBe("🌐");
  });

  it("should handle empty string", () => {
    expect(getLanguageFlag("")).toBe("🌐");
  });
});

describe("getIcon", () => {
  it("should return icon component for known icon names", () => {
    expect(getIcon("Globe")).toBeDefined();
    expect(getIcon("Clock")).toBeDefined();
    expect(getIcon("Star")).toBeDefined();
    expect(getIcon("MessageCircle")).toBeDefined();
  });

  it("should return null for unknown icon name", () => {
    expect(getIcon("Unknown")).toBeNull();
    expect(getIcon("InvalidIcon")).toBeNull();
  });

  it("should return null for undefined", () => {
    expect(getIcon(undefined)).toBeNull();
  });

  it("should be case sensitive", () => {
    expect(getIcon("globe")).toBeNull();
    expect(getIcon("GLOBE")).toBeNull();
  });
});

describe("buildMailtoLink", () => {
  it("should build mailto link with subject", () => {
    const result = buildMailtoLink("test@example.com");
    expect(result).toBe("mailto:test@example.com?subject=Private+tour+request");
  });

  it("should encode email correctly", () => {
    const result = buildMailtoLink("user+test@example.com");
    // URLSearchParams doesn't encode + in email addresses (which is correct)
    expect(result).toContain("user+test@example.com");
  });

  it("should handle email with special characters", () => {
    const result = buildMailtoLink("test.email@example-domain.com");
    expect(result).toContain("test.email@example-domain.com");
  });

  it("should always include subject parameter", () => {
    const result = buildMailtoLink("test@example.com");
    expect(result).toContain("subject=Private+tour+request");
  });
});

describe("buildWhatsAppLink", () => {
  it("should build WhatsApp link with default message", () => {
    const result = buildWhatsAppLink("351912345678");
    expect(result).toContain("https://wa.me/351912345678");
    expect(result).toContain("text=");
  });

  it("should clean phone number (remove non-digits)", () => {
    const result = buildWhatsAppLink("+351 912 345 678");
    expect(result).toContain("https://wa.me/351912345678");
  });

  it("should use custom message when provided", () => {
    const customMessage = "Custom message";
    const result = buildWhatsAppLink("351912345678", customMessage);
    expect(result).toContain(encodeURIComponent(customMessage));
  });

  it("should encode message correctly", () => {
    const message = "Hello! I'm interested.";
    const result = buildWhatsAppLink("351912345678", message);
    expect(result).toContain(encodeURIComponent(message));
  });

  it("should handle phone with spaces, hyphens, and parentheses", () => {
    const result = buildWhatsAppLink("+351 (912) 345-678");
    expect(result).toContain("https://wa.me/351912345678");
  });

  it("should use default message when message is empty string", () => {
    const result = buildWhatsAppLink("351912345678", "");
    // Should still contain the default message
    expect(result).toContain("text=");
  });
});

describe("phonePreview", () => {
  it("should format phone number correctly", () => {
    expect(phonePreview("912345678")).toBe("(9123) 45678");
  });

  it("should handle phone numbers of different lengths", () => {
    expect(phonePreview("1234567890")).toBe("(1234) 567890");
  });

  it("should handle short phone numbers", () => {
    expect(phonePreview("1234")).toBe("(1234) ");
  });

  it("should handle very long phone numbers", () => {
    const longNumber = "123456789012345";
    expect(phonePreview(longNumber)).toBe("(1234) 56789012345");
  });
});

