/**
 * Dynamic Sitemap Generator
 * 
 * Generates sitemap.xml dynamically for all public pages.
 * Automatically includes static pages and dynamic tour pages from CMS.
 * Uses real last publication dates from Prismic when available.
 * 
 * Next.js will serve this at /sitemap.xml
 */

import { MetadataRoute } from "next";
import { createClient } from "@/cms/client";
import { logError, LogModule } from "@/lib/logger";
import { getBaseUrl } from "@/lib/seo";
import * as prismic from "@prismicio/client";

/**
 * Generate sitemap with all public pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tours`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/booking`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Fetch all tours from CMS for dynamic routes
  let tourPages: MetadataRoute.Sitemap = [];
  
  try {
    const client = createClient();
    const response = await client.getByType("tour", {
      fetchLinks: [
        "location.label",
        "included_item.label",
      ],
    });

    tourPages = response.results
      .filter((document: prismic.PrismicDocument) => document.uid) // Only include tours with UID
      .map((document: prismic.PrismicDocument) => ({
        url: `${baseUrl}/tours/${document.uid}`,
        lastModified: document.last_publication_date 
          ? new Date(document.last_publication_date)
          : undefined, // Use real publication date from Prismic, or omit if not available
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch (error) {
    logError({
      message: "Failed to fetch tours for sitemap",
      error,
      context: { function: "sitemap" },
      module: LogModule.CMS,
    });
  }

  return [...staticPages, ...tourPages];
}

