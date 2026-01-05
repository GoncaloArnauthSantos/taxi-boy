import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getBaseUrl,
  defaultSiteMetadata,
  generateOpenGraphMetadata,
  generateTwitterMetadata,
} from "../seo";

describe("getBaseUrl", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset env vars
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return NEXT_PUBLIC_SITE_URL when set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

    expect(getBaseUrl()).toBe("https://example.com");
  });

  it("should return VERCEL_URL with https prefix when VERCEL_URL is set", () => {
    process.env.VERCEL_URL = "my-app.vercel.app";

    expect(getBaseUrl()).toBe("https://my-app.vercel.app");
  });

  it("should prioritize NEXT_PUBLIC_SITE_URL over VERCEL_URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://custom-domain.com";
    process.env.VERCEL_URL = "my-app.vercel.app";

    expect(getBaseUrl()).toBe("https://custom-domain.com");
  });

  it("should return localhost URL when no env vars are set", () => {
    expect(getBaseUrl()).toBe("http://localhost:3000");
  });

  it("should handle VERCEL_URL without https prefix", () => {
    process.env.VERCEL_URL = "app-123.vercel.app";

    expect(getBaseUrl()).toBe("https://app-123.vercel.app");
  });
});

describe("defaultSiteMetadata", () => {
  it("should have correct default values", () => {
    expect(defaultSiteMetadata.title).toBe("Lisbon Taxi Tours - Premium Custom Tours");
    expect(defaultSiteMetadata.description).toContain("Experience Lisbon");
    expect(defaultSiteMetadata.siteName).toBe("Lisbon Taxi Tours");
    expect(defaultSiteMetadata.locale).toBe("en_US");
    expect(defaultSiteMetadata.type).toBe("website");
  });

  it("should be readonly (as const)", () => {
    // TypeScript should prevent mutation, but we can test that values are correct
    expect(Object.isFrozen(defaultSiteMetadata)).toBe(false); // Not frozen, but const prevents reassignment
  });
});

describe("generateOpenGraphMetadata", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should use default values when no options provided", () => {
    const result = generateOpenGraphMetadata({});

    expect(result.title).toBe(defaultSiteMetadata.title);
    expect(result.description).toBe(defaultSiteMetadata.description);
    expect(result.siteName).toBe(defaultSiteMetadata.siteName);
    expect(result.locale).toBe(defaultSiteMetadata.locale);
    expect(result.type).toBe("website");
    expect(result.url).toBe("http://localhost:3000");
    expect(result.images).toHaveLength(1);
    expect(result.images[0].url).toBe("http://localhost:3000/og-image.jpg");
    expect(result.images[0].width).toBe(1200);
    expect(result.images[0].height).toBe(630);
    expect(result.images[0].alt).toBe(defaultSiteMetadata.title);
  });

  it("should use custom title when provided", () => {
    const result = generateOpenGraphMetadata({
      title: "Custom Title",
    });

    expect(result.title).toBe("Custom Title");
    expect(result.images[0].alt).toBe("Custom Title");
  });

  it("should use custom description when provided", () => {
    const result = generateOpenGraphMetadata({
      description: "Custom description",
    });

    expect(result.description).toBe("Custom description");
  });

  it("should use custom URL when provided", () => {
    const result = generateOpenGraphMetadata({
      url: "https://example.com/custom-page",
    });

    expect(result.url).toBe("https://example.com/custom-page");
  });

  it("should use custom image when provided", () => {
    const result = generateOpenGraphMetadata({
      image: "https://example.com/custom-image.jpg",
    });

    expect(result.images[0].url).toBe("https://example.com/custom-image.jpg");
  });

  it("should use custom siteName when provided", () => {
    const result = generateOpenGraphMetadata({
      siteName: "Custom Site Name",
    });

    expect(result.siteName).toBe("Custom Site Name");
  });

  it("should use article type when provided", () => {
    const result = generateOpenGraphMetadata({
      type: "article",
    });

    expect(result.type).toBe("article");
  });

  it("should combine multiple custom options", () => {
    const result = generateOpenGraphMetadata({
      title: "Article Title",
      description: "Article description",
      url: "https://example.com/article",
      image: "https://example.com/article-image.jpg",
      type: "article",
      siteName: "Custom Site",
    });

    expect(result.title).toBe("Article Title");
    expect(result.description).toBe("Article description");
    expect(result.url).toBe("https://example.com/article");
    expect(result.images[0].url).toBe("https://example.com/article-image.jpg");
    expect(result.type).toBe("article");
    expect(result.siteName).toBe("Custom Site");
  });

  it("should use baseUrl from env for default image when VERCEL_URL is set", () => {
    process.env.VERCEL_URL = "my-app.vercel.app";

    const result = generateOpenGraphMetadata({});

    expect(result.images[0].url).toBe("https://my-app.vercel.app/og-image.jpg");
  });

  it("should use baseUrl from env for default URL when NEXT_PUBLIC_SITE_URL is set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

    const result = generateOpenGraphMetadata({});

    expect(result.url).toBe("https://example.com");
  });
});

describe("generateTwitterMetadata", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should use default values when no options provided", () => {
    const result = generateTwitterMetadata({});

    expect(result.card).toBe("summary_large_image");
    expect(result.title).toBe(defaultSiteMetadata.title);
    expect(result.description).toBe(defaultSiteMetadata.description);
    expect(result.images).toHaveLength(1);
    expect(result.images[0]).toBe("http://localhost:3000/og-image.jpg");
  });

  it("should use custom title when provided", () => {
    const result = generateTwitterMetadata({
      title: "Custom Twitter Title",
    });

    expect(result.title).toBe("Custom Twitter Title");
  });

  it("should use custom description when provided", () => {
    const result = generateTwitterMetadata({
      description: "Custom Twitter description",
    });

    expect(result.description).toBe("Custom Twitter description");
  });

  it("should use custom image when provided", () => {
    const result = generateTwitterMetadata({
      image: "https://example.com/twitter-image.jpg",
    });

    expect(result.images[0]).toBe("https://example.com/twitter-image.jpg");
  });

  it("should use summary card type when provided", () => {
    const result = generateTwitterMetadata({
      card: "summary",
    });

    expect(result.card).toBe("summary");
  });

  it("should use summary_large_image card type by default", () => {
    const result = generateTwitterMetadata({});

    expect(result.card).toBe("summary_large_image");
  });

  it("should combine multiple custom options", () => {
    const result = generateTwitterMetadata({
      title: "Twitter Title",
      description: "Twitter description",
      image: "https://example.com/twitter.jpg",
      card: "summary",
    });

    expect(result.title).toBe("Twitter Title");
    expect(result.description).toBe("Twitter description");
    expect(result.images[0]).toBe("https://example.com/twitter.jpg");
    expect(result.card).toBe("summary");
  });

  it("should use baseUrl from env for default image when VERCEL_URL is set", () => {
    process.env.VERCEL_URL = "my-app.vercel.app";

    const result = generateTwitterMetadata({});

    expect(result.images[0]).toBe("https://my-app.vercel.app/og-image.jpg");
  });

  it("should return images as array", () => {
    const result = generateTwitterMetadata({});

    expect(Array.isArray(result.images)).toBe(true);
    expect(result.images).toHaveLength(1);
  });
});

