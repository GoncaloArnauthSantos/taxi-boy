import { Metadata } from "next"
import { getAllTours } from "@/cms/tours"
import { getAllLocations } from "@/cms/locations"
import { getPageSectionByUID } from "@/cms/page-sections"
import ToursPageClient from "@/components/tours/ToursPageClient"
import ToursPageClientSkeleton from "@/components/tours/ToursPageClientSkeleton"
import { Suspense } from "react"
import { getBaseUrl, generateOpenGraphMetadata, generateTwitterMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Lisbon Tours - Go Lisbon Tours | All Our Tours",
  description:
    "Explore our complete collection of Lisbon tours. From city highlights to hidden gems, discover the perfect Lisbon tour for your visit. Book your personalized tour today.",
  keywords: [
    "lisbon tours",
    "go lisbon tours",
    "lisbon taxi tours",
    "lisbon private tours",
    "lisbon custom tours",
    "portugal tours",
    "lisbon sightseeing",
    "lisbon day tours",
    "lisbon city tours",
    "sintra tours",
    "belem tours",
    "cascais tours",
  ],
  openGraph: generateOpenGraphMetadata({
    title: "Lisbon Tours - Go Lisbon Tours | All Our Tours",
    description:
      "Explore our complete collection of Lisbon tours. From city highlights to hidden gems, discover the perfect Lisbon tour for your visit.",
    url: `${getBaseUrl()}/tours`,
  }),
  twitter: generateTwitterMetadata({
    title: "Lisbon Tours - Go Lisbon Tours | All Our Tours",
    description:
      "Explore our complete collection of Lisbon tours. From city highlights to hidden gems, discover the perfect Lisbon tour for your visit.",
  }),
  alternates: {
    canonical: `${getBaseUrl()}/tours`,
  },
}

/**
 * Server Component that fetches tours and page content from CMS
 * Passes data to client component for filtering
 */
const ToursPage = async () => {
  const [tours, locations, heroContent] = await Promise.all([
    getAllTours(),
    getAllLocations(),
    getPageSectionByUID("tours-page"),
  ])

  return (
    <>
      {heroContent && (
        <section className="bg-primary text-primary-foreground py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-balance">
              {heroContent.title}
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              {heroContent.label}
            </p>
          </div>
        </section>
      )}

      <Suspense fallback={<ToursPageClientSkeleton />}>
        <ToursPageClient tours={tours} locations={locations} />
      </Suspense>
    </>
  )
}

export default ToursPage;