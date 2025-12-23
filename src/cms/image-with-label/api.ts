/**
 * ImageWithLabel API
 * 
 * Server-side functions to fetch ImageWithLabel data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import type { ImageWithLabel } from "../types"
import { logError, LogModule } from "@/lib/logger"
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
    logError(
      "Failed to fetch ImageWithLabel by ID",
      error,
      { imageWithLabelId: id, function: "getImageWithLabelByID" },
      LogModule.CMS
    )
    return null
  }
}

/**
 * Fetch an ImageWithLabel by UID
 * 
 * @param uid - The UID of the ImageWithLabel document
 * @returns The ImageWithLabel data or null if not found
 */
export const getImageWithLabelByUID = async (uid: string): Promise<ImageWithLabel | null> => {
  try {
    const client = createClient()
    const document = await client.getByUID("imagewithlabel", uid)

    if (!document || document.type !== "imagewithlabel") {
      return null
    }

    return mapImageWithLabel(document)
  } catch (error) {
    logError(
      "Failed to fetch ImageWithLabel by UID",
      error,
      { imageWithLabelUid: uid, function: "getImageWithLabelByUID" },
      LogModule.CMS
    )
    return null
  }
}
