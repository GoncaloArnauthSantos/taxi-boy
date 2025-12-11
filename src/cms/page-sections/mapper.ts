/**
 * PageSection Mapper
 * 
 * Maps Prismic PageSection documents to our PageSection type.
 */

import * as prismic from "@prismicio/client"
import type { PageSection } from "../types"
import { asText } from "../shared"

/**
 * Map a Prismic PageSection document to our PageSection type
 */
export const mapPageSection = (
  document: prismic.PrismicDocument | null | undefined
): PageSection | null => {
  if (!document?.data) return null

  const data = document.data as {
    title?: unknown
    label?: unknown
    button_text?: string
   }

  return {
    id: document.id,
    uid: document.uid || undefined,
    title: asText(data.title) || "",
    label: asText(data.label) || "",
    buttonText: data.button_text || "",
  }
}
