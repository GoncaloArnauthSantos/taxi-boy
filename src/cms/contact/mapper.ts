/**
 * Contacts Mapper
 * 
 * Maps Prismic Contacts documents to our Contacts type.
 */

import type { Contact } from "../types"
import type * as prismic from "@prismicio/client"

/**
 * Map a Prismic Contacts document to our Contacts type
 */
const mapContacts = (
  document: prismic.PrismicDocument | null | undefined
): Contact | null => {
  if (!document?.data) return null
  
  const data = document.data as {
    email?: string
    phone?: string
    address?: string
  }

  return {
    id: document.id,
    uid: document.uid || undefined,
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
  }
}

export default mapContacts;