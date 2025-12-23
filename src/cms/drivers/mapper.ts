/**
 * Driver Mapper
 * 
 * Maps Prismic Driver documents to our Driver type.
 */

import * as prismic from "@prismicio/client"
import type { Driver, Vehicle } from "../types"
import { asText, mapImage } from "../shared"
import { getVehicleByID, mapVehicle } from "../vehicles"
import { logError, LogModule } from "@/lib/logger"

/**
 * Map a Prismic Driver document to our Driver type
 */
export const mapDriver = async (
  document: prismic.PrismicDocument
): Promise<Driver> => {
  
  const data = document.data as {
    name?: unknown
    label?: unknown
    description?: unknown
    photo?: unknown
    languages?: Array<{
      language?: unknown
    }>
    vehicles?: Array<{
      vehicle?: unknown
    }>
  }

  // Map vehicles - use resolved documents from fetchLinks if available, otherwise fetch them
  const vehiclesPromises = (data.vehicles || []).map(async (vehicleGroup) => {
    const vehicle = vehicleGroup.vehicle

    // If vehicle has 'data', it was resolved via fetchLinks - use it directly
    if (vehicle && typeof vehicle === "object" && "data" in vehicle) {
      return mapVehicle(vehicle as prismic.PrismicDocument)
    }

    // Otherwise, fetch the vehicle by ID
    if (vehicle && typeof vehicle === "object" && "id" in vehicle) {
      return await getVehicleByID(vehicle.id as string)
    }

    return null
  })

  const vehicles = (await Promise.all(vehiclesPromises)).filter(
    (vehicle): vehicle is Vehicle => vehicle !== null
  )

  const mappedPhoto = mapImage(data.photo)
  if (!mappedPhoto) {
    logError({
      message: "Driver photo is missing",
      context: {
        driverId: document.id,
        function: "mapDriver",
      },
      module: LogModule.CMS,
    })

    throw new Error(`Driver photo is required for driver ${document.id}`)
  }

  return {
    id: document.id,
    name: asText(data.name),
    label: asText(data.label),
    description: asText(data.description),
    photo: mappedPhoto,
    languages: (data.languages || []).map((lang) => asText(lang.language)),
    vehicles,
  }
}
