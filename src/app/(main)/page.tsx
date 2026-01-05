import { Metadata } from "next"
import Banner from "@/components/Banner"
import WhyChooseUs from "@/components/WhyChooseUs"
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
      <section className="relative bg-primary text-primary-foreground overflow-hidden" data-testid="home-hero-section">
        <Banner events={bannerEvents} />
      </section>

      <div className="flex flex-col md:contents">
        <section className="py-10 lg:py-24 bg-muted/30 order-2 md:order-none" data-testid="home-why-choose-us">
          <WhyChooseUs content={whyChooseUsContent} />
        </section>

        <section id="tours" className="py-16 lg:py-24 bg-background order-1 md:order-none" data-testid="home-tours-section">
          <PopularTours content={popularToursSection} tours={popularTours} />
        </section>
      </div>

      <section className="py-10 lg:py-24 bg-primary text-primary-foreground">
        <ReadyToExplore content={readyToExploreContent}/>
      </section>

      <section id="contact" className="py-10 lg:py-24 bg-muted/30" data-testid="home-contact-section">
        <ContactUs content={contactUsContent} driver={driver} contactInfo={contactInfo} />
      </section>
    </>
  )
}

export default HomePage;