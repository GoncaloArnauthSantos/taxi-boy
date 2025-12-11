import WhyChooseUs from "@/components/WhyChooseUs"
import Banner from "@/components/Banner"
import PopularTours from "@/components/PopularTours"
import ReadyToExplore from "@/components/ReadyToExplore"
import ContactUs from "@/components/ContactUs"
import { getDriver } from "@/cms/drivers"
import { getWhyChooseUs } from "@/cms/why-choose-us"
import { getPageSectionByUID } from "@/cms/page-sections"
import { getPopularTours } from "@/cms/tours"

const HomePage = async () => {
  const [driver, whyChooseUsContent, popularToursSection, popularTours, readyToExploreContent, contactUsContent] = await Promise.all([
    getDriver(),
    getWhyChooseUs(),
    getPageSectionByUID("tours-section"),
    getPopularTours(),
    getPageSectionByUID("ready-to-explore"),
    getPageSectionByUID("get-in-touch"),
  ]);

  return (
    <>
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <Banner />
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
        <ContactUs content={contactUsContent} driver={driver} />
      </section>
    </>
  )
}

export default HomePage;