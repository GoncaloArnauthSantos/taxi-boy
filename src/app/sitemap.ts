/**
 * Dynamic Sitemap Generator
 * 
 * Generates sitemap.xml dynamically for all public pages.
 * Automatically includes static pages and dynamic tour pages from CMS.
 * 
 * Next.js will serve this at /sitemap.xml
 */

import { MetadataRoute } from "next";
import { getAllTours } from "@/cms/tours";
import type { Tour } from "@/cms/types";
import { logError, LogModule } from "@/lib/logger";
import { getBaseUrl } from "@/lib/seo";

/**
 * Generate sitemap with all public pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Fetch all tours from CMS for dynamic routes
  let tourPages: MetadataRoute.Sitemap = [];
  
  try {
    const tours = await getAllTours();
    
    tourPages = tours
      .filter((tour: Tour) => tour.uid) // Only include tours with UID
      .map((tour: Tour) => ({
        url: `${baseUrl}/tours/${tour.uid}`,
        lastModified: new Date(),
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

