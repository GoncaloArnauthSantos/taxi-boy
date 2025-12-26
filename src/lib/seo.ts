/**
 * SEO Utilities
 * 
 * Helper functions for generating SEO metadata, Open Graph tags, and structured data.
 */

/**
 * Get base URL dynamically
 * Works with any domain (vercel.app or custom domain)
 */
export const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

/**
 * Default site metadata
 */
export const defaultSiteMetadata = {
  title: "Lisbon Taxi Tours - Premium Custom Tours",
  description:
    "Experience Lisbon with a multilingual driver offering personalized taxi tours around the city and surrounding areas",
  siteName: "Lisbon Taxi Tours",
  locale: "en_US",
  type: "website",
} as const;

/**
 * Generate Open Graph metadata
 */
export const generateOpenGraphMetadata = (options: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  siteName?: string;
}) => {
  const baseUrl = getBaseUrl();
  const title = options.title || defaultSiteMetadata.title;
  const description = options.description || defaultSiteMetadata.description;
  const url = options.url || baseUrl;
  const image = options.image || `${baseUrl}/og-image.jpg`; // Default OG image
  const type = options.type || "website";
  const siteName = options.siteName || defaultSiteMetadata.siteName;

  return {
    title,
    description,
    url,
    siteName,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    locale: defaultSiteMetadata.locale,
    type,
  };
};

/**
 * Generate Twitter Card metadata
 */
export const generateTwitterMetadata = (options: {
  title?: string;
  description?: string;
  image?: string;
  card?: "summary" | "summary_large_image";
}) => {
  const baseUrl = getBaseUrl();
  const title = options.title || defaultSiteMetadata.title;
  const description = options.description || defaultSiteMetadata.description;
  const image = options.image || `${baseUrl}/og-image.jpg`;
  const card = options.card || "summary_large_image";

  return {
    card,
    title,
    description,
    images: [image],
  };
};

