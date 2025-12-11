/**
 * Vehicle Mapper
 * 
 * Maps Prismic Vehicle documents to our Vehicle type.
 */

import * as prismic from "@prismicio/client"
import type { Vehicle } from "../types"
import { asText, mapImage } from "../shared"

/**
 * Map a Prismic Vehicle document to our Vehicle type
 */
export const mapVehicle = (
  document: prismic.PrismicDocument | null | undefined
): Vehicle | null => {
  if (!document?.data) return null

  const data = document.data as {
    name?: unknown
    seats?: number
    description?: unknown
    image?: unknown
  }

  const mappedImage = mapImage(data.image)
  if (!mappedImage) return null

  return {
    id: document.id,
    name: asText(data.name),
    seats: data.seats || 0,
    description: asText(data.description) || "",
    image: mappedImage,
  }
}

