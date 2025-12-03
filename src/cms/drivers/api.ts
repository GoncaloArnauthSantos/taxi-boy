/**
 * Driver API
 * 
 * Server-side functions to fetch driver data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import { mapDriver, mapDrivers } from "./mapper"
import type { Driver } from "../types"
import { logError } from "../shared/logger"

/**
 * Fetch a driver by ID
 * 
 * @param id - The ID of the driver document
 * @returns The driver data or null if not found
 */
export async function getDriverByID(id: string): Promise<Driver | null> {
  try {
    const client = createClient()
    const document = await client.getByID(id, {
      fetchLinks: [
        "vehicle.name",
        "vehicle.seats",
        "vehicle.description",
        "vehicle.image",
      ],
    })

    if (document.type !== "driver") {
      return null
    }

    return await mapDriver(document)
  } catch (error) {
    logError("Failed to fetch driver by ID", error, { driverId: id, function: "getDriverByID" })
    return null
  }
}

/**
 * Fetch a driver by UID
 * 
 * @param uid - The UID of the driver document
 * @returns The driver data or null if not found
 */
export async function getDriverByUID(uid: string): Promise<Driver | null> {
  try {
    const client = createClient()
    const document = await client.getByUID("driver", uid, {
      fetchLinks: [
        "vehicle.name",
        "vehicle.seats",
        "vehicle.description",
        "vehicle.image",
      ],
    })

    if (!document) {
      return null
    }

    return await mapDriver(document)
  } catch (error) {
    logError("Failed to fetch driver by UID", error, { driverUID: uid, function: "getDriverByUID" })
    return null
  }
}

/**
 * Fetch the first driver (useful for single-driver scenarios)
 * 
 * @returns The first driver or null if none found
 */
export async function getFirstDriver(): Promise<Driver | null> {
  try {
    const client = createClient()
    const response = await client.getByType("driver", {
      pageSize: 1,
      orderings: [
        {
          field: "document.first_publication_date",
          direction: "desc",
        },
      ],
      fetchLinks: [
        "vehicle.name",
        "vehicle.seats",
        "vehicle.description",
        "vehicle.image",
      ],
    })

    if (response.results.length === 0) {
      return null
    }

    return await mapDriver(response.results[0])
  } catch (error) {
    logError("Failed to fetch first driver", error, { function: "getFirstDriver" })
    return null
  }
}

/**
 * Fetch all drivers
 * 
 * @param options - Optional query options
 * @returns Array of drivers
 */
export async function getAllDrivers(options?: {
  pageSize?: number
  page?: number
}): Promise<Driver[]> {
  try {
    const client = createClient()
    const response = await client.getByType("driver", {
      pageSize: options?.pageSize || 100,
      page: options?.page || 1,
      orderings: [
        {
          field: "document.first_publication_date",
          direction: "desc",
        },
      ],
      fetchLinks: [
        "vehicle.name",
        "vehicle.seats",
        "vehicle.description",
        "vehicle.image",
      ],
    })

    return await mapDrivers(response.results)
  } catch (error) {
    logError("Failed to fetch drivers", error, {
      function: "getAllDrivers",
      pageSize: options?.pageSize,
      page: options?.page,
    })
    return []
  }
}
