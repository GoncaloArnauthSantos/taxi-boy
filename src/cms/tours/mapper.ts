/**
 * Tour Mapper
 *
 * Maps Prismic Tour documents to our Tour type.
 */

import * as prismic from "@prismicio/client";
import type { Tour, Location } from "../types";
import { asText, mapImage } from "../shared";
import { mapLocation } from "../locations";

/**
 * Map a Prismic Tour document to our Tour type
 */
export const mapTour = async (
  document: prismic.PrismicDocument
): Promise<Tour> => {
  const data = document.data as {
    title?: unknown;
    description?: unknown;
    long_description?: unknown;
    locations?: Array<{
      locations?: unknown;
    }>;
    banner_image?: unknown;
    images?: Array<{
      image?: unknown;
    }>;
    duration1?: string;
    price?: number;
    included_items?: Array<{
      included_item?: unknown;
    }>;
  };

  const includedItems = mapIncludedItems(data.included_items);
  const locations = mapTourLocations(data.locations);
  const bannerImage = mapImage(data.banner_image);

  // Map images array
  const images = (data.images || [])
    .map((imgGroup) => mapImage(imgGroup.image))
    .filter((img): img is NonNullable<typeof img> => img !== null);

  // Convert duration1 from string to number
  const duration = data.duration1 ? parseInt(data.duration1, 10) : 0;

  return {
    id: document.id,
    uid: document.uid || "",
    title: asText(data.title) || "",
    description: asText(data.description) || "",
    longDescription: asText(data.long_description) || "",
    locations,
    bannerImage,
    images,
    duration,
    price: data.price || 0,
    includedItems,
  };
}

/**
 * Map multiple Prismic Tour documents
 */
export const mapTours = async (
  documents: prismic.PrismicDocument[]
): Promise<Tour[]> => {
  return Promise.all(documents.map(mapTour));
}

/**
 * Map included items from Prismic Tour document
 * Extracts label text from resolved included_item documents
 */
const mapIncludedItems = (
  includedItems: Array<{ included_item?: unknown }> | undefined
): string[] => {
  if (!includedItems) return [];

  return includedItems
    .map((itemGroup) => {
      const item = itemGroup.included_item;

      // If item has 'data', it was resolved via fetchLinks - extract text directly
      if (item && typeof item === "object" && "data" in item) {
        const itemDoc = item as prismic.PrismicDocument;
        const itemData = itemDoc.data as { label?: string };
        return itemData.label || "";
      }

      return "";
    })
    .filter((item): item is string => item !== "");
}

/**
 * Map locations from Prismic Tour document
 * Expects locations to be resolved via fetchLinks
 */
const mapTourLocations = (
  locations: Array<{ locations?: unknown }> | undefined
): Location[] => {
  if (!locations) return [];

  return locations
    .map((locationGroup) => {
      const location = locationGroup.locations;

      // Location should be resolved via fetchLinks - extract directly
      if (location && typeof location === "object" && "data" in location) {
        return mapLocation(location as prismic.PrismicDocument);
      }

      // If not resolved, return null (should not happen if fetchLinks is configured correctly)
      return null;
    })
    .filter((location): location is Location => location !== null);
}