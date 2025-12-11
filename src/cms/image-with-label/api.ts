/**
 * ImageWithLabel API
 * 
 * Server-side functions to fetch ImageWithLabel data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import type { ImageWithLabel } from "../types"
import { logError } from "../shared/logger"
import { mapImageWithLabel } from "./mapper"

/**
 * Fetch an ImageWithLabel by ID
 * 
 * @param id - The ID of the ImageWithLabel document
 * @returns The ImageWithLabel data or null if not found
 */
export const getImageWithLabelByID = async (id: string): Promise<ImageWithLabel | null> => {
  try {
    const client = createClient()
    const document = await client.getByID(id)

    if (document.type !== "imagewithlabel") {
      return null
    }

    return mapImageWithLabel(document)
  } catch (error) {
    logError("Failed to fetch ImageWithLabel by ID", error, { imageWithLabelId: id, function: "getImageWithLabelByID" })
    return null
  }
} 