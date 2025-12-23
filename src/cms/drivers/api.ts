/**
 * Driver API
 * 
 * Server-side functions to fetch driver data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import { mapDriver } from "./mapper"
import type { Driver } from "../types"
import { logError, LogModule } from "@/lib/logger"

/**
 * Fetch a driver
 * 
 * @returns The driver or null if none found
 */
export const getDriver = async (): Promise<Driver | null> => {
  try {
    const client = createClient()
    const response = await client.getByType("driver", {
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
    logError(
      "Failed to fetch driver",
      error,
      { function: "getDriver" },
      LogModule.CMS
    )
    return null
  }
}

export const getDriverLanguages = async (): Promise<string[]> => {
  const driver = await getDriver()
  if (!driver) {
    return []
  }

  return driver.languages
}