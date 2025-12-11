/**
 * Tour API
 * 
 * Server-side functions to fetch Tour data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import { mapTour, mapTours } from "./mapper"
import type { Tour } from "../types"
import { logError } from "../shared/logger"
import * as prismic from "@prismicio/client"

/**
 * Fetch a tour by ID
 * 
 * @param id - The ID of the tour document
 * @returns The tour data or null if not found
 */
export const getTourByID = async (id: string): Promise<Tour | null> => {
  try {
    const client = createClient()
    const document = await client.getByID(id, {
      fetchLinks: [
        "location.label",
        "included_item.label",
      ],
    })

    if (document.type !== "tour") {
      return null
    }

    return await mapTour(document)
  } catch (error) {
    logError("Failed to fetch tour by ID", error, { tourId: id, function: "getTourByID" })
    return null
  }
}

/**
 * Fetch a tour by UID
 * 
 * @param uid - The UID of the tour document
 * @returns The tour data or null if not found
 */
export const getTourByUID = async (uid: string): Promise<Tour | null> => {
  try {
    const client = createClient()
    const document = await client.getByUID("tour", uid, {
      fetchLinks: [
        "location.label",
        "included_item.label",
      ],
    })

    if (!document) {
      return null
    }

    return await mapTour(document)
  } catch (error) {
    logError("Failed to fetch tour by UID", error, { tourUID: uid, function: "getTourByUID" })
    return null
  }
}

/**
 * Fetch all tours
 * 
 * @param options - Optional query options
 * @returns Array of tours
 */
export const getAllTours = async (options?: {
  pageSize?: number
  page?: number
  orderings?: Array<{
    field: string
    direction: "asc" | "desc"
  }>
}): Promise<Tour[]> => {
  try {
    const client = createClient()
    const response = await client.getByType("tour", {
      fetchLinks: [
        "location.label",
        "included_item.label",
      ],
    })

    return await mapTours(response.results)
  } catch (error) {
    logError("Failed to fetch tours", error, {
      function: "getAllTours",
      pageSize: options?.pageSize,
      page: options?.page,
    })
    return []
  }
}

/**
 * Fetch popular tours
 * 
 * @returns Array of tours
 */
export const getPopularTours = async (): Promise<Tour[]> => {
  try {
    const client = createClient()
    const response = await client.getByType("tour", {
      filters: [
        prismic.filter.at("document.tags", ["popular tour"]),
      ],
      fetchLinks: [
        "location.label",
        "included_item.label",
      ],
    })

    return await mapTours(response.results)
  } catch (error) {
    logError("Failed to fetch popular tours", error, { function: "getPopularTours" })
    return []
  }
};

