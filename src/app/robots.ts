/**
 * Dynamic Robots.txt Generator
 * 
 * Generates robots.txt dynamically.
 * Allows all search engines to crawl the site, except admin pages.
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
        allow: "/",
        disallow: [
          "/admin/", // Block admin pages from being indexed
          "/api/", // Block API routes from being indexed
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

