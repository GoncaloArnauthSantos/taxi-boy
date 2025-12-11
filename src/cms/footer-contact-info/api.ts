/**
 * FooterContactInfo API
 * 
 * Server-side functions to fetch FooterContactInfo data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import mapFooterContactInfo from "./mapper"
import type { FooterContactInfo } from "../types"
import { logError } from "../shared/logger"

/**
 * Fetch the FooterContactInfo (useful for single-instance scenarios)
 * 
 * @returns The FooterContactInfo or null if none found
 */
export const getFooterContactInfo = async (): Promise<FooterContactInfo | null> => {
  try {
    const client = createClient()
    const response = await client.getByType("footer_contact_info", {
      pageSize: 1,
      orderings: [
        {
          field: "document.first_publication_date",
          direction: "desc",
        },
      ],
    })

    if (response.results.length === 0) {
      return null
    }

    return mapFooterContactInfo(response.results[0])
  } catch (error) {
    logError("Failed to fetch FooterContactInfo", error, { function: "getFooterContactInfo" })
    return null
  }
}
