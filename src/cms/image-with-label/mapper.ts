/**
 * ImageWithLabel Mapper
 * 
 * Maps Prismic ImageWithLabel documents to our ImageWithLabel type.
 */

import * as prismic from "@prismicio/client"
import type { ImageWithLabel } from "../types"
import { asText, mapImage } from "../shared"

/**
 * Map a Prismic ImageWithLabel document to our ImageWithLabel type
 */
export const mapImageWithLabel = (
  document: prismic.PrismicDocument | null | undefined
): ImageWithLabel | null => {
  if (!document?.data) return null

  const data = document.data as {
    image?: unknown
    label?: unknown
    title?: unknown
    iconname?: string
  }

  const mappedImage = mapImage(data.image)

  return {
    id: document.id,
    image: mappedImage,
    label: asText(data.label) || "",
    title: asText(data.title) || "",
    iconName: data.iconname || "",
  }
}

/**
 * Map multiple Prismic ImageWithLabel documents
 */
export const mapImageWithLabels = (
  documents: prismic.PrismicDocument[]
): ImageWithLabel[] => {
  return documents
    .map((doc) => mapImageWithLabel(doc))
    .filter((item): item is ImageWithLabel => item !== null)
}

