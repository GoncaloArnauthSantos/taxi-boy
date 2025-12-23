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
    logError(
      "Failed to fetch vehicle by ID",
      error,
      { vehicleId: id, function: "getVehicleByID" },
      LogModule.CMS
    )
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
    logError(
      "Failed to fetch vehicle by UID",
      error,
      { vehicleUID: uid, function: "getVehicleByUID" },
      LogModule.CMS
    )
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
    logError(
      "Failed to fetch vehicles",
      error,
      {
        function: "getAllVehicles",
        pageSize: options?.pageSize,
        page: options?.page,
      },
      LogModule.CMS
    )
    return []
  }
};

