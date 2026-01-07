/**
 * Dynamic Robots.txt Generator
 * 
 * Generates robots.txt dynamically.
 * Explicitly allows public pages and blocks private/admin pages.
 * 
 * Next.js will serve this at /robots.txt
 */

import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";

/**
 * Generate robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/", // Home page
          "/tours", // Tours listing page
          "/tours/", // Tour detail pages (dynamic routes)
          "/booking", // Booking page
          "/contact", // Contact page
        ],
        disallow: [
          "/admin/", // Block all admin pages from being indexed
          "/api/", // Block all API routes from being indexed
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

