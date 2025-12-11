/**
 * Location Mapper
 * 
 * Maps Prismic Location documents to our Location type.
 */

import * as prismic from "@prismicio/client"
import type { Location } from "../types"

/**
 * Map a Prismic Location document to our Location type
 */
export const mapLocation = (
  document: prismic.PrismicDocument | null | undefined
): Location | null => {
  if (!document?.data) return null

  const data = document.data as {
    label?: string
  }

  return {
    id: document.id,
    value: data.label || "",
  }
}

/**
 * Map multiple Prismic Location documents
 */
export const mapLocations = (
  documents: prismic.PrismicDocument[]
): Location[] => {
  return documents
    .map((doc) => mapLocation(doc))
    .filter((location): location is Location => location !== null)
}

