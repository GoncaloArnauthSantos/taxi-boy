/**
 * Structured Data (JSON-LD) Component
 * 
 * Generates JSON-LD structured data for SEO.
 * Helps search engines understand the content better.
 */

import type { Tour } from "@/cms/types";
import { getBaseUrl } from "@/lib/seo";

type Props = {
  tour: Tour;
};

/**
 * Generate JSON-LD structured data for a tour
 */
const StructuredData = ({ tour }: Props) => {
  const baseUrl = getBaseUrl();
  const tourUrl = `${baseUrl}/tours/${tour.uid}`;
  const imageUrl = tour.bannerImage?.url || `${baseUrl}/og-image.jpg`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.description || tour.longDescription,
    url: tourUrl,
    image: imageUrl,
    provider: {
      "@type": "LocalBusiness",
      name: "Lisbon Taxi Tours",
      description:
        "Premium custom taxi tours in Lisbon with multilingual driver",
    },
    offers: {
      "@type": "Offer",
      price: tour.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    duration: `PT${tour.duration}H`,
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.locations.map((location, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: location.value,
      })),
    },
    includes: tour.includedItems,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;

