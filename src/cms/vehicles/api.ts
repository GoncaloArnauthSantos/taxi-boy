/**
 * Vehicle API
 * 
 * Server-side functions to fetch vehicle data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import { mapVehicle } from "./mapper"
import type { Vehicle } from "../types"
import { logError, LogModule } from "@/lib/logger"

/**
 * Fetch a vehicle by ID
 * 
 * @param id - The ID of the vehicle document
 * @returns The vehicle data or null if not found
 */
export const getVehicleByID = async (id: string): Promise<Vehicle | null> => {
  try {
    const client = createClient()
    const document = await client.getByID(id)

    if (document.type !== "vehicle") {
      return null
    }

    return mapVehicle(document)
  } catch (error) {
    logError({
      message: "Failed to fetch vehicle by ID",
      error,
      context: { vehicleId: id, function: "getVehicleByID" },
      module: LogModule.CMS,
    })
    return null
  }
}

/**
 * Fetch a vehicle by UID
 * 
 * @param uid - The UID of the vehicle document
 * @returns The vehicle data or null if not found
 */
export const getVehicleByUID = async (uid: string): Promise<Vehicle | null> => {
  try {
    const client = createClient()
    const document = await client.getByUID("vehicle", uid)

    if (!document) {
      return null
    }

    return mapVehicle(document)
  } catch (error) {
    logError({
      message: "Failed to fetch vehicle by UID",
      error,
      context: { vehicleUID: uid, function: "getVehicleByUID" },
      module: LogModule.CMS,
    })
    return null
  }
}

/**
 * Fetch all vehicles
 * 
 * @param options - Optional query options
 * @returns Array of vehicles
 */
export const getAllVehicles = async (options?: {
  pageSize?: number;
  page?: number;
}): Promise<Vehicle[]> => {
  try {
    const client = createClient()
    const response = await client.getByType("vehicle", {
      pageSize: options?.pageSize || 100,
      page: options?.page || 1,
      orderings: [
        {
          field: "document.first_publication_date",
          direction: "desc",
        },
      ],
    })

    return response.results
      .map((doc) => mapVehicle(doc))
      .filter((vehicle): vehicle is Vehicle => vehicle !== null)
  } catch (error) {
    logError({
      message: "Failed to fetch vehicles",
      error,
      context: {
        function: "getAllVehicles",
        pageSize: options?.pageSize,
        page: options?.page,
      },
      module: LogModule.CMS,
    })
    return []
  }
};

