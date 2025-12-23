/**
 * Location API
 * 
 * Server-side functions to fetch Location data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import { mapLocation, mapLocations } from "./mapper"
import type { Location } from "../types"
import { logError, LogModule } from "@/lib/logger"

/**
 * Fetch a Location by ID
 * 
 * @param id - The ID of the Location document
 * @returns The Location data or null if not found
 */
export const getLocationByID = async (id: string): Promise<Location | null> => {
  try {
    const client = createClient()
    const document = await client.getByID(id)

    if (document.type !== "location") {
      return null
    }

    return mapLocation(document)
  } catch (error) {
    logError({
      message: "Failed to fetch Location by ID",
      error,
      context: { locationId: id, function: "getLocationByID" },
      module: LogModule.CMS,
    })
    return null
  }
}

/**
 * Fetch all locations
 * 
 * @returns Array of all locations
 */
export const getAllLocations = async (): Promise<Location[]> => {
  try {
    const client = createClient()
    const response = await client.getByType("location")

    return mapLocations(response.results)
  } catch (error) {
    logError({
      message: "Failed to fetch all locations",
      error,
      context: { function: "getAllLocations" },
      module: LogModule.CMS,
    })
    return []
  }
}


