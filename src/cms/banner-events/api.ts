/**
 * Banner Event API
 *
 * Server-side functions to fetch BannerEvent data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client";
import { mapBannerEvent, mapBannerEvents } from "./mapper";
import type { BannerEvent, BannerEventStatus } from "../types";
import { logError, LogModule } from "@/lib/logger";
import * as prismic from "@prismicio/client";

type PrismicFilter = ReturnType<typeof prismic.filter.at>;

/**
 * Fetch all banner events
 *
 * @param options - Optional query options
 * @returns Array of banner events
 */
export const getAllBannerEvents = async (options?: {
  pageSize?: number;
  page?: number;
  status?: BannerEventStatus;
}): Promise<BannerEvent[]> => {
  try {
    const client = createClient();
    const filters: PrismicFilter[] = [];

    if (options?.status) {
      filters.push(
        prismic.filter.at("my.bannerevent.status", options.status)
      );
    }

    const response = await client.getByType("bannerevent", {
      filters
    });
    // const response = await client.getByType("bannerevent");

    return mapBannerEvents(response.results);
  } catch (error) {
    logError({
      message: "Failed to fetch banner events",
      error,
      context: {
        function: "getAllBannerEvents",
        pageSize: options?.pageSize,
        page: options?.page,
        status: options?.status,
      },
      module: LogModule.CMS,
    });
    return [];
  }
};

/**
 * Fetch only live banner events (for display)
 *
 * @returns Array of live banner events (max 5)
 */
export const getLiveBannerEvents = async (): Promise<BannerEvent[]> => {
  try {
    const events = await getAllBannerEvents({ status: "live" });
    // Return max 5 events, ordered by publication date
    return events.slice(0, 5);
  } catch (error) {
    logError({
      message: "Failed to fetch live banner events",
      error,
      context: { function: "getLiveBannerEvents" },
      module: LogModule.CMS,
    });
    return [];
  }
};

/**
 * Fetch a banner event by ID
 *
 * @param id - The ID of the banner event document
 * @returns The banner event data or null if not found
 */
export const getBannerEventByID = async (
  id: string
): Promise<BannerEvent | null> => {
  try {
    const client = createClient();
    const document = await client.getByID(id);

    if (document.type !== "bannerevent") {
      return null;
    }

    return mapBannerEvent(document);
  } catch (error) {
    logError({
      message: "Failed to fetch banner event by ID",
      error,
      context: { bannerEventId: id, function: "getBannerEventByID" },
      module: LogModule.CMS,
    });
    return null;
  }
};

