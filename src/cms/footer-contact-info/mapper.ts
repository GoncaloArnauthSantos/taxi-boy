/**
 * FooterContactInfo Mapper
 * 
 * Maps Prismic FooterContactInfo documents to our FooterContactInfo type.
 */

import * as prismic from "@prismicio/client"
import type { FooterContactInfo } from "../types"
import { asHTML } from "../shared"

/**
 * Map a Prismic FooterContactInfo document to our FooterContactInfo type
 */
const mapFooterContactInfo = (
  document: prismic.PrismicDocument | null | undefined
): FooterContactInfo | null => {
  if (!document?.data) return null

  const data = document.data as {
    email?: unknown
    phonenumber?: unknown
    location?: unknown
  }

  return {
    id: document.id,
    uid: document.uid || undefined,
    email: asHTML(data.email) || "",
    phoneNumber: asHTML(data.phonenumber) || "",
    location: asHTML(data.location) || "",
  }
}

export default mapFooterContactInfo;