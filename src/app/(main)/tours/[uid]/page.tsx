import { Metadata } from "next";
import { getAllTours, getTourByUID } from "@/cms/tours";
import { notFound } from "next/navigation";
import Hero from "@/components/tourDetails/Hero";
import BookingCard from "@/components/tourDetails/BookingCard";
import Gallery from "@/components/tourDetails/Gallery";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Check } from "lucide-react";
import { logError, LogModule } from "@/lib/logger";
import { getDriverLanguages } from "@/cms/drivers/api";
import { getBaseUrl, generateOpenGraphMetadata, generateTwitterMetadata } from "@/lib/seo";
import StructuredData from "@/components/seo/StructuredData";

export const generateStaticParams = async () => {
  try {
    const tours = await getAllTours();
    return tours
      .filter((tour) => tour.uid) // Only include tours with UID
      .map((tour) => ({
        uid: tour.uid,
      }));
  } catch (error) {
    logError({
      message: "Failed to fetch tours for static generation",
      error,
      context: {
        function: "generateStaticParams",
      },
      module: LogModule.CMS,
    });
    return [];
  }
}

type Props = {
  params: Promise<{ uid: string }>;
};

/**
 * Generate metadata for tour detail page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uid } = await params;
  const tour = await getTourByUID(uid);

  if (!tour) {
    return {
      title: "Tour Not Found",
    };
  }

  const baseUrl = getBaseUrl();
  const tourUrl = `${baseUrl}/tours/${tour.uid}`;
  const imageUrl = tour.bannerImage?.url || `${baseUrl}/og-image.jpg`;
  const locationsText = tour.locations.map((loc) => loc.value).join(", ");

  return {
    title: tour.title,
    description: tour.description || tour.longDescription,
    keywords: [
      "Lisbon",
      "taxi tours",
      tour.title,
      ...tour.locations.map((loc) => loc.value),
    ],
    openGraph: generateOpenGraphMetadata({
      title: tour.title,
      description: tour.description || tour.longDescription,
      url: tourUrl,
      image: imageUrl,
      type: "article",
    }),
    twitter: generateTwitterMetadata({
      title: tour.title,
      description: tour.description || tour.longDescription,
      image: imageUrl,
    }),
    alternates: {
      canonical: tourUrl,
    },
    other: {
      "article:published_time": new Date().toISOString(),
      "article:section": "Tours",
      "article:tag": locationsText,
    },
  };
}

const TourDetailsPage = async ({ params }: Props) => {
  const { uid } = await params;
  const [tour, languages] = await Promise.all([
    getTourByUID(uid),
    getDriverLanguages(),
  ]);

  if (!tour) {
    notFound();
  }

  const { longDescription, locations, includedItems } = tour;

  return (
    <>
      <StructuredData tour={tour} />
      <section className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        <Hero tour={tour} />
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">
                  About This Tour
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                  {longDescription}
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">
                  Locations Visited
                </h2>
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <Badge
                      key={location.id}
                      variant="secondary"
                      className="px-4 py-2 text-sm"
                    >
                      <MapPin className="w-3 h-3 mr-1.5" />
                      {location.value}
                    </Badge>
                  ))}
                </div>
              </div>

              {includedItems.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">
                    What&apos;s Included
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {includedItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-accent-foreground" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Gallery tour={tour} />
            </div>

            <div className="lg:col-span-1">
              <BookingCard tour={tour} languages={languages} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TourDetailsPage;