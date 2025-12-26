import { Metadata } from "next"
import WhyChooseUs from "@/components/WhyChooseUs"
import Banner from "@/components/Banner"
import PopularTours from "@/components/PopularTours"
import ReadyToExplore from "@/components/ReadyToExplore"
import ContactUs from "@/components/ContactUs"
import { getDriver } from "@/cms/drivers"
import { getWhyChooseUs } from "@/cms/why-choose-us"
import { getPageSectionByUID } from "@/cms/page-sections"
import { getPopularTours } from "@/cms/tours"
import { getContacts } from "@/cms/contact"
import { getLiveBannerEvents } from "@/cms/banner-events"
import { getBaseUrl, generateOpenGraphMetadata, generateTwitterMetadata } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover Lisbon with personalized taxi tours led by a multilingual local driver. Custom itineraries, hidden gems, and unforgettable memories in Portugal's capital.",
  openGraph: generateOpenGraphMetadata({
    title: "Lisbon Taxi Tours - Premium Custom Tours",
    description:
      "Discover Lisbon with personalized taxi tours led by a multilingual local driver. Custom itineraries, hidden gems, and unforgettable memories.",
    url: getBaseUrl(),
  }),
  twitter: generateTwitterMetadata({
    title: "Lisbon Taxi Tours - Premium Custom Tours",
    description:
      "Discover Lisbon with personalized taxi tours led by a multilingual local driver. Custom itineraries, hidden gems, and unforgettable memories.",
  }),
  alternates: {
    canonical: getBaseUrl(),
  },
}

const HomePage = async () => {
  const [driver, whyChooseUsContent, popularToursSection, popularTours, readyToExploreContent, contactUsContent, contactInfo, bannerEvents] = await Promise.all([
    getDriver(),
    getWhyChooseUs(),
    getPageSectionByUID("tours-section"),
    getPopularTours(),
    getPageSectionByUID("ready-to-explore"),
    getPageSectionByUID("get-in-touch"),
    getContacts(),
    getLiveBannerEvents(),
  ]);

  return (
    <>
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <Banner events={bannerEvents} />
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <WhyChooseUs content={whyChooseUsContent} />
      </section>

      <section id="tours" className="py-16 lg:py-24 bg-background">
        <PopularTours content={popularToursSection} tours={popularTours} />
      </section>

      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <ReadyToExplore content={readyToExploreContent}/>
      </section>

      <section id="contact" className="py-16 lg:py-24 bg-muted/30">
        <ContactUs content={contactUsContent} driver={driver} contactInfo={contactInfo} />
      </section>
    </>
  )
}

export default HomePage;