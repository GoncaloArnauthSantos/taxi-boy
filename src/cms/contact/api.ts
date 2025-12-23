/**
 * Contacts API
 * 
 * Server-side functions to fetch Contacts data from Prismic.
 * These functions should only be called from Server Components or API routes.
 */

import { createClient } from "../client"
import mapContacts from "./mapper"
import { logError, LogModule } from "@/lib/logger"
import type { Contact } from "../types"

/**
 * Fetch the Contacts 
 * 
 * @returns The Contacts or null if none found
 */
export const getContacts = async (): Promise<Contact | null> => {
  try {
    const client = createClient()
    const response = await client.getByType("contacts")

    if (response.results.length === 0) {
      return null
    }

    return mapContacts(response.results[0])
  } catch (error) {
    logError({
      message: "Failed to fetch Contacts",
      error,
      context: { function: "getContacts" },
      module: LogModule.CMS,
    })
    return null
  }
}
