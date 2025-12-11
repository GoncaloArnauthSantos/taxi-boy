/**
 * Prismic CMS Client
 * 
 * Creates and configures the Prismic client for fetching content.
 */

import * as prismic from "@prismicio/client"

export const createClient = () => {
  const endpoint = process.env.CMS_ENDPOINT

  if (!endpoint) {
    throw new Error(
      "CMS_ENDPOINT environment variable is required. " +
      "Please set it in your .env.local file."
    )
  }

  const client = prismic.createClient(endpoint)
  return client
}

