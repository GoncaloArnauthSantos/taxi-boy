/**
 * WhyChooseUs API
 * 
 * Server-side functions to fetch WhyChooseUs data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import { mapWhyChooseUs } from "./mapper"
import type { WhyChooseUs } from "../types"
import { logError } from "../shared/logger"

/**
 * Fetch the first WhyChooseUs (useful for single-instance scenarios)
 * 
 * @returns The first WhyChooseUs or null if none found
 */
export const getWhyChooseUs = async (): Promise<WhyChooseUs | null> => {
  try {
    const client = createClient()
    const response = await client.getByType("chooseus", {
      fetchLinks: [
        "imagewithlabel.label",
        "imagewithlabel.title",
        "imagewithlabel.image",
        "imagewithlabel.iconname",
      ],
    })

    if (response.results.length === 0) {
      return null
    }

    return await mapWhyChooseUs(response.results[0])
  } catch (error) {
    logError("Failed to fetch WhyChooseUs", error, { function: "getWhyChooseUs" })
    return null
  }
}

export default getWhyChooseUs;