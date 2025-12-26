/**
 * Banner Event Mapper
 *
 * Maps Prismic BannerEvent documents to our BannerEvent type.
 */

import * as prismic from "@prismicio/client";
import type { BannerEvent, BannerEventStatus } from "../types";
import { asText, mapImage } from "../shared";

/**
 * Map a Prismic BannerEvent document to our BannerEvent type
 */
export const mapBannerEvent = (
  document: prismic.PrismicDocument
): BannerEvent => {
  const data = document.data as {
    title?: string;
    description?: unknown;
    shortdescription?: string;
    image?: unknown;
    status?: string;
  };

  // Map status with default to "draft"
  const status = (data.status as BannerEventStatus) || "draft";

  return {
    id: document.id,
    title: data.title || "",
    description: asText(data.description) || "",
    shortDescription: data.shortdescription || "",
    image: mapImage(data.image),
    status,
  };
};

/**
 * Map multiple Prismic BannerEvent documents
 */
export const mapBannerEvents = (
  documents: prismic.PrismicDocument[]
): BannerEvent[] => {
  return documents.map(mapBannerEvent);
};

