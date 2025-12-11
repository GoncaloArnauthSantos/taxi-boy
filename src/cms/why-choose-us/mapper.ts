/**
 * WhyChooseUs Mapper
 *
 * Maps Prismic WhyChooseUs documents to our WhyChooseUs type.
 */

import * as prismic from "@prismicio/client";
import type { WhyChooseUs, ImageWithLabel } from "../types";
import { asText } from "../shared";
import { getImageWithLabelByID, mapImageWithLabel } from "../image-with-label";

/**
 * Map a Prismic WhyChooseUs document to our WhyChooseUs type
 */
export const mapWhyChooseUs = async (
  document: prismic.PrismicDocument
): Promise<WhyChooseUs> => {
  const data = document.data as {
    title?: unknown;
    label?: unknown;
    reasons?: Array<{
      reason?: unknown;
    }>;
  };

  // Map reasons - use resolved documents from fetchLinks if available, otherwise fetch them
  const reasonsPromises = (data.reasons || []).map(async (reasonGroup) => {
    const reason = reasonGroup.reason;

    // If reason has 'data', it was resolved via fetchLinks - use it directly
    if (reason && typeof reason === "object" && "data" in reason) {
      return mapImageWithLabel(reason as prismic.PrismicDocument);
    }

    // Otherwise, fetch the ImageWithLabel by ID
    if (reason && typeof reason === "object" && "id" in reason) {
      return await getImageWithLabelByID(reason.id as string);
    }

    return null;
  });

  const reasons = (await Promise.all(reasonsPromises)).filter(
    (reason): reason is ImageWithLabel => reason !== null
  );

  return {
    id: document.id,
    title: asText(data.title) || "",
    label: asText(data.label) || "",
    reasons,
  };
}
