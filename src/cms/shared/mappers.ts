/**
 * Shared CMS Mapper Utilities
 * 
 * Generic helper functions for mapping Prismic data types.
 * These are used across all CMS type mappers.
 */

import * as prismic from "@prismicio/client"
import type { CMSImage } from "../types"

/**
 * Extract plain text from Prismic Rich Text
 */
export const asText = (richText: unknown): string => {
  if (!richText) return ""
  return prismic.asText(richText as prismic.RichTextField)
}

/**
 * Extract HTML from Prismic Rich Text
 */
export const asHTML = (richText: unknown): string => {
  if (!richText) return ""
  return prismic.asHTML(richText as prismic.RichTextField)
}

/**
 * Map Prismic Image to our CMSImage type
 */
export const mapImage = (image: unknown): CMSImage | null => {
  const img = image as prismic.ImageField | null | undefined
  if (!img?.url) return null

  return {
    id: img.id || "",
    url: img.url,
    alt: img.alt || "",
    copyright: img.copyright || "",
    dimensions: img.dimensions ? {
      width: img.dimensions.width,
      height: img.dimensions.height,
    } : {
      width: 0,
      height: 0,
    },
  }
}

