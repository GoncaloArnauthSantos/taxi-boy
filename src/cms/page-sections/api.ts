/**
 * PageSection API
 * 
 * Server-side functions to fetch PageSection data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import { mapPageSection } from "./mapper"
import type { PageSection } from "../types"
import { logError } from "../shared/logger"

/**
 * Fetch a PageSection by UID
 * 
 * @param uid - The UID of the PageSection document
 * @returns The PageSection data or null if not found
 */
export const getPageSectionByUID = async (uid: string): Promise<PageSection | null> => {
  try { 
    const client = createClient()
    const document = await client.getByUID("homepagesection", uid)

    if (!document) {
      return null
    }

    return mapPageSection(document)
  } catch (error) {
    logError("Failed to fetch PageSection by UID", error, { pageSectionUID: uid, function: "getPageSectionByUID" })
    return null
  }
}